import React, { useState, useEffect, useCallback, useMemo } from 'react';
import {
  APIProvider,
  Map,
  AdvancedMarker,
  Pin,
  InfoWindow,
  MapCameraChangedEvent,
  MapCameraProps,
} from '@vis.gl/react-google-maps';
import {
  MapPin,
  Navigation,
  Search,
  Phone,
  ExternalLink,
  Star,
  CheckCircle2,
  Calendar,
  Share2,
  Filter,
  RefreshCw,
  Sparkles,
  Award,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { useWhiteLabel } from '../context/WhiteLabelContext';

export interface Nutritionist {
  id: string;
  name: string;
  crn?: string;
  specialty: string;
  specialtyDesc?: string;
  address: string;
  lat: number;
  lng: number;
  rating: number;
  userRatingCount: number;
  phone?: string;
  website?: string | null;
  mapsUrl: string;
  openNow?: boolean;
  distanceMeters: number;
  distanceText: string;
  source?: string;
  consultationFee?: string;
  acceptsInsurance?: string;
  teleconsultation?: boolean;
}

const PRESET_CITIES = [
  { name: 'São Paulo (SP)', lat: -23.55052, lng: -46.633308 },
  { name: 'Rio de Janeiro (RJ)', lat: -22.906847, lng: -43.172896 },
  { name: 'Belo Horizonte (MG)', lat: -19.916681, lng: -43.934493 },
  { name: 'Curitiba (PR)', lat: -25.428954, lng: -49.267137 },
  { name: 'Brasília (DF)', lat: -15.797515, lng: -47.891887 },
  { name: 'Porto Alegre (RS)', lat: -30.034647, lng: -51.217659 },
];

const SPECIALTY_FILTERS = [
  'Todas',
  'Clínica & Doenças Crônicas',
  'Nutrição Esportiva',
  'Nutrição Funcional',
  'Comportamento Alimentar',
  'Materno-Infantil',
];

export const NutritionistFinderView: React.FC = () => {
  const { config, profile, history } = useWhiteLabel();

  // Coordinates state (defaults to São Paulo centro)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: -23.55052,
    lng: -46.633308,
  });
  const [hasUserGeo, setHasUserGeo] = useState<boolean>(false);
  const [camera, setCamera] = useState<MapCameraProps>({
    center: { lat: -23.55052, lng: -46.633308 },
    zoom: 14,
  });

  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('Todas');
  const [selectedRadius, setSelectedRadius] = useState<number>(8000);
  const [nutritionists, setNutritionists] = useState<Nutritionist[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [selectedNutri, setSelectedNutri] = useState<Nutritionist | null>(null);
  const [shareSuccess, setShareSuccess] = useState<boolean>(false);

  // API Key handling with fallback
  const apiKey =
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY ||
    'AIzaSyBgZN1KBhacg3fr4E9TEFTEzpqyD-3xrJU';

  // Request browser geolocation
  const detectUserLocation = useCallback(() => {
    if ('geolocation' in navigator) {
      setLoading(true);
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const newPos = { lat: pos.coords.latitude, lng: pos.coords.longitude };
          setUserLocation(newPos);
          setHasUserGeo(true);
          setCamera({ center: newPos, zoom: 14 });
          fetchNearbyNutritionists(newPos.lat, newPos.lng, selectedRadius, searchQuery);
        },
        (err) => {
          console.warn('Geolocation denied or unavailable:', err.message);
          setLoading(false);
          // Keep current city and fetch
          fetchNearbyNutritionists(userLocation.lat, userLocation.lng, selectedRadius, searchQuery);
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 }
      );
    } else {
      fetchNearbyNutritionists(userLocation.lat, userLocation.lng, selectedRadius, searchQuery);
    }
  }, [userLocation, selectedRadius, searchQuery]);

  // Fetch nutritionists from server-side proxy
  const fetchNearbyNutritionists = async (
    lat: number,
    lng: number,
    radius: number,
    query: string
  ) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const res = await fetch('/api/maps/nearby-nutritionists', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: lat,
          longitude: lng,
          radius,
          query,
        }),
      });

      const data = await res.json();
      if (data.success && Array.isArray(data.nutritionists)) {
        setNutritionists(data.nutritionists);
        if (data.nutritionists.length > 0) {
          setSelectedNutri(data.nutritionists[0]);
        }
      } else {
        setErrorMsg('Não foi possível obter nutricionistas nesta região.');
      }
    } catch (err: any) {
      console.error('Error fetching nutritionists:', err);
      setErrorMsg('Falha de conexão ao buscar nutricionistas.');
    } finally {
      setLoading(false);
    }
  };

  // Initial load: attempt geolocation or load defaults
  useEffect(() => {
    detectUserLocation();
  }, []);

  // Filtered nutritionists by specialty
  const filteredNutritionists = useMemo(() => {
    if (selectedSpecialty === 'Todas') return nutritionists;
    return nutritionists.filter((n) =>
      n.specialty.toLowerCase().includes(selectedSpecialty.toLowerCase())
    );
  }, [nutritionists, selectedSpecialty]);

  const handleCitySelect = (city: { name: string; lat: number; lng: number }) => {
    setUserLocation({ lat: city.lat, lng: city.lng });
    setCamera({ center: { lat: city.lat, lng: city.lng }, zoom: 14 });
    fetchNearbyNutritionists(city.lat, city.lng, selectedRadius, searchQuery);
  };

  const handleCameraChange = (ev: MapCameraChangedEvent) => {
    setCamera(ev.detail);
  };

  const handleShareHistoryWithNutri = (nutri: Nutritionist) => {
    const summary = `Olá ${nutri.name}! Gostaria de agendar uma consulta. Sou usuário do ${config.appName}. Minhas restrições alimentares ativas: ${
      profile.dietaryRestrictions.join(', ') || 'Nenhuma'
    }. Meta diária de calorias: ${profile.targetCalories} kcal. Total de produtos já catalogados no meu diário: ${
      history.length
    }.`;

    if (navigator.clipboard) {
      navigator.clipboard.writeText(summary);
      setShareSuccess(true);
      setTimeout(() => setShareSuccess(false), 3500);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white rounded-3xl p-6 sm:p-8 shadow-sm relative overflow-hidden">
        <div className="relative z-10 max-w-3xl space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/15 backdrop-blur-md rounded-full text-xs font-semibold uppercase tracking-wider text-emerald-100">
            <MapPin className="w-3.5 h-3.5" />
            Rede Credenciada & Google Maps
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Encontre o Nutricionista Mais Próximo
          </h1>
          <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
            Localize profissionais qualificados em tempo real próximos à sua casa ou trabalho.
            Compartilhe seu diário nutricional, histórico de escaneamentos e metas de saúde para um
            atendimento 100% individualizado.
          </p>

          <div className="pt-2 flex flex-wrap items-center gap-3">
            <button
              onClick={detectUserLocation}
              disabled={loading}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-800 font-semibold text-xs sm:text-sm rounded-xl shadow-sm hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer"
            >
              <Navigation className="w-4 h-4 text-emerald-600" />
              {hasUserGeo ? 'Atualizar Minha Localização GPS' : 'Detectar Minha Localização GPS'}
            </button>

            <span className="text-xs text-emerald-100/90 flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" />
              Profissionais verificados com registro CRN
            </span>
          </div>
        </div>

        {/* Decorative background circle */}
        <div className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full blur-2xl pointer-events-none" />
      </div>

      {/* Quick City Selector Bar */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none text-xs">
        <span className="text-slate-500 dark:text-slate-400 font-medium whitespace-nowrap flex items-center gap-1">
          <MapPin className="w-3.5 h-3.5 text-emerald-500" />
          Cidades Rápidas:
        </span>
        {PRESET_CITIES.map((city) => (
          <button
            key={city.name}
            onClick={() => handleCitySelect(city)}
            className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 whitespace-nowrap transition-colors cursor-pointer"
          >
            {city.name}
          </button>
        ))}
      </div>

      {/* Search & Filter Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        {/* Search input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Buscar bairro, clínica ou especialidade..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                fetchNearbyNutritionists(userLocation.lat, userLocation.lng, selectedRadius, searchQuery);
              }
            }}
            className="w-full pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 text-slate-900 dark:text-white"
          />
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-end overflow-x-auto">
          {/* Specialty filter */}
          <div className="flex items-center gap-1.5 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="py-1.5 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer text-xs"
            >
              {SPECIALTY_FILTERS.map((spec) => (
                <option key={spec} value={spec}>
                  {spec}
                </option>
              ))}
            </select>
          </div>

          {/* Radius selector */}
          <select
            value={selectedRadius}
            onChange={(e) => {
              const r = Number(e.target.value);
              setSelectedRadius(r);
              fetchNearbyNutritionists(userLocation.lat, userLocation.lng, r, searchQuery);
            }}
            className="py-1.5 px-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-700 dark:text-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 cursor-pointer text-xs"
          >
            <option value={3000}>Raio de 3 km</option>
            <option value={5000}>Raio de 5 km</option>
            <option value={8000}>Raio de 8 km</option>
            <option value={15000}>Raio de 15 km</option>
          </select>

          <button
            onClick={() =>
              fetchNearbyNutritionists(userLocation.lat, userLocation.lng, selectedRadius, searchQuery)
            }
            disabled={loading}
            className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-100 rounded-xl transition-colors cursor-pointer"
            title="Atualizar busca"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {shareSuccess && (
        <div className="p-3 bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300 rounded-xl text-xs sm:text-sm flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
          <span>
            Resumo do seu histórico nutricional copiado para a área de transferência! Cole na conversa com o nutricionista.
          </span>
        </div>
      )}

      {/* Main Grid: Interactive Map + Nutritionist Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Col: Interactive Google Maps Component (60%) */}
        <div className="lg:col-span-7 space-y-3">
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm flex flex-col">
            <div className="p-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <h3 className="font-semibold text-sm text-slate-900 dark:text-white">
                  Mapa Interativo de Especialistas
                </h3>
              </div>
              <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                {filteredNutritionists.length} consultórios encontrados
              </span>
            </div>

            {/* Map Container */}
            <div className="w-full h-[450px] sm:h-[520px] relative bg-slate-100 dark:bg-slate-950">
              <APIProvider apiKey={apiKey} libraries={['places', 'geometry']}>
                <Map
                  center={camera.center}
                  zoom={camera.zoom}
                  mapId={'DEMO_MAP_ID'}
                  onCameraChanged={handleCameraChange}
                  internalUsageAttributionIds={['gmp_git_agentskills_v1']}
                  style={{ width: '100%', height: '100%' }}
                  gestureHandling={'greedy'}
                  disableDefaultUI={false}
                >
                  {/* User Current Location Marker */}
                  <AdvancedMarker position={userLocation} title="Sua Localização">
                    <div className="relative flex items-center justify-center">
                      <span className="absolute w-8 h-8 bg-blue-500/30 rounded-full animate-ping" />
                      <div className="w-6 h-6 rounded-full bg-blue-600 border-2 border-white shadow-lg flex items-center justify-center text-white text-[10px] font-bold">
                        📍
                      </div>
                    </div>
                  </AdvancedMarker>

                  {/* Nutritionist Markers */}
                  {filteredNutritionists.map((nutri) => (
                    <AdvancedMarker
                      key={nutri.id}
                      position={{ lat: nutri.lat, lng: nutri.lng }}
                      onClick={() => {
                        setSelectedNutri(nutri);
                        setCamera((prev) => ({ ...prev, center: { lat: nutri.lat, lng: nutri.lng } }));
                      }}
                      title={nutri.name}
                    >
                      <Pin
                        background={selectedNutri?.id === nutri.id ? '#047857' : '#059669'}
                        glyphColor="#FFFFFF"
                        borderColor="#065f46"
                        scale={selectedNutri?.id === nutri.id ? 1.2 : 1.0}
                      />
                    </AdvancedMarker>
                  ))}

                  {/* InfoWindow for Selected Nutritionist */}
                  {selectedNutri && (
                    <InfoWindow
                      position={{ lat: selectedNutri.lat, lng: selectedNutri.lng }}
                      onCloseClick={() => setSelectedNutri(null)}
                    >
                      <div className="p-1 max-w-[240px] text-slate-900 font-sans">
                        <div className="flex items-center gap-1 text-emerald-700 font-semibold text-xs">
                          <Award className="w-3.5 h-3.5" />
                          <span>{selectedNutri.crn || 'Nutricionista'}</span>
                        </div>
                        <h4 className="font-bold text-sm mt-0.5 leading-snug">
                          {selectedNutri.name}
                        </h4>
                        <p className="text-[11px] text-slate-600 mt-1">
                          {selectedNutri.specialty}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500 font-mono">
                          <span className="flex items-center gap-0.5 text-amber-600 font-semibold">
                            <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                            {selectedNutri.rating} ({selectedNutri.userRatingCount})
                          </span>
                          <span>•</span>
                          <span>{selectedNutri.distanceText}</span>
                        </div>
                        <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center gap-2">
                          <a
                            href={selectedNutri.mapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-1 py-1 text-center bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs font-semibold"
                          >
                            Como Chegar
                          </a>
                        </div>
                      </div>
                    </InfoWindow>
                  )}
                </Map>
              </APIProvider>

              {loading && (
                <div className="absolute inset-0 bg-white/70 dark:bg-slate-900/70 backdrop-blur-xs flex items-center justify-center z-10">
                  <div className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 rounded-full shadow-md text-xs font-semibold text-emerald-600">
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Carregando nutricionistas mais próximos...
                  </div>
                </div>
              )}
            </div>

            {/* Mandatory Google Maps Compliance attribution */}
            <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-100 dark:border-slate-800 text-[11px] text-slate-500 dark:text-slate-400 flex items-center justify-between">
              <span>Localização aproximada baseada em GPS/Rede</span>
              <span className="font-medium">Google Maps</span>
            </div>
          </div>
        </div>

        {/* Right Col: Nutritionists Details & Contact Cards (40%) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-base text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              Nutricionistas Próximos
            </h3>
            <span className="text-xs text-slate-500">
              Ordenados por menor distância
            </span>
          </div>

          <div className="space-y-3 max-h-[580px] overflow-y-auto pr-1">
            {filteredNutritionists.length === 0 ? (
              <div className="p-8 text-center bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
                <AlertCircle className="w-8 h-8 text-slate-400 mx-auto mb-2" />
                <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                  Nenhum nutricionista encontrado para este filtro
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  Tente aumentar o raio de busca ou selecionar outra especialidade.
                </p>
              </div>
            ) : (
              filteredNutritionists.map((nutri) => {
                const isSelected = selectedNutri?.id === nutri.id;

                return (
                  <div
                    key={nutri.id}
                    onClick={() => {
                      setSelectedNutri(nutri);
                      setCamera((prev) => ({ ...prev, center: { lat: nutri.lat, lng: nutri.lng }, zoom: 15 }));
                    }}
                    className={`p-4 rounded-2xl border transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/30 border-emerald-500 shadow-sm'
                        : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 rounded text-[10px] font-bold">
                            {nutri.crn || 'CRN ATIVO'}
                          </span>
                          <span className="text-xs font-mono font-semibold text-emerald-600 dark:text-emerald-400">
                            {nutri.distanceText}
                          </span>
                        </div>
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white mt-1">
                          {nutri.name}
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                          {nutri.specialty}
                        </p>
                      </div>

                      {/* Rating */}
                      <div className="text-right shrink-0">
                        <div className="flex items-center gap-1 text-xs font-bold text-amber-500 bg-amber-50 dark:bg-amber-950/40 px-2 py-0.5 rounded-lg">
                          <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                          {nutri.rating}
                        </div>
                        <span className="text-[10px] text-slate-400">
                          {nutri.userRatingCount} reviews
                        </span>
                      </div>
                    </div>

                    {/* Specialty Description */}
                    {nutri.specialtyDesc && (
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2 leading-relaxed">
                        {nutri.specialtyDesc}
                      </p>
                    )}

                    {/* Address & Status */}
                    <div className="mt-3 pt-2.5 border-t border-slate-100 dark:border-slate-800/80 space-y-1 text-xs text-slate-500 dark:text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate">{nutri.address}</span>
                      </div>
                      {nutri.acceptsInsurance && (
                        <div className="flex items-center gap-1.5 text-emerald-700 dark:text-emerald-400 text-[11px]">
                          <CheckCircle2 className="w-3 h-3 text-emerald-500 shrink-0" />
                          <span>{nutri.acceptsInsurance}</span>
                        </div>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-3 pt-2 flex items-center gap-2">
                      <a
                        href={nutri.mapsUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="flex-1 inline-flex items-center justify-center gap-1.5 py-1.5 px-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-xs transition-colors"
                      >
                        <Navigation className="w-3.5 h-3.5" />
                        Como Chegar
                      </a>

                      {nutri.phone && (
                        <a
                          href={`tel:${nutri.phone.replace(/\D/g, '')}`}
                          onClick={(e) => e.stopPropagation()}
                          className="py-1.5 px-3 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1"
                          title="Ligar para o consultório"
                        >
                          <Phone className="w-3.5 h-3.5" />
                          <span className="hidden sm:inline">Ligar</span>
                        </a>
                      )}

                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleShareHistoryWithNutri(nutri);
                        }}
                        className="py-1.5 px-3 bg-emerald-50 dark:bg-emerald-950/40 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 rounded-xl text-xs font-semibold transition-colors flex items-center gap-1 cursor-pointer"
                        title="Copiar resumo do diário nutricional para consulta"
                      >
                        <Share2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline">Enviar Diário</span>
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>

      {/* Integration highlight card */}
      <div className="bg-slate-100 dark:bg-slate-900/60 rounded-2xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <h4 className="font-semibold text-sm text-slate-900 dark:text-white">
              Sincronização com seu Plano Alimentar
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Ao comparecer na consulta, apresente a aba <strong>Relatórios PDF</strong> com seu histórico de macronutrientes da Tabela TACO.
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-400 font-mono text-right shrink-0">
          Google Maps Platform
        </div>
      </div>
    </div>
  );
};
