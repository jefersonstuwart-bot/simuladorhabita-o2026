import { useState } from 'react';
import logo from '@/assets/logo.png';
import SimulatorInputs from '@/components/SimulatorInputs';
import CardPronto, { calcTotalPronto } from '@/components/CardPronto';
import CardPlanta from '@/components/CardPlanta';
import CustoEsperar from '@/components/CustoEsperar';
import { formatCurrency } from '@/lib/formatter';
import { ShieldCheck, AlertTriangle, Info, Wallet } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';

const Index = () => {
  const [valor, setValor] = useState(350000);
  const [tipo, setTipo] = useState<'novo' | 'usado'>('novo');
  
  const [highlight, setHighlight] = useState<'pronto' | 'planta' | null>(null);
  const [qtdParcelas, setQtdParcelas] = useState(24);
  const [entradaInicial, setEntradaInicial] = useState(0);
  const [taxaValorizacao, setTaxaValorizacao] = useState(10);

  const totalPronto = calcTotalPronto(valor, tipo);
  const entradaTotalPlanta = valor * 0.2;
  const entradaCappedPlanta = Math.min(Math.max(0, entradaInicial), entradaTotalPlanta);
  const restanteEntrada = Math.max(0, entradaTotalPlanta - entradaCappedPlanta);
  const parcelaMensal = (restanteEntrada + valor * 0.04) / qtdParcelas;
  const capitalPreservado = Math.max(0, totalPronto - entradaCappedPlanta);

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="py-8 md:py-12 text-center px-4">
        <img src={logo} alt="Imobispace Home" className="w-40 h-40 mx-auto mb-4 object-contain" />
        <h1 className="text-3xl md:text-5xl font-black text-foreground tracking-tight leading-tight">
          Simulador Imobiliário Curitiba
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
        />

        {/* Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <CardPronto valor={valor} tipo={tipo} highlighted={highlight === 'pronto'} />
          <CardPlanta
            valor={valor}
            highlighted={highlight === 'planta'}
            qtdParcelas={qtdParcelas}
            setQtdParcelas={setQtdParcelas}
            entradaInicial={entradaInicial}
            setEntradaInicial={setEntradaInicial}
          />
        </div>

        {/* Comparativo de Capital Inicial */}
        {valor > 0 && (
          <section className="rounded-2xl border-2 border-[hsl(var(--plan-border))] bg-gradient-to-br from-plan-bg to-card p-6 md:p-10 text-center shadow-sm">
            <div className="flex items-center justify-center gap-2 mb-3">
              <Wallet className="w-5 h-5 text-plan-strong" />
              <h2 className="text-base md:text-lg font-bold uppercase tracking-widest text-foreground">
                Comparativo de Capital Inicial
              </h2>
              <Popover>
                <PopoverTrigger asChild>
                  <button
                    type="button"
                    aria-label="Mais informações"
                    className="inline-flex items-center justify-center w-6 h-6 rounded-full text-muted-foreground hover:text-foreground hover:bg-background transition-colors"
                  >
                    <Info className="w-4 h-4" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="text-sm leading-relaxed max-w-xs">
                  Este valor representa a diferença entre o capital exigido imediatamente no imóvel pronto e o valor necessário para iniciar a compra na planta.
                </PopoverContent>
              </Popover>
            </div>
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-2">
              Capital preservado neste momento
            </p>
            <p className="text-4xl md:text-6xl font-black text-plan-strong leading-tight tracking-tight">
              {formatCurrency(capitalPreservado)}
            </p>
            <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-xl mx-auto">
              Valor que permanece disponível no seu caixa ao optar pela compra na planta.
            </p>
            <div className="grid grid-cols-2 gap-4 mt-6 max-w-md mx-auto">
              <div className="rounded-lg bg-card border border-border p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Pronto hoje</p>
                <p className="text-base font-bold text-ready-strong">{formatCurrency(totalPronto)}</p>
              </div>
              <div className="rounded-lg bg-card border border-border p-3">
                <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Planta hoje</p>
                <p className="text-base font-bold text-plan-strong">{formatCurrency(entradaCappedPlanta)}</p>
              </div>
            </div>
          </section>
        )}

        {/* Seção secundária: Valorização */}
        <div className="pt-4">
          <p className="text-xs uppercase tracking-widest text-muted-foreground text-center mb-3">
            Análise complementar
          </p>
          <CustoEsperar valor={valor} taxaAnual={taxaValorizacao} setTaxaAnual={setTaxaValorizacao} />
        </div>

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
