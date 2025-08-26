# Guia de Migração - B-612 Design System

Este guia mostra como migrar o projeto atual para usar o B-612 Design System, com foco especial na substituição dos modais nativos (alert, confirm) por modais customizados.

## 🚀 Passo a Passo da Migração

### 1. Configurar Providers na Raiz da Aplicação

```javascript
// Em src/App.jsx ou src/main.jsx
import { ModalProvider, ToastProvider } from './design-system';
import './design-system/styles.css';

function App() {
  return (
    <ModalProvider>
      <ToastProvider maxToasts={5}>
        {/* Sua aplicação existente */}
        <div className="b612-main-container">
          {/* Componentes existentes aqui */}
        </div>
      </ToastProvider>
    </ModalProvider>
  );
}
```

### 2. Atualizar Tailwind Config

```javascript
// Atualizar tailwind.config.js existente
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "./src/design-system/**/*.{js,jsx}", // Adicionar esta linha
  ],
  theme: {
    extend: {
      // Manter configurações existentes e adicionar:
      colors: {
        // Suas cores existentes
        'pastel-purple': '#E6E6FA',
        'pastel-mint': '#98FB98',
        'pastel-salmon': '#FFA07A',
        'pastel-blue': '#87CEEB',
        'pastel-pink': '#FFB6C1',
        'pastel-yellow': '#FFFFE0',
      },
      // ... resto da configuração
    },
  },
  plugins: [],
}
```

### 3. Migração dos Alertas Nativos

#### ANTES (Código atual):
```javascript
// Em HabitForm.jsx linha 48
if (formData.frequency === 'custom' && formData.customDays.length === 0) {
  alert('Por favor, selecione pelo menos um dia da semana para frequência personalizada.');
  return;
}

// Em HabitCard.jsx linha 25
} else {
  alert(result.message);
}
```

#### DEPOIS (Com B-612 Design System):
```javascript
import { useModal } from '../design-system';

const HabitForm = ({ habit, onSave, onClose }) => {
  const modal = useModal();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.title.trim()) return;

    // Substituir alert por modal customizado
    if (formData.frequency === 'custom' && formData.customDays.length === 0) {
      await modal.alert(
        'Por favor, selecione pelo menos um dia da semana para frequência personalizada.',
        {
          title: 'Frequência personalizada',
          variant: 'warning',
          icon: '⚠️'
        }
      );
      return;
    }

    // ... resto da lógica
  };
};

// Em HabitCard.jsx
const HabitCard = ({ habit, onUpdate, onEdit, onDelete }) => {
  const modal = useModal();
  
  const handleComplete = async () => {
    // ... lógica existente
    try {
      const result = await habitService.completeHabit(habit.id);
      if (result.success) {
        onUpdate();
      } else {
        // Substituir alert por modal
        await modal.alert(result.message, {
          title: 'Erro',
          variant: 'error',
          icon: '❌'
        });
      }
    } catch (error) {
      // ...
    }
  };
};
```

### 4. Implementar Confirmações de Exclusão

```javascript
// Atualizar componentes que fazem exclusão
const handleDelete = async (habitId) => {
  const confirmed = await modal.confirm(
    'Esta ação não pode ser desfeita. Deseja realmente excluir este hábito?',
    {
      title: 'Excluir Hábito',
      variant: 'error',
      confirmText: 'Sim, excluir',
      cancelText: 'Cancelar',
      icon: '🗑️'
    }
  );

  if (confirmed) {
    // Proceder com a exclusão
    await habitService.delete(habitId);
    toast.success('Hábito excluído com sucesso');
  }
};
```

### 5. Adicionar Feedback com Toasts

```javascript
import { useToast } from '../design-system';

const SomeComponent = () => {
  const toast = useToast();

  const handleSave = async () => {
    try {
      await saveData();
      toast.success('Dados salvos com sucesso!');
    } catch (error) {
      toast.error('Erro ao salvar dados. Tente novamente.');
    }
  };

  const handleSync = async () => {
    toast.info('Sincronizando dados...', { duration: 2000 });
    await syncData();
    toast.success('Sincronização concluída!');
  };
};
```

## 📋 Checklist de Migração

### Configuração Inicial
- [ ] Adicionar ModalProvider na raiz da aplicação
- [ ] Adicionar ToastProvider na raiz da aplicação  
- [ ] Importar estilos do design system
- [ ] Atualizar tailwind.config.js

### Migração de Componentes
- [ ] **HabitForm.jsx**: Substituir alert por modal.alert
- [ ] **HabitCard.jsx**: Substituir alert por modal.alert
- [ ] **EventForm.jsx**: Adicionar confirmações
- [ ] **BackupSection.jsx**: Adicionar toasts de feedback
- [ ] Outros componentes que usam alert/confirm

### Melhorias Visuais (Opcional)
- [ ] Substituir cards existentes por componentes Card do design system
- [ ] Atualizar botões para usar componente Button
- [ ] Migrar inputs para componentes Input/Textarea/Select
- [ ] Adicionar badges e indicadores visuais
- [ ] Implementar loading states com Spinner

## 🎯 Arquivos Específicos a Serem Modificados

### 1. `src/components/Habits/HabitForm.jsx`
```javascript
// Linha 2: Adicionar import
import { useModal } from '../../design-system';

// Linha 4: Adicionar hook
const modal = useModal();

// Linha 48: Substituir alert
await modal.alert('Mensagem...', { variant: 'warning' });
```

### 2. `src/components/Habits/HabitCard.jsx`
```javascript
// Linha 2: Adicionar import
import { useModal } from '../../design-system';

// Linha 5: Adicionar hook
const modal = useModal();

// Linha 25: Substituir alert
await modal.alert(result.message, { variant: 'error' });
```

### 3. `src/components/Calendar/EventForm.jsx`
```javascript
// Adicionar confirmação antes de salvar evento importante
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (formData.isImportant) {
    const confirmed = await modal.confirm(
      'Este evento foi marcado como importante. Deseja confirmar a criação?',
      { variant: 'info' }
    );
    
    if (!confirmed) return;
  }
  
  // Lógica de salvamento...
};
```

### 4. `src/App.jsx` (Principal)
```javascript
import { ModalProvider, ToastProvider } from './design-system';
import './design-system/styles.css';

// Envolver toda a aplicação
function App() {
  return (
    <ModalProvider>
      <ToastProvider>
        <div className="b612-main-container">
          {/* Componentes existentes */}
        </div>
      </ToastProvider>
    </ModalProvider>
  );
}
```

## 🔄 Exemplos de Substituição Direta

### Alert Simples
```javascript
// ❌ ANTES
alert('Hábito criado com sucesso!');

// ✅ DEPOIS  
await modal.alert('Hábito criado com sucesso!', {
  variant: 'success',
  icon: '🎉'
});
```

### Confirm
```javascript
// ❌ ANTES
const confirmed = confirm('Deseja excluir este item?');
if (confirmed) {
  deleteItem();
}

// ✅ DEPOIS
const confirmed = await modal.confirm('Deseja excluir este item?');
if (confirmed) {
  deleteItem();
}
```

### Feedback de Ações
```javascript
// ❌ ANTES
alert('Erro ao salvar dados');

// ✅ DEPOIS
toast.error('Erro ao salvar dados', {
  title: 'Ops! 😔',
  duration: 5000
});
```

## 🎨 Melhorias Visuais Graduais

### Fase 1: Funcionalidade (Essencial)
- Substituir todos os alerts/confirms
- Adicionar toasts para feedback

### Fase 2: Componentes (Recomendado)
- Migrar para componentes Button do design system
- Usar componentes Card para containers
- Implementar componentes Input/Textarea

### Fase 3: Experiência (Avançado)
- Adicionar loading states
- Implementar animações suaves
- Adicionar badges e indicadores visuais
- Melhorar responsividade mobile

## ⚠️ Pontos de Atenção

1. **Async/Await**: Os modais são assíncronos, então use `await`
2. **Providers**: Certifique-se de que os providers estão na raiz
3. **Importações**: Verifique os caminhos de import do design system
4. **CSS**: Inclua o arquivo de estilos do design system
5. **Testing**: Teste todos os fluxos de modal após a migração

## 🚀 Após a Migração

Depois de implementar o design system:

1. **Teste todas as funcionalidades** que usavam alert/confirm
2. **Verifique a responsividade** em dispositivos móveis
3. **Configure durações** dos toasts conforme necessário
4. **Personalize mensagens** para melhorar UX
5. **Considere adicionar mais componentes** do design system

---

A migração pode ser feita gradualmente, começando pelos modais mais críticos e expandindo para outros componentes conforme necessário.

**Tempo estimado de migração**: 2-4 horas para migração completa dos modais.