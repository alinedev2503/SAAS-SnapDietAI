# Modelo de Segurança e Proteção de Dados — NutriLense AI

## 1. Proteção da Chave do Gemini AI
- A chave `GEMINI_API_KEY` é consumida estritamente no lado do servidor Node.js (`server.ts`).
- O código do cliente React nunca importa `@google/genai` e nunca lê a variável da chave no browser.

## 2. Isolamento do Usuário e Privacidade de Dados
- Todos os relatórios e registros de consumo são vinculados ao ID único do usuário.
- O arquivo `.env.example` é fornecido sem segredos reais.

## 3. Segurança no Firebase e Supabase
- **Firebase**: O arquivo `firestore.rules` proíbe leituras e gravações não autenticadas e exige que o `userId` corresponda a `request.auth.uid`.
- **Supabase**: Políticas RLS (Row Level Security) ativas na tabela `scans` garantem isolamento entre diferentes contas.
