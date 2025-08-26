# Setup do B-612 Design System

Instruções para implementar o B-612 Design System em novos projetos ou exportar para reutilização.

## 🚀 Instalação em Novo Projeto

### 1. Copiar Design System
```bash
# Copiar toda a pasta design-system para o novo projeto
cp -r /caminho/para/fab-app/src/design-system /novo-projeto/src/

# Ou criar como pacote npm (recomendado)
cd src/design-system
npm pack
# Instalar no novo projeto: npm install ./b612-design-system-1.0.0.tgz
```

### 2. Instalar Dependências
```bash
npm install lucide-react tailwindcss
```

### 3. Configurar Tailwind
```javascript
// tailwind.config.js
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/design-system/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pastel-purple': '#E6E6FA',
        'pastel-mint': '#98FB98',
        'pastel-salmon': '#FFA07A',
        'pastel-blue': '#87CEEB',
        'pastel-pink': '#FFB6C1',
        'pastel-yellow': '#FFFFE0',
      },
      fontFamily: {
        'handwritten': ['Patrick Hand', 'Indie Flower', 'cursive'],
        'cute': ['Sacramento', 'cursive'],
      },
      borderRadius: {
        '2xl': '1rem',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'bounce-subtle': 'bounceSubtle 0.6s ease-in-out',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        bounceSubtle: {
          '0%, 100%': { transform: 'translateY(0)' },
          '50%': { transform: 'translateY(-5px)' },
        },
      },
    },
  },
  plugins: [],
}
```

### 4. Configurar App Principal
```javascript
// src/App.jsx
import React from 'react';
import { ModalProvider, ToastProvider } from './design-system';
import './design-system/styles.css';

function App() {
  return (
    <ModalProvider>
      <ToastProvider maxToasts={5}>
        <div className="b612-main-container min-h-screen">
          {/* Sua aplicação aqui */}
        </div>
      </ToastProvider>
    </ModalProvider>
  );
}

export default App;
```

### 5. Usar Componentes
```javascript
import { 
  Button, 
  Card, 
  Input, 
  useModal, 
  useToast 
} from './design-system';

function MyComponent() {
  const modal = useModal();
  const toast = useToast();

  const handleClick = async () => {
    const confirmed = await modal.confirm('Confirmar ação?');
    if (confirmed) {
      toast.success('Ação confirmada!');
    }
  };

  return (
    <Card>
      <Card.Header>
        <Card.Title>Meu Componente</Card.Title>
      </Card.Header>
      <Card.Content>
        <Input placeholder="Digite algo..." />
        <Button onClick={handleClick}>Testar</Button>
      </Card.Content>
    </Card>
  );
}
```

## 📦 Criar Pacote NPM

### 1. Preparar para Publicação
```bash
cd src/design-system

# Verificar package.json
# Atualizar version, author, repository

# Build (se necessário)
# npm run build

# Testar empacotamento
npm pack
```

### 2. Publicar no NPM
```bash
# Login no NPM
npm login

# Publicar
npm publish --access public

# Para updates
npm version patch # ou minor/major
npm publish
```

### 3. Usar Pacote Publicado
```bash
# Em outros projetos
npm install @b612/design-system

# Importar
import { Button, useModal } from '@b612/design-system';
import '@b612/design-system/styles';
```

## 🔧 Estrutura de Arquivos

```
src/design-system/
├── components/
│   ├── Button/
│   │   ├── Button.jsx
│   │   └── index.js
│   ├── Card/
│   ├── Input/
│   ├── Modal/
│   ├── Toast/
│   ├── Badge/
│   ├── Layout/
│   ├── Loading/
│   └── index.js
├── tokens.js
├── styles.css
├── index.js
├── package.json
├── tailwind.config.js
├── README.md
├── MIGRATION-GUIDE.md
├── SETUP.md
└── example-implementation.jsx
```

## 🎯 Customização

### Personalizar Cores
```javascript
// Criar tokens customizados
import { designTokens } from './design-system';

const customTokens = {
  ...designTokens,
  colors: {
    ...designTokens.colors,
    primary: {
      ...designTokens.colors.primary,
      200: '#SUA-COR-PERSONALIZADA'
    }
  }
};
```

### Estender Componentes
```javascript
// Criar versão customizada
import { Button } from './design-system';

const MyButton = ({ children, ...props }) => (
  <Button 
    {...props}
    className={`minha-classe-custom ${props.className || ''}`}
  >
    {children}
  </Button>
);
```

### Adicionar Novos Componentes
```javascript
// src/design-system/components/MeuComponente/MeuComponente.jsx
import React from 'react';

const MeuComponente = ({ children, variant = 'default' }) => {
  return (
    <div className={`meu-componente-${variant}`}>
      {children}
    </div>
  );
};

export default MeuComponente;

// Adicionar ao index.js principal
export { default as MeuComponente } from './components/MeuComponente';
```

## 🧪 Testing

### Testar Componentes
```javascript
// src/design-system/components/Button/Button.test.jsx
import { render, fireEvent } from '@testing-library/react';
import Button from './Button';

test('renders button with text', () => {
  const { getByText } = render(
    <Button>Clique aqui</Button>
  );
  
  expect(getByText('Clique aqui')).toBeInTheDocument();
});

test('calls onClick when clicked', () => {
  const handleClick = jest.fn();
  const { getByText } = render(
    <Button onClick={handleClick}>Clique</Button>
  );
  
  fireEvent.click(getByText('Clique'));
  expect(handleClick).toHaveBeenCalled();
});
```

### Testar Modais
```javascript
import { render } from '@testing-library/react';
import { ModalProvider, useModal } from './design-system';

const TestComponent = () => {
  const modal = useModal();
  return (
    <button onClick={() => modal.alert('Teste')}>
      Mostrar Alert
    </button>
  );
};

test('modal provider works', () => {
  render(
    <ModalProvider>
      <TestComponent />
    </ModalProvider>
  );
  
  // Testar funcionalidade do modal
});
```

## 🔄 Versionamento

### Semantic Versioning
- **MAJOR** (1.0.0): Breaking changes
- **MINOR** (1.1.0): New features, backward compatible
- **PATCH** (1.0.1): Bug fixes

### Changelog
```markdown
# Changelog

## [1.0.0] - 2024-01-XX
### Added
- Initial release
- Modal system replacing native alerts
- Toast notifications
- Base components (Button, Card, Input)
- B-612 theme with pastel colors

## [1.0.1] - 2024-01-XX
### Fixed
- Modal z-index issue
- Toast positioning on mobile

### Added
- Loading states for buttons
- New Badge component variants
```

## 🚀 Deployment

### Deploy Storybook (Futuro)
```bash
# Para documentação visual
npm run build-storybook
npm run deploy-storybook
```

### CI/CD Pipeline (Exemplo)
```yaml
# .github/workflows/publish.yml
name: Publish Design System

on:
  release:
    types: [published]

jobs:
  publish:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
          registry-url: 'https://registry.npmjs.org'
      
      - run: npm ci
      - run: npm test
      - run: npm publish --access public
        env:
          NODE_AUTH_TOKEN: ${{ secrets.NPM_TOKEN }}
```

## 📝 Documentação

### Manter Atualizado
- README.md: Documentação principal
- MIGRATION-GUIDE.md: Guia de migração 
- SETUP.md: Instruções de instalação
- Storybook: Documentação visual (futuro)
- TypeScript definitions: Para melhor DX (futuro)

---

**Versão**: 1.0.0  
**Última atualização**: Janeiro 2024  
**Compatibilidade**: React 16.8+, Node 14+