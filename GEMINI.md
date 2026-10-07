# Guia de Desenvolvimento com Gemini AI — NutriLense AI

- **SDK Oficial**: `@google/genai`
- **Modelo Utilizado**: `gemini-3.8-flash`
- **Padrão de Chamada**: Sempre no lado do servidor em `server.ts` via endpoint proxy `/api/gemini/analyze-product`.
- **User-Agent**: Obrigatório `'aistudio-build'` em `httpOptions`.
- **Formato de Resposta**: `responseMimeType: "application/json"` para parsing estruturado dos ingredientes e aditivos.
