# 🏃‍♂️ RotaFit

Aplicativo mobile de corrida com acompanhamento por GPS em tempo real, integração com Spotify e suporte a tema claro e escuro no estilo **Liquid Glass**.

## 🚀 Tecnologias Utilizadas

- **React Native & Expo (SDK 51+)**
- **TypeScript**
- **Expo Router** (Navegação baseada em arquivos)
- **Supabase** (Autenticação OAuth com Google e Banco Postgres com RLS)
- **Spotify Web API** (Controle de reprodução e status em tempo real)
- **expo-location** (Monitoramento de posição via GPS)
- **TanStack Query** (Gerenciamento de estado remoto e cache)
- **Jest & PGlite** (Testes unitários automatizados do app e do banco)

## 📌 Funcionalidades

- 🔑 **Login Social:** Autenticação rápida com conta do Google via Supabase Auth.
- 📍 **Corrida com GPS:** Cálculo de distância em tempo real (Haversine), ritmo médio (pace) e detecção/filtragem de saltos de sinal de GPS.
- 🗺️ **Traçado em SVG:** Visualização leve do percurso percorrido sem custos de API de mapas.
- 🎵 **Player do Spotify:** Visualize e controle a música tocando no Spotify diretamente da tela do app.
- 🎨 **Estilo Liquid Glass & Temas:** Interface translúcida moderna com suporte aos temas Claro (Lemon Chiffon / Milano Red), Escuro e do Sistema.
- 📊 **Resumo & Histórico:** Sincronização em nuvem e resumo semanal de desempenho.

## 🛠️ Como Executar o Projeto

1. **Instale as dependências:**
   ```bash
   npm install