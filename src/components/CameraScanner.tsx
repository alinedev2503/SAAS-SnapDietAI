import React, { useRef, useState, useEffect } from 'react';
import { Camera, X, Upload, Barcode, Sparkles, AlertCircle, RefreshCw, CheckCircle2, BookOpen, Tag } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useWhiteLabel } from '../context/WhiteLabelContext';
import { ProductScan, ScanCategory } from '../types/nutrition';

interface CameraScannerProps {
  isOpen: boolean;
  onClose: () => void;
  onScanComplete: (scan: ProductScan) => void;
}

export const CameraScanner: React.FC<CameraScannerProps> = ({ isOpen, onClose, onScanComplete }) => {
  const { t } = useTranslation();
  const { profile, addScan } = useWhiteLabel();
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [barcodeInput, setBarcodeInput] = useState<string>('');
  const [shelfPriceInput, setShelfPriceInput] = useState<string>('');
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [scanCategory, setScanCategory] = useState<ScanCategory>('industrializado');

  const samplePresets = [
    { label: t('modals.scanner.presetYogurt', '🥛 Iogurte Proteico (Saudável - A)'), barcode: '7891000100103' },
    { label: t('modals.scanner.presetSoda', '🥤 Refrigerante Cola (Nocivo - E)'), barcode: '7891000200204' },
  ];

  useEffect(() => {
    if (isOpen) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  const startCamera = async () => {
    setCameraError(null);
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError(t('modals.scanner.cameraError', 'Câmera indisponível no navegador ou permissão negada. Você pode enviar uma foto do rótulo ou testar pelos códigos numéricos abaixo.'));
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  const captureFrame = (): string | null => {
    if (!videoRef.current || !canvasRef.current) return null;
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;
    const ctx = canvas.getContext('2d');
    if (!ctx) return null;
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL('image/jpeg', 0.85);
  };

  const handleAnalyze = async (imageB64?: string, code?: string) => {
    setIsAnalyzing(true);
    try {
      const finalImage = imageB64 || capturedImage || captureFrame() || undefined;
      const finalBarcode = code || barcodeInput || undefined;

      const parsedShelfPrice = shelfPriceInput ? parseFloat(shelfPriceInput.replace(',', '.')) : undefined;

      const savedBudget = localStorage.getItem('snapdiet_weekly_budget');
      const weeklyBudget = savedBudget ? parseFloat(savedBudget) : 150.00;

      const response = await fetch('/api/gemini/analyze-product', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          imageBase64: finalImage,
          barcode: finalBarcode,
          userRestrictions: profile.dietaryRestrictions,
          scanCategory,
          shelfPrice: !isNaN(parsedShelfPrice as number) ? parsedShelfPrice : undefined,
          weeklyBudget,
        }),
      });

      const data = await response.json();
      if (data.success && data.product) {
        const savedScan = await addScan({ ...data.product, scanCategory });
        if (savedScan) {
          onScanComplete(savedScan);
          onClose();
        }
      } else {
        alert(t('modals.scanner.readError', 'Não foi possível ler o rótulo/prato. Tente novamente com mais clareza.'));
      }
    } catch (err) {
      console.error('Scan error:', err);
      alert(t('modals.scanner.generalError', 'Ocorreu um erro ao processar a leitura por IA.'));
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const b64 = reader.result as string;
        setCapturedImage(b64);
        handleAnalyze(b64);
      };
      reader.readAsDataURL(file);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl border border-slate-200 dark:border-slate-800 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between bg-slate-50 dark:bg-slate-950">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center text-emerald-600">
              <Camera className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">{t('modals.scanner.title')}</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">{t('modals.scanner.subtitle')}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-200 dark:hover:bg-slate-800 flex items-center justify-center text-slate-500 cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex p-2 gap-2 border-b border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          {(['industrializado', 'prato_pronto', 'alimento'] as ScanCategory[]).map((cat) => (
            <button
              key={cat}
              onClick={() => setScanCategory(cat)}
              className={`flex-1 py-2 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                scanCategory === cat
                  ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/50 dark:text-emerald-300'
                  : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {cat === 'industrializado'
                ? t('modals.scanner.packaged')
                : cat === 'prato_pronto'
                ? t('modals.scanner.meal')
                : t('modals.scanner.wholeFood', 'Alimento')}
            </button>
          ))}
        </div>

        {/* Shelf Price Input / Mercado Barato banner */}
        <div className="px-3 py-2 bg-amber-50/70 dark:bg-amber-950/30 border-b border-amber-200/60 dark:border-amber-900/40 flex items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 min-w-0">
            <Tag className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span className="text-[11px] font-semibold text-amber-900 dark:text-amber-300 truncate">
              {t('modals.scanner.shelfPriceLabel', 'Preço na Gôndola:')}
            </span>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-xs font-bold text-amber-700 dark:text-amber-400">R$</span>
            <input
              type="text"
              value={shelfPriceInput}
              onChange={(e) => setShelfPriceInput(e.target.value)}
              placeholder="Ex: 14,90"
              className="w-20 px-2 py-1 text-xs font-mono font-bold bg-white dark:bg-slate-900 border border-amber-300 dark:border-amber-700 rounded-md text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-amber-500"
            />
          </div>
        </div>

        {/* Camera Viewfinder / Preview */}
        <div className="relative bg-black flex-1 min-h-[280px] max-h-[360px] flex items-center justify-center overflow-hidden">
          {capturedImage ? (
            <img src={capturedImage} alt="Captura" className="w-full h-full object-contain" />
          ) : stream ? (
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
          ) : (
            <div className="p-6 text-center text-slate-400">
              <AlertCircle className="w-10 h-10 mx-auto mb-2 text-amber-500 opacity-80" />
              <p className="text-xs">{cameraError || t('modals.scanner.cameraStarting')}</p>
            </div>
          )}

          {/* Viewfinder Target Frame Overlay */}
          {!capturedImage && stream && (
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-8">
              <div className="w-full h-48 border-2 border-dashed border-emerald-400 rounded-2xl relative shadow-2xl">
                <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-emerald-500 rounded-tl-lg" />
                <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-emerald-500 rounded-tr-lg" />
                <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-emerald-500 rounded-bl-lg" />
                <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-emerald-500 rounded-br-lg" />
                
                {/* Laser animation */}
                <div className="w-full h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-pulse absolute top-1/2 -translate-y-1/2" />
              </div>
            </div>
          )}

          {/* Analyzing Loading Overlay */}
          {isAnalyzing && (
            <div className="absolute inset-0 bg-black/85 backdrop-blur-md flex flex-col items-center justify-center text-white p-6 z-20">
              <Sparkles className="w-12 h-12 text-emerald-400 animate-spin mb-3" />
              <p className="text-sm font-bold tracking-wide">{t('modals.scanner.aiAnalyzing')}</p>
              <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-950/80 border border-emerald-500/60 rounded-full text-emerald-300 text-[11px] font-bold">
                <BookOpen className="w-3.5 h-3.5" />
                <span>{t('modals.scanner.tacoValidation')}</span>
              </div>
            </div>
          )}
        </div>

        <canvas ref={canvasRef} className="hidden" />

        {/* Control Footer */}
        <div className="p-4 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 space-y-3">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleAnalyze()}
              disabled={isAnalyzing}
              className="flex-1 py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm shadow-md flex items-center justify-center gap-2 active:scale-95 transition-all cursor-pointer disabled:opacity-50"
            >
              <Sparkles className="w-4 h-4" />
              <span>
                {t('modals.scanner.analyzeNow', {
                  category:
                    scanCategory === 'industrializado'
                      ? t('modals.scanner.label')
                      : scanCategory === 'prato_pronto'
                      ? t('modals.scanner.dish')
                      : t('modals.scanner.food', 'Alimento'),
                })}
              </span>
            </button>

            <label className="p-3 rounded-xl border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 cursor-pointer flex items-center justify-center" title={t('modals.scanner.uploadTooltip')}>
              <Upload className="w-5 h-5" />
              <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
            </label>
          </div>

          {/* Manual EAN Barcode Input */}
          <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2">
            <label className="text-[11px] font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Barcode className="w-3.5 h-3.5" />
              {t('modals.scanner.orBarcode')}
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder={t('modals.scanner.barcodePlaceholder')}
                value={barcodeInput}
                onChange={(e) => setBarcodeInput(e.target.value)}
                className="flex-1 px-3 py-2 text-xs font-mono border border-slate-200 dark:border-slate-700 rounded-lg bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <button
                onClick={() => handleAnalyze(undefined, barcodeInput)}
                disabled={!barcodeInput || isAnalyzing}
                className="px-3 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 text-xs font-bold rounded-lg hover:opacity-90 disabled:opacity-40 cursor-pointer"
              >
                {t('modals.scanner.search')}
              </button>
            </div>

            {/* Quick Demo Presets */}
            <div className="flex items-center gap-1.5 pt-1 overflow-x-auto pb-1">
              <span className="text-[10px] text-slate-400 shrink-0">{t('modals.scanner.examples')}</span>
              {samplePresets.map((preset) => (
                <button
                  key={preset.barcode}
                  onClick={() => {
                    setBarcodeInput(preset.barcode);
                    handleAnalyze(undefined, preset.barcode);
                  }}
                  className="px-2 py-1 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 border border-emerald-200/60 dark:border-emerald-800/60 rounded-md text-[10px] font-medium shrink-0 hover:bg-emerald-100 transition-colors cursor-pointer"
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
