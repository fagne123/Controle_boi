'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/shared/Navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Configuracao } from '@/types';

export default function ConfiguracoesPage() {
  const [config, setConfig] = useState<Configuracao | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [novoTipo, setNovoTipo] = useState('');

  useEffect(() => {
    carregarConfiguracoes();
  }, []);

  const carregarConfiguracoes = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/configuracoes');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar configurações');
      }
      
      const data = await response.json();
      setConfig(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const salvarConfiguracoes = async () => {
    if (!config) return;
    
    try {
      setSaving(true);
      const response = await fetch('/api/configuracoes', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(config),
      });
      
      if (!response.ok) {
        throw new Error('Erro ao salvar configurações');
      }
      
      const data = await response.json();
      setConfig(data);
      alert('Configurações salvas com sucesso!');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setSaving(false);
    }
  };

  const adicionarTipo = () => {
    if (!novoTipo.trim() || !config) return;
    
    if (config.tiposAnimais.includes(novoTipo.trim())) {
      alert('Este tipo já existe!');
      return;
    }
    
    setConfig({
      ...config,
      tiposAnimais: [...config.tiposAnimais, novoTipo.trim()]
    });
    setNovoTipo('');
  };

  const removerTipo = (tipo: string) => {
    if (!config) return;
    
    if (config.tiposAnimais.length <= 1) {
      alert('Deve haver pelo menos um tipo de animal!');
      return;
    }
    
    setConfig({
      ...config,
      tiposAnimais: config.tiposAnimais.filter(t => t !== tipo)
    });
  };

  if (loading) {
    return (
      <div>
        <Navigation />
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  if (!config) {
    return (
      <div>
        <Navigation />
        <div className="text-center">
          <p className="text-red-600">Erro ao carregar configurações</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Configurações</h1>
        <p className="mt-2 text-gray-600">
          Gerencie os tipos de animais e configurações do sistema
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">Erro: {error}</p>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tipos de Animais */}
        <Card title="Tipos de Animais" subtitle="Gerencie os tipos disponíveis">
          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={novoTipo}
                onChange={(e) => setNovoTipo(e.target.value)}
                placeholder="Novo tipo de animal"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && adicionarTipo()}
              />
              <Button onClick={adicionarTipo} disabled={!novoTipo.trim()}>
                Adicionar
              </Button>
            </div>

            <div className="space-y-2">
              {config.tiposAnimais.map((tipo, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded-md">
                  <span className="font-medium">{tipo}</span>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => removerTipo(tipo)}
                    disabled={config.tiposAnimais.length <= 1}
                  >
                    Remover
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </Card>

        {/* Configurações Financeiras */}
        <Card title="Configurações Financeiras" subtitle="Ajuste valores iniciais">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Caixa Inicial (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={config.caixa}
                onChange={(e) => setConfig({ ...config, caixa: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Investimento Adicional (R$)
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={config.investimentoAdicional}
                onChange={(e) => setConfig({ ...config, investimentoAdicional: parseFloat(e.target.value) || 0 })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="pt-4">
              <Button 
                onClick={salvarConfiguracoes} 
                loading={saving}
                className="w-full"
              >
                Salvar Configurações
              </Button>
            </div>
          </div>
        </Card>
      </div>

      {/* Informações do Sistema */}
      <div className="mt-8">
        <Card title="Informações do Sistema" subtitle="Dados sobre o banco de dados">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-gray-500">Última atualização:</span>
              <div className="font-medium">
                {new Date(config.updatedAt).toLocaleString('pt-BR')}
              </div>
            </div>
            <div>
              <span className="text-gray-500">Total de tipos:</span>
              <div className="font-medium">{config.tiposAnimais.length}</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
} 