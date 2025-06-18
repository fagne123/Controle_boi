'use client';

import { useEffect, useState, useCallback } from 'react';
import Navigation from '@/components/shared/Navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import { Animal, Custo } from '@/types';
import { formatarMoeda, formatarData, calcularROI } from '@/lib/utils/calculos';

interface AnimalComCustos extends Animal {
  custos: Custo[];
}

export default function AnimaisPage() {
  const [animais, setAnimais] = useState<AnimalComCustos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filtros, setFiltros] = useState({
    tipo: '',
    status: '',
    dataInicio: '',
    dataFim: ''
  });

  const carregarAnimais = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      
      if (filtros.tipo) params.append('tipo', filtros.tipo);
      if (filtros.status) params.append('status', filtros.status);
      if (filtros.dataInicio) params.append('dataInicio', filtros.dataInicio);
      if (filtros.dataFim) params.append('dataFim', filtros.dataFim);
      
      const response = await fetch(`/api/animais?${params.toString()}`);
      
      if (!response.ok) {
        throw new Error('Erro ao carregar animais');
      }
      
      const data = await response.json();
      setAnimais(data.animais || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  }, [filtros]);

  useEffect(() => {
    carregarAnimais();
  }, [carregarAnimais]);

  const handleDeletarAnimal = async (id: string) => {
    if (!confirm('Tem certeza que deseja deletar este animal?')) return;
    
    try {
      const response = await fetch(`/api/animais/${id}`, {
        method: 'DELETE'
      });
      
      if (!response.ok) {
        throw new Error('Erro ao deletar animal');
      }
      
      // Recarregar lista
      carregarAnimais();
    } catch (err) {
      alert('Erro ao deletar animal: ' + (err instanceof Error ? err.message : 'Erro desconhecido'));
    }
  };

  const limparFiltros = () => {
    setFiltros({
      tipo: '',
      status: '',
      dataInicio: '',
      dataFim: ''
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

  return (
    <div>
      <Navigation />
      
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Animais</h1>
            <p className="mt-2 text-gray-600">
              Gerencie seu rebanho e acompanhe os investimentos
            </p>
          </div>
          <Button onClick={() => window.location.href = '/animais/novo'}>
            + Novo Animal
          </Button>
        </div>
      </div>

      {/* Filtros */}
      <Card className="mb-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo
            </label>
            <select
              value={filtros.tipo}
              onChange={(e) => setFiltros({ ...filtros, tipo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos os tipos</option>
              <option value="Garrote">Garrote</option>
              <option value="Boi">Boi</option>
              <option value="Novilha">Novilha</option>
              <option value="Bezerro">Bezerro</option>
              <option value="Vaca">Vaca</option>
              <option value="Vaca c/ Bezerro">Vaca c/ Bezerro</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filtros.status}
              onChange={(e) => setFiltros({ ...filtros, status: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Todos</option>
              <option value="ativo">Ativo</option>
              <option value="vendido">Vendido</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Início
            </label>
            <input
              type="date"
              value={filtros.dataInicio}
              onChange={(e) => setFiltros({ ...filtros, dataInicio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Data Fim
            </label>
            <input
              type="date"
              value={filtros.dataFim}
              onChange={(e) => setFiltros({ ...filtros, dataFim: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <div className="mt-4 flex justify-end">
          <Button variant="secondary" onClick={limparFiltros}>
            Limpar Filtros
          </Button>
        </div>
      </Card>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-600">Erro: {error}</p>
        </div>
      )}

      {/* Lista de Animais */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {animais.map((animal) => {
          const roi = calcularROI(animal, animal.custos);
          const custosTotais = animal.custos.reduce((sum, custo) => sum + custo.valor, 0);
          
          return (
            <Card key={animal._id} className="hover:shadow-lg transition-shadow">
              <div className="space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {animal.tipo}
                    </h3>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      animal.status === 'ativo' 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-blue-100 text-blue-800'
                    }`}>
                      {animal.status === 'ativo' ? 'Ativo' : 'Vendido'}
                    </span>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Compra</div>
                    <div className="font-semibold text-gray-900">
                      {formatarMoeda(animal.valorCompra)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-500">Data Compra:</span>
                    <div className="font-medium">{formatarData(new Date(animal.dataCompra))}</div>
                  </div>
                  {animal.dataVenda && (
                    <div>
                      <span className="text-gray-500">Data Venda:</span>
                      <div className="font-medium">{formatarData(new Date(animal.dataVenda))}</div>
                    </div>
                  )}
                </div>

                {animal.valorVenda && (
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500">Venda:</span>
                      <div className="font-semibold text-green-600">
                        {formatarMoeda(animal.valorVenda)}
                      </div>
                    </div>
                    <div>
                      <span className="text-gray-500">ROI:</span>
                      <div className={`font-semibold ${roi >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                        {roi.toFixed(2)}%
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-sm">
                  <span className="text-gray-500">Custos Totais:</span>
                  <div className="font-medium text-red-600">
                    {formatarMoeda(custosTotais)}
                  </div>
                </div>

                <div className="flex justify-between pt-4 border-t">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => window.location.href = `/animais/${animal._id}/editar`}
                  >
                    Editar
                  </Button>
                  <Button
                    variant="danger"
                    size="sm"
                    onClick={() => handleDeletarAnimal(animal._id!)}
                  >
                    Deletar
                  </Button>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {animais.length === 0 && !loading && (
        <Card>
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">Nenhum animal encontrado</p>
            <Button onClick={() => window.location.href = '/animais/novo'}>
              Adicionar Primeiro Animal
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
} 