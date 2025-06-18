'use client';

import { useEffect, useState } from 'react';
import Navigation from '@/components/shared/Navigation';
import Card from '@/components/ui/Card';
import { DashboardIndicadores } from '@/types';
import { formatarMoeda, formatarPercentual } from '@/lib/utils/calculos';

export default function Dashboard() {
  const [indicadores, setIndicadores] = useState<DashboardIndicadores | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    carregarIndicadores();
  }, []);

  const carregarIndicadores = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/dashboard/indicadores');
      
      if (!response.ok) {
        throw new Error('Erro ao carregar indicadores');
      }
      
      const data = await response.json();
      setIndicadores(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
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

  if (error) {
    return (
      <div>
        <Navigation />
        <div className="text-center">
          <p className="text-red-600">Erro: {error}</p>
          <button 
            onClick={carregarIndicadores}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Tentar novamente
          </button>
        </div>
      </div>
    );
  }

  if (!indicadores) {
    return (
      <div>
        <Navigation />
        <div className="text-center">
          <p className="text-gray-600">Nenhum dado disponível</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation />
      
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="mt-2 text-gray-600">
          Visão geral do seu investimento em gado
        </p>
      </div>

      {/* Cards de Indicadores */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatarMoeda(indicadores.patrimonioTotal)}
            </div>
            <div className="text-sm text-gray-500">Patrimônio Total</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatarMoeda(indicadores.valorInvestidoAtual)}
            </div>
            <div className="text-sm text-gray-500">Valor Investido Atual</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">
              {formatarMoeda(indicadores.custosTotais)}
            </div>
            <div className="text-sm text-gray-500">Custos Totais</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {formatarPercentual(indicadores.roiMedio)}
            </div>
            <div className="text-sm text-gray-500">ROI Médio</div>
          </div>
        </Card>
      </div>

      {/* Segunda linha de cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatarMoeda(indicadores.lucroBrutoTotal)}
            </div>
            <div className="text-sm text-gray-500">Lucro Bruto Total</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatarMoeda(indicadores.lucroLiquidoTotal)}
            </div>
            <div className="text-sm text-gray-500">Lucro Líquido Total</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">
              {formatarMoeda(indicadores.caixa)}
            </div>
            <div className="text-sm text-gray-500">Caixa</div>
          </div>
        </Card>

        <Card>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600">
              {indicadores.quantidadeAnimais}
            </div>
            <div className="text-sm text-gray-500">Animais Ativos</div>
          </div>
        </Card>
      </div>

      {/* Visão do Rebanho */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card title="Visão do Rebanho" subtitle="Distribuição dos animais">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Animais Ativos</span>
              <span className="font-semibold text-green-600">
                {indicadores.quantidadeAnimais}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Animais Vendidos</span>
              <span className="font-semibold text-blue-600">
                {indicadores.quantidadeVendidos}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Total</span>
              <span className="font-semibold text-gray-900">
                {indicadores.quantidadeAnimais + indicadores.quantidadeVendidos}
              </span>
            </div>
          </div>
        </Card>

        <Card title="Resumo Financeiro" subtitle="Principais métricas">
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Patrimônio Total</span>
              <span className="font-semibold text-blue-600">
                {formatarMoeda(indicadores.patrimonioTotal)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">Investimento Atual</span>
              <span className="font-semibold text-green-600">
                {formatarMoeda(indicadores.valorInvestidoAtual)}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-sm text-gray-600">ROI Médio</span>
              <span className="font-semibold text-purple-600">
                {formatarPercentual(indicadores.roiMedio)}
              </span>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
