# Product Requirements Document (PRD) — NutriLense AI

## 1. Visão do Produto
O NutriLense AI busca empoderar consumidores e pacientes a tomarem decisões alimentares conscientes no momento da compra, oferecendo um scanner visual que lê rótulos e traduz tabelas nutricionais complexas em informações claras, alertas de restrição alimentar e alternativas mais saudáveis.

## 2. Público-Alvo e Personas
- **Pessoa com Restrição Alimentar**: Intolerantes a lactose, celíacos, diabéticos e hipertensos que precisam verificar rótulos rapidamente.
- **Entusiasta de Vida Saudável**: Pessoas focadas em nutrição limpa, contagem de macros e eliminação de ultraprocessados (NOVA 4).
- **Nutricionistas & Clientes**: Profissionais que recomendam o app a seus pacientes para acompanhamento diário com relatórios em PDF.
- **Empreendedores SaaS / Compradores White-Label**: Agências e startups que desejam lançar um produto de nutrição com marca própria.

## 3. Requisitos Funcionais
| Código | Requisito | Status |
|---|---|---|
| RF-01 | Leitura de rótulos e código de barras via câmera ao vivo | ✅ Implementado |
| RF-02 | Cálculo automático de macros e Índice de Saúde (0-100) | ✅ Implementado |
| RF-03 | Identificação de aditivos nocivos por código E-number | ✅ Implementado |
| RF-04 | Alertas visuais para restrições alimentares do perfil | ✅ Implementado |
| RF-05 | Sugestão de substituições saudáveis por IA Gemini | ✅ Implementado |
| RF-06 | Gerador e download de relatório mensal em PDF | ✅ Implementado |
| RF-07 | Painel Admin White-Label para alteração de nome, logo e cores | ✅ Implementado |
| RF-08 | Arquitetura Dual-Adapter (Supabase / Firebase / Local) | ✅ Implementado |

## 4. Requisitos Não-Funcionais
- **Desempenho**: Análise do rótulo por IA em menos de 3 segundos.
- **Segurança**: API Key do Gemini isolada exclusivamente no servidor backend Express.
- **Acessibilidade**: Suporte a modo escuro, alto contraste para leitura e botões com hitbox de no mínimo 44x44px.
