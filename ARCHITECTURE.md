# Technical Architecture — NutriLense AI

## 1. Padrão Arquitetural Dual-Adapter
Para atender à necessidade comercial de venda do código-fonte para compradores que preferem **Supabase** ou **Firebase**, o projeto adota o padrão de projeto *Adapter*:

```
                          ┌──────────────────────────┐
                          │    NutriLense React UI   │
                          └─────────────┬────────────┘
                                        │ StorageAdapter Interface
                                        ▼
                          ┌──────────────────────────┐
                          │      AdapterFactory      │
                          └──────┬───────────┬───────┘
                                 │           │
                 ┌───────────────┘           └───────────────┐
                 ▼                                           ▼
      ┌─────────────────────┐                     ┌────────────────────┐
      │   SupabaseAdapter   │                     │  FirebaseAdapter   │
      │ (PostgreSQL + RLS)  │                     │ (Firestore + Rules)│
      └─────────────────────┘                     └────────────────────┘
```

## 2. Camada de Análise de Rótulos por IA
O envio da imagem capturada pela câmera ou do código de barras é feito via `POST /api/gemini/analyze-product`. O servidor Express invoca a SDK oficial `@google/genai` utilizando o modelo `gemini-3.8-flash` configurado com `responseMimeType: "application/json"`.

## 3. Segurança e Regras de Acesso
- **Chave de API**: A `GEMINI_API_KEY` permanece no ambiente do servidor Node.js e nunca é exposta no bundle do cliente.
- **Firebase Firestore**: Protegido por `firestore.rules` com padrão `default deny` e restrição por `request.auth.uid`.
- **Supabase**: Protegido por políticas Row Level Security (RLS) associadas a `auth.uid()`.
