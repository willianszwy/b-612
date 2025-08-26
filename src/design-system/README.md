# B-612 Design System

Sistema de design inspirado em "O Pequeno Príncipe" com tema espacial e astronômico. Criado para aplicações PWA com foco em experiência mobile e visual delicada.

## 🎨 Características

- **Tema Espacial**: Inspirado em "O Pequeno Príncipe"
- **Cores Pastel**: Paleta suave e harmoniosa
- **Tipografia Handwritten**: Fontes que remetem a escrita à mão
- **Glassmorphism**: Efeitos de vidro e blur
- **PWA-First**: Design responsivo mobile-first
- **Acessibilidade**: Componentes acessíveis por padrão
- **Animações Suaves**: Transições e micro-interações delicadas

## 📦 Instalação e Uso

### 1. Importar o Design System

```javascript
// Importar todos os componentes
import { 
  Button, 
  Card, 
  Input, 
  Modal, 
  Toast,
  designTokens 
} from './design-system';

// Ou importar componentes específicos
import { Button } from './design-system/components/Button';
import { useModal } from './design-system/components/Modal';
```

### 2. Configurar Providers (Obrigatório)

```javascript
import { ModalProvider, ToastProvider } from './design-system';

function App() {
  return (
    <ModalProvider>
      <ToastProvider maxToasts={5}>
        <div className="b612-main-container">
          {/* Sua aplicação aqui */}
        </div>
      </ToastProvider>
    </ModalProvider>
  );
}
```

### 3. Importar Estilos CSS

```javascript
// No seu index.css ou App.css
import './design-system/styles.css';
```

## 🎯 Componentes Disponíveis

### Button

```javascript
import { Button } from './design-system';

// Variantes disponíveis
<Button variant="primary">Primário</Button>
<Button variant="secondary">Secundário</Button>
<Button variant="accent">Accent</Button>
<Button variant="outline">Outline</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Tamanhos
<Button size="xs">Extra Small</Button>
<Button size="sm">Small</Button>
<Button size="md">Medium</Button> {/* padrão */}
<Button size="lg">Large</Button>
<Button size="xl">Extra Large</Button>

// Estados e propriedades
<Button disabled>Desabilitado</Button>
<Button loading>Carregando...</Button>
<Button icon={<Star />} iconPosition="left">Com Ícone</Button>
```

### Card

```javascript
import { Card } from './design-system';

<Card variant="default" padding="md" hover shadow="md">
  <Card.Header>
    <Card.Title>Título do Card</Card.Title>
    <Card.Description>Descrição do conteúdo</Card.Description>
  </Card.Header>
  
  <Card.Content>
    Conteúdo principal do card
  </Card.Content>
  
  <Card.Footer>
    <Button variant="primary">Ação</Button>
  </Card.Footer>
</Card>

// Variantes
<Card variant="glass">Efeito Vidro</Card>
<Card variant="gradient">Com Gradiente</Card>
<Card variant="accent">Com Cor Accent</Card>
```

### Input, Textarea, Select

```javascript
import { Input, Textarea, Select } from './design-system';

// Input básico
<Input 
  placeholder="Digite algo..."
  variant="default"
  size="md"
  icon={<Search />}
  iconPosition="left"
/>

// Com erro
<Input error placeholder="Campo obrigatório" />

// Textarea
<Textarea 
  rows={4} 
  placeholder="Digite sua mensagem..." 
  resize="vertical"
/>

// Select
<Select placeholder="Escolha uma opção">
  <option value="1">Opção 1</option>
  <option value="2">Opção 2</option>
</Select>
```

### Modal System (Substituindo alert/confirm)

```javascript
import { useModal } from './design-system';

function MyComponent() {
  const modal = useModal();

  const handleAlert = async () => {
    await modal.alert('Mensagem de alerta', {
      title: 'Atenção',
      variant: 'warning',
      icon: '⚠️'
    });
  };

  const handleConfirm = async () => {
    const confirmed = await modal.confirm(
      'Deseja realmente excluir este item?',
      {
        title: 'Confirmar Exclusão',
        variant: 'error',
        confirmText: 'Excluir',
        cancelText: 'Cancelar'
      }
    );
    
    if (confirmed) {
      // Fazer a exclusão
    }
  };

  const handleCustomModal = async () => {
    await modal.custom(MyCustomComponent, {
      data: 'alguns dados',
      onSave: (data) => console.log('Saved:', data)
    });
  };

  return (
    <div>
      <Button onClick={handleAlert}>Alert</Button>
      <Button onClick={handleConfirm}>Confirm</Button>
      <Button onClick={handleCustomModal}>Custom Modal</Button>
    </div>
  );
}
```

### Toast System

```javascript
import { useToast } from './design-system';

function MyComponent() {
  const toast = useToast();

  const showToasts = () => {
    toast.success('Operação realizada com sucesso!');
    toast.error('Erro ao processar solicitação');
    toast.warning('Atenção: dados não salvos');
    toast.info('Nova atualização disponível');
    
    // Toast customizado
    toast.custom({
      variant: 'success',
      title: 'Personalizado',
      message: 'Toast com configurações customizadas',
      duration: 8000,
      icon: '🚀'
    });
  };

  return <Button onClick={showToasts}>Mostrar Toasts</Button>;
}
```

### Badge

```javascript
import { Badge } from './design-system';

<Badge variant="primary">Novo</Badge>
<Badge variant="success" icon={<Check />}>Completo</Badge>
<Badge variant="warning" size="lg">Atenção</Badge>
```

### Loading/Spinner

```javascript
import { Spinner } from './design-system';

// Spinner básico
<Spinner size="md" variant="primary" />

// Loading overlay
<Spinner.Overlay 
  show={loading} 
  message="Carregando dados..." 
  blur 
/>

// Loading de conteúdo
<Spinner.Content 
  loading={isLoading} 
  message="Buscando informações..."
>
  <div>Conteúdo carregado</div>
</Spinner.Content>
```

### Container/Layout

```javascript
import { Container } from './design-system';

<Container size="md" variant="glass" padding="lg" centered>
  <Container.Section variant="header" spacing="lg">
    Header Content
  </Container.Section>
  
  <Container.Section spacing="md">
    Main Content
  </Container.Section>
</Container>
```

## 🎨 Design Tokens

```javascript
import { designTokens } from './design-system';

// Acessar cores
const primaryColor = designTokens.colors.primary[200]; // #E6E6FA
const accentColor = designTokens.colors.accent.salmon; // #FFA07A

// Usar em estilos
const styles = {
  backgroundColor: designTokens.colors.primary[200],
  fontFamily: designTokens.typography.fontFamily.handwritten,
  borderRadius: designTokens.border.radius['2xl'],
  boxShadow: designTokens.shadow.glass
};
```

## 🎯 Classes CSS Utilitárias

```html
<!-- Efeitos visuais -->
<div class="b612-glassmorphism">Efeito de vidro</div>
<div class="b612-card">Card padrão</div>
<div class="b612-starfield">Fundo com estrelas</div>

<!-- Botões -->
<button class="b612-button-primary">Botão Primário</button>
<button class="b612-button-secondary">Botão Secundário</button>

<!-- Inputs -->
<input class="b612-input" placeholder="Input estilizado" />

<!-- Badges -->
<span class="b612-badge b612-badge-primary">Badge</span>

<!-- Animações -->
<div class="b612-animate-fade-in">Fade in</div>
<div class="b612-animate-slide-up">Slide up</div>
<div class="b612-animate-float">Flutuação</div>

<!-- Hover effects -->
<div class="b612-hover-lift">Elevação no hover</div>
<div class="b612-hover-glow">Brilho no hover</div>
```

## 🎨 Paleta de Cores

### Cores Primárias
- **Pastel Purple**: `#E6E6FA` - Cor principal do sistema
- **Pastel Mint**: `#98FB98` - Cor secundária 
- **Pastel Salmon**: `#FFA07A` - Cor de destaque

### Cores de Apoio
- **Pastel Blue**: `#87CEEB` - Para informações
- **Pastel Pink**: `#FFB6C1` - Para elementos delicados
- **Pastel Yellow**: `#FFFFE0` - Para avisos suaves

### Cores Semânticas
- **Success**: `#22C55E` - Verde para sucesso
- **Warning**: `#F59E0B` - Amarelo para avisos
- **Error**: `#EF4444` - Vermelho para erros
- **Info**: `#3B82F6` - Azul para informações

## 📱 Responsividade

O sistema foi projetado mobile-first com breakpoints:

- **xs**: 320px (smartphones pequenos)
- **sm**: 640px (smartphones)
- **md**: 768px (tablets)
- **lg**: 1024px (desktops pequenos)
- **xl**: 1280px+ (desktops grandes)

## ♿ Acessibilidade

Todos os componentes seguem práticas de acessibilidade:

- Suporte a navegação por teclado
- Roles ARIA apropriadas
- Alto contraste nas cores
- Textos alternativos
- Foco visível
- Suporte a screen readers

## 🎭 Personalizações Avançadas

### Extendendo Componentes

```javascript
import { Button } from './design-system';
import styled from 'styled-components';

const CustomButton = styled(Button)`
  /* Seus estilos customizados */
  background: linear-gradient(45deg, #ff6b6b, #ffd93d);
  
  &:hover {
    transform: scale(1.05) translateY(-2px);
  }
`;
```

### Criando Novos Tokens

```javascript
import { designTokens } from './design-system';

const customTokens = {
  ...designTokens,
  colors: {
    ...designTokens.colors,
    brand: {
      primary: '#your-color',
      secondary: '#your-secondary-color'
    }
  }
};
```

## 🚀 Migração de Alerts/Confirms Nativos

### Antes (Nativo)
```javascript
// ❌ Não fazer mais isso
alert('Mensagem de alerta');
const confirmed = confirm('Deseja continuar?');
```

### Depois (B-612 Design System)
```javascript
// ✅ Fazer assim
const modal = useModal();

await modal.alert('Mensagem de alerta');
const confirmed = await modal.confirm('Deseja continuar?');
```

## 📋 Exemplo Completo de Implementação

```javascript
import React from 'react';
import {
  ModalProvider,
  ToastProvider,
  Button,
  Card,
  Input,
  useModal,
  useToast
} from './design-system';
import './design-system/styles.css';

function ExampleComponent() {
  const modal = useModal();
  const toast = useToast();
  
  const handleSubmit = async () => {
    const confirmed = await modal.confirm(
      'Deseja salvar as alterações?'
    );
    
    if (confirmed) {
      // Simular salvamento
      try {
        await saveData();
        toast.success('Dados salvos com sucesso!');
      } catch (error) {
        toast.error('Erro ao salvar dados');
      }
    }
  };

  return (
    <div className="b612-main-container min-h-screen p-4">
      <Container size="md" variant="glass" padding="lg" centered>
        <Card>
          <Card.Header>
            <Card.Title>Exemplo B-612 Design System</Card.Title>
            <Card.Description>
              Demonstração dos componentes do sistema
            </Card.Description>
          </Card.Header>
          
          <Card.Content>
            <div className="space-y-4">
              <Input placeholder="Digite seu nome..." />
              <Button 
                variant="primary" 
                onClick={handleSubmit}
                className="w-full"
              >
                Salvar Dados
              </Button>
            </div>
          </Card.Content>
        </Card>
      </Container>
    </div>
  );
}

function App() {
  return (
    <ModalProvider>
      <ToastProvider>
        <ExampleComponent />
      </ToastProvider>
    </ModalProvider>
  );
}

export default App;
```

## 🎯 Roadmap

- [ ] Dark mode support
- [ ] Mais componentes (Tabs, Accordion, etc.)
- [ ] Storybook para documentação visual
- [ ] Temas customizáveis
- [ ] Suporte a React Native
- [ ] Componentes de formulário avançados

---

**Versão**: 1.0.0  
**Criado para**: Projetos PWA inspirados em "O Pequeno Príncipe"  
**Compatibilidade**: React 16.8+ (Hooks required)