# Guia de Desenvolvimento com Gemini AI — NutriLense AI

- **SDK Oficial**: `@google/genai`
- **Modelo Utilizado**: `gemini-3.8-flash`
- **Base de Referência Nutricional**: Tabela Brasileira de Composição de Alimentos — **TACO (NEPA/UNICAMP 4ª Edição)** para fundamentação de composição centesimal, minerais e vitaminas de pratos e alimentos.
- **Padrão de Chamada**: Sempre no lado do servidor em `server.ts` via endpoint proxy `/api/gemini/analyze-product`.
- **User-Agent**: Obrigatório `'aistudio-build'` em `httpOptions`.
- **Formato de Resposta**: `responseMimeType: "application/json"` com o campo `tacoReference` para auditoria dos valores nutricionais.
