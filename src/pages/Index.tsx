import { useState } from 'react';
import SimulatorInputs from '@/components/SimulatorInputs';
import CardPronto, { calcTotalPronto } from '@/components/CardPronto';
import CardPlanta from '@/components/CardPlanta';
import { formatCurrency } from '@/lib/formatter';
import { ShieldCheck, AlertTriangle } from 'lucide-react';

const Index = () => {
  const [valor, setValor] = useState(350000);
  const [tipo, setTipo] = useState<'novo' | 'usado'>('novo');
  const [prazoObra, setPrazoObra] = useState(24);
  const [highlight, setHighlight] = useState<'pronto' | 'planta' | null>(null);

  const totalPronto = calcTotalPronto(valor, tipo);
  const parcelaMensal = (valor * 0.2) / prazoObra;
  const diferenca = totalPronto - parcelaMensal;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-8 md:py-12 text-center px-4">
        <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
          Simulador Estratégico
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground mt-3 max-w-2xl mx-auto">
          Descubra qual cenário protege melhor seu dinheiro hoje.
        </p>
      </header>

      <main className="max-w-6xl mx-auto px-4 pb-16 space-y-8">
        {/* Inputs */}
        <SimulatorInputs
          valor={valor}
          setValor={setValor}
          tipo={tipo}
          setTipo={setTipo}
          prazoObra={prazoObra}
          setPrazoObra={setPrazoObra}
        />

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardPronto valor={valor} tipo={tipo} highlighted={highlight === 'pronto'} />
          <CardPlanta valor={valor} prazoObra={prazoObra} highlighted={highlight === 'planta'} />
        </div>

        {/* Difference Banner */}
        {valor > 0 && (
          <div className="bg-card rounded-2xl border border-border p-6 text-center shadow-sm">
            <div className="flex items-center justify-center gap-2 text-muted-foreground mb-2">
              <ShieldCheck className="w-5 h-5" />
              <span className="text-sm font-medium uppercase tracking-wider">Comparativo</span>
            </div>
            <p className="text-lg md:text-xl text-foreground">
              Na planta você evita descapitalizar aproximadamente{' '}
              <span className="font-black text-plan-strong text-2xl md:text-3xl">
                {formatCurrency(diferenca)}
              </span>{' '}
              agora.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => setHighlight(highlight === 'planta' ? null : 'planta')}
            className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              highlight === 'planta'
                ? 'bg-plan-accent text-primary-foreground shadow-lg scale-105'
                : 'bg-[hsl(var(--plan-bg))] text-plan-strong border-2 border-[hsl(var(--plan-border))] hover:shadow-md'
            }`}
          >
            <ShieldCheck className="w-5 h-5" />
            Quero preservar meu capital
          </button>
          <button
            onClick={() => setHighlight(highlight === 'pronto' ? null : 'pronto')}
            className={`flex items-center justify-center gap-2 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 ${
              highlight === 'pronto'
                ? 'bg-ready-accent text-primary-foreground shadow-lg scale-105'
                : 'bg-[hsl(var(--ready-bg))] text-ready-strong border-2 border-[hsl(var(--ready-border))] hover:shadow-md'
            }`}
          >
            <AlertTriangle className="w-5 h-5" />
            Prefiro pagar tudo agora
          </button>
        </div>
      </main>
    </div>
  );
};

export default Index;
