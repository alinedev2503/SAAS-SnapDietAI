# NutriLense AI — Scanner Nutricional e Leitura de Rótulos por IA (White-Label SaaS)

![NutriLense AI Banner](https://raw.githubusercontent.com/aistudio-build/assets/main/nutrilense-banner.png)

> **NutriLense AI** é uma plataforma SaaS profissional e white-label que utiliza Inteligência Artificial Gemini 3.8 Flash para leitura e análise em tempo real de rótulos de alimentos e códigos de barras EAN/UPC via câmera.

---

## 🥗 Principais Funcionalidades

- 📸 **Scanner de Câmera em Tempo Real & Barcode EAN**: Leitura instantânea de tabelas nutricionais, lista de ingredientes e código de barras.
- 🚦 **NutriScore (A–E) & Índice de Saúde (0–100)**: Classificação automática da qualidade dos nutrientes e grau de processamento NOVA (1 a 4).
- ⚠️ **Guardião de Restrições Alimentares**: Alertas instantâneos para lactose, glúten, sódio elevado, açúcares ocultos, alergia a amendoim, veganismo, ceto e diabetes.
- 🧪 **Identificador de Aditivos & Substâncias Nocivas**: Mapeamento de corantes artificiais (ex: Caramelo IV E150d), conservantes (ex: Nitrito de Sódio E250) e gorduras interesterificadas.
- 💡 **Trocas Saudáveis por IA**: Sugestão de 2 a 3 produtos alternativos com melhor NutriScore e zero aditivos.
- 📄 **Relatórios de Progresso Mensais em PDF**: Emissão de relatório executivo com gráficos de consumo, média nutricional e histórico de 30 dias.
- 🎨 **SaaS White-Label & Dual-Adapter**: Suporte alternável a **Supabase (PostgreSQL + RLS)** e **Firebase (Firestore)** com personalização de cores, logo e nome da marca no painel admin.

---

## 🛠️ Tech Stack

- **Frontend**: React 19 + TypeScript + Vite 8
- **Estilização**: Tailwind CSS v4 + Lucide Icons + Framer Motion
- **Inteligência Artificial**: Google Gemini 3.8 Flash (`@google/genai` SDK no Express Backend Proxy)
- **Exportação de Documentos**: `jspdf` + `html2canvas`
- **Banco de Dados**: Dual Adapter (Supabase PostgreSQL / Firebase Firestore / LocalStorage)
- **Servidor**: Node.js + Express com Vite Middleware

---

## 🚀 Como Executar Localmente

### 1. Clonar o repositório e instalar dependências
```bash
npm install
```

### 2. Configurar Variáveis de Ambiente (`.env`)
```env
GEMINI_API_KEY="SUA_CHAVE_GEMINI_AQUI"
APP_URL="http://localhost:3000"
VITE_ACTIVE_STORAGE_ADAPTER="local"
VITE_APP_NAME="NutriLense AI"
```

### 3. Iniciar o Servidor de Desenvolvimento
```bash
npm run dev
```
O aplicativo estará disponível em `http://localhost:3000`.

---

## 📦 Licença e Comercialização

Este projeto está pronto para comercialização como:
- **Código-Fonte Completo**;
- **SaaS White-Label**;
- **Aplicativo Mobile PWA** pronto para publicação na Google Play Store.

Consulte a documentação em `/docs/` para obter detalhes arquiteturais e orientações de deploy.
