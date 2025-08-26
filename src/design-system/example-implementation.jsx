/**
 * Exemplo de implementação do B-612 Design System
 * Este arquivo mostra como migrar do sistema atual para o design system
 */

import React, { useState } from 'react';
import {
  Button,
  Card,
  Input,
  Textarea,
  Select,
  Badge,
  Container,
  Spinner,
  useModal,
  useToast,
} from './index';

// Exemplo de migração de um componente existente
const HabitFormExample = () => {
  const modal = useModal();
  const toast = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    frequency: 'daily'
  });

  // ANTES: usando alert nativo
  // const handleSubmit = () => {
  //   if (!formData.title) {
  //     alert('Por favor, preencha o título do hábito');
  //     return;
  //   }
  //   // lógica de salvamento
  // };

  // DEPOIS: usando design system
  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      await modal.alert(
        'Por favor, preencha o título do hábito',
        {
          title: 'Campo obrigatório',
          variant: 'warning',
          icon: '⚠️'
        }
      );
      return;
    }

    const confirmed = await modal.confirm(
      'Deseja criar este novo hábito?',
      {
        title: 'Confirmar criação',
        variant: 'info',
        confirmText: 'Criar Hábito',
        cancelText: 'Cancelar'
      }
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      
      // Simular salvamento
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success('Hábito criado com sucesso!', {
        title: 'Sucesso! 🎉'
      });

      // Reset form
      setFormData({ title: '', description: '', frequency: 'daily' });
      
    } catch {
      toast.error('Erro ao criar hábito. Tente novamente.', {
        title: 'Ops! 😔',
        duration: 7000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
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
      toast.success('Hábito excluído com sucesso');
    }
  };

  return (
    <Container size="md" variant="glass" padding="lg" centered>
      <Card variant="default" padding="lg">
        <Card.Header>
          <Card.Title>Novo Hábito</Card.Title>
          <Card.Description>
            Exemplo usando B-612 Design System
          </Card.Description>
        </Card.Header>

        <Card.Content>
          <div className="space-y-4">
            <div>
              <label className="block font-handwritten text-gray-700 mb-2">
                Título do Hábito *
              </label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({...formData, title: e.target.value})}
                placeholder="Ex: Beber água, Meditar..."
                variant="default"
                size="md"
              />
            </div>

            <div>
              <label className="block font-handwritten text-gray-700 mb-2">
                Descrição
              </label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                placeholder="Descreva seu hábito (opcional)"
                rows={3}
                resize="vertical"
              />
            </div>

            <div>
              <label className="block font-handwritten text-gray-700 mb-2">
                Frequência
              </label>
              <Select
                value={formData.frequency}
                onChange={(e) => setFormData({...formData, frequency: e.target.value})}
                placeholder="Selecione a frequência"
              >
                <option value="daily">Diário</option>
                <option value="weekly">Semanal</option>
                <option value="custom">Personalizado</option>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="primary" size="sm">Novo</Badge>
              <Badge variant="secondary" size="sm">Hábito</Badge>
            </div>
          </div>
        </Card.Content>

        <Card.Footer>
          <div className="flex gap-3">
            <Button
              variant="outline"
              onClick={handleDelete}
              disabled={loading}
              className="flex-1"
            >
              Excluir
            </Button>
            
            <Button
              variant="primary"
              onClick={handleSubmit}
              loading={loading}
              className="flex-1"
            >
              {loading ? 'Criando...' : 'Criar Hábito'}
            </Button>
          </div>
        </Card.Footer>
      </Card>

      {/* Loading overlay exemplo */}
      <Spinner.Overlay
        show={loading}
        message="Criando seu novo hábito..."
        variant="primary"
        size="lg"
      />
    </Container>
  );
};

// Exemplo de lista com cards
const HabitListExample = () => {
  const toast = useToast();
  const habits = [
    { id: 1, title: '💧 Beber água', streak: 7, completed: true },
    { id: 2, title: '🏃‍♂️ Exercitar-se', streak: 3, completed: false },
    { id: 3, title: '📚 Ler 30min', streak: 12, completed: true },
  ];

  const handleComplete = (habit) => {
    if (habit.completed) {
      toast.info(`${habit.title} já foi completado hoje!`);
    } else {
      toast.success(`${habit.title} marcado como concluído! 🎉`);
    }
  };

  return (
    <Container size="lg" padding="md" centered>
      <div className="space-y-4">
        <h2 className="text-2xl font-cute text-purple-800 text-center mb-6">
          Seus Hábitos
        </h2>
        
        {habits.map(habit => (
          <Card
            key={habit.id}
            variant="default"
            hover
            onClick={() => handleComplete(habit)}
            className="cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`
                  w-6 h-6 rounded-full border-2 flex items-center justify-center
                  ${habit.completed 
                    ? 'bg-green-500 border-green-500 text-white' 
                    : 'border-gray-300 hover:border-green-400'
                  }
                `}>
                  {habit.completed && '✓'}
                </div>
                
                <div>
                  <h3 className={`
                    font-handwritten text-lg
                    ${habit.completed ? 'line-through text-gray-500' : 'text-gray-800'}
                  `}>
                    {habit.title}
                  </h3>
                </div>
              </div>
              
              <div className="flex items-center gap-2">
                <Badge variant="accent" size="sm">
                  🔥 {habit.streak} dias
                </Badge>
              </div>
            </div>
          </Card>
        ))}
        
        <Button variant="primary" className="w-full" size="lg">
          Adicionar Novo Hábito
        </Button>
      </div>
    </Container>
  );
};

// Exemplo completo de aplicação
const ExampleApp = () => {
  const [view, setView] = useState('form');
  
  return (
    <div className="b612-main-container min-h-screen">
      <Container.Section variant="header" spacing="md">
        <div className="text-center">
          <h1 className="text-3xl font-cute text-purple-800 mb-2">
            B-612 Design System
          </h1>
          <p className="font-handwritten text-gray-600">
            Exemplo de implementação completa
          </p>
          
          <div className="flex gap-2 justify-center mt-4">
            <Button
              variant={view === 'form' ? 'primary' : 'outline'}
              onClick={() => setView('form')}
              size="sm"
            >
              Formulário
            </Button>
            <Button
              variant={view === 'list' ? 'primary' : 'outline'}
              onClick={() => setView('list')}
              size="sm"
            >
              Lista
            </Button>
          </div>
        </div>
      </Container.Section>

      <Container.Section spacing="lg">
        {view === 'form' ? <HabitFormExample /> : <HabitListExample />}
      </Container.Section>
      
      <Container.Section variant="footer" spacing="sm">
        <div className="text-center">
          <p className="font-handwritten text-gray-500 text-sm">
            Criado com 💜 usando B-612 Design System
          </p>
        </div>
      </Container.Section>
    </div>
  );
};

export default ExampleApp;