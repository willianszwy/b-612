# B-612 🌟

Um PWA (Progressive Web App) para gestão de hábitos e agenda pessoal, inspirado no universo de "O Pequeno Príncipe".

> *"É o tempo que dedicaste à tua rosa que a torna tão importante."*

## ✨ Características

### 🏠 **Dashboard**
- Visão geral dos seus hábitos e próximos eventos
- Interface temática espacial com design inspirado no B-612

### 🌱 **Gestão de Hábitos**
- Criação de hábitos com frequências personalizáveis:
  - Diária, semanal ou dias específicos da semana
  - Sistema de streaks para acompanhar progresso
- Notificações push para lembrar dos seus hábitos
- Histórico completo de atividades

### 📅 **Agenda**
- Visualização em calendário ou lista
- Eventos únicos ou recorrentes
- Categorização e notificações
- Integração com hábitos diários

### ⚙️ **Configurações**
- Backup e restauração de dados
- Configurações de notificação
- Personalização da experiência

## 🚀 Tecnologias

- **React 19** - Interface de usuário
- **Vite** - Build tool e dev server
- **Tailwind CSS** - Estilização
- **Dexie.js** - Banco de dados IndexedDB
- **PWA** - Suporte offline e instalação
- **Push API** - Notificações do navegador

## 🌐 Acesso

**Demo Online:** [https://willianszwy.github.io/b-612/](https://willianszwy.github.io/b-612/)

Ou instale como app no seu dispositivo através do navegador!

## 🛠️ Desenvolvimento

### Pré-requisitos
- Node.js 18+
- npm ou yarn

### Instalação
```bash
npm install
```

### Executar em desenvolvimento
```bash
npm run dev
```

### Build para produção
```bash
npm run build
```

### Preview do build
```bash
npm run preview
```

### Linting
```bash
npm run lint
```

## 📱 PWA Features

- ✅ Instalável em dispositivos móveis e desktop
- ✅ Funcionamento offline
- ✅ Sincronização automática quando online
- ✅ Notificações push nativas
- ✅ Cache inteligente de recursos

## 🎨 Design

Interface com tema espacial inspirada em "O Pequeno Príncipe":
- Paleta de cores suaves (lavanda, salmão, azul pastel)
- Tipografia temática (fontes "cute" e manuscrita)
- Ícones customizados
- Animações suaves e responsivas

## 💾 Armazenamento

Todos os dados são armazenados localmente no navegador usando IndexedDB:
- **Hábitos** - Configurações, streaks e histórico
- **Eventos** - Agenda e recorrências
- **Progresso** - Registros de completude
- **Notificações** - Agendamentos e configurações

## 🚀 Deploy

O app é automaticamente deployado no GitHub Pages através de GitHub Actions sempre que há push na branch `main`.

## 📄 Licença

Este projeto foi criado como um projeto pessoal inspirado na obra "O Pequeno Príncipe" de Antoine de Saint-Exupéry.