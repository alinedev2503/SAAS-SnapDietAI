# Instruções de Deploy — Vercel & Cloud Run

## Deploy na Vercel / Render / Cloud Run
1. Conecte o repositório GitHub à plataforma de hospedagem.
2. Defina o comando de build: `npm run build`
3. Defina o comando de início: `npm run start` (ou `node server.js`)
4. Configure as Variáveis de Ambiente:
   - `GEMINI_API_KEY`: Sua chave de API do Google AI Studio
   - `VITE_ACTIVE_STORAGE_ADAPTER`: `local` ou `supabase` ou `firebase`
   - `APP_URL`: URL final de produção
