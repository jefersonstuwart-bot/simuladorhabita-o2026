import { useEffect, useMemo, useRef, useState } from 'react';
import { formatCurrency } from '@/lib/formatter';
import {
  LineChart as LineChartIcon,
  TrendingUp,
  Percent,
  Home,
  Calculator,
  Shield,
  Sparkles,
} from 'lucide-react';
import {
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
} from 'recharts';

interface CustoEsperarProps {
  valor: number;
  taxaAnual: number; // ex: 10 = 10%
  setTaxaAnual: (v: number) => void;
  prazoFinanciamentoMeses?: number; // padrao 360
  jurosAnual?: number; // padrao 10% a.a. financiamento
}

function parcelaPrice(principal: number, jurosMensal: number, meses: number) {
  if (jurosMensal === 0) return principal / meses;
  const f = Math.pow(1 + jurosMensal, meses);
  return (principal * jurosMensal * f) / (f - 1);
}

function useAnimatedNumber(value: number, duration = 600) {
  const [display, setDisplay] = useState(value);
  const fromRef = useRef(value);
  const startRef = useRef<number | null>(null);
  useEffect(() => {
    const from = fromRef.current;
    const to = value;
    startRef.current = null;
    let raf = 0;
    const tick = (t: number) => {
      if (startRef.current === null) startRef.current = t;
      const p = Math.min(1, (t - startRef.current) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      setDisplay(from + (to - from) * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
      else fromRef.current = to;
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [value, duration]);
  return display;
}

const AnimatedCurrency = ({ value, className }: { value: number; className?: string }) => {
  const v = useAnimatedNumber(value);
  return <span className={className}>{formatCurrency(v)}</span>;
};

const CustoEsperar = ({
  valor,
  taxaAnual,
  setTaxaAnual,
  prazoFinanciamentoMeses = 360,
  jurosAnual = 10,
}: CustoEsperarProps) => {
  const dados = useMemo(() => {
    const r = taxaAnual / 100;
    const v1 = valor * Math.pow(1 + r, 1);
    const v2 = valor * Math.pow(1 + r, 2);
    const v3 = valor * Math.pow(1 + r, 3);
    return [
      { label: 'Hoje', valor: valor, anos: 0, diff: 0 },
      { label: '+1 Ano', valor: v1, anos: 1, diff: v1 - valor },
      { label: '+2 Anos', valor: v2, anos: 2, diff: v2 - valor },
      { label: '+3 Anos', valor: v3, anos: 3, diff: v3 - valor },
    ];
  }, [valor, taxaAnual]);

  const valorEm3 = dados[3].valor;
  const ganho = valorEm3 - valor;

  const jurosMensal = Math.pow(1 + jurosAnual / 100, 1 / 12) - 1;
  const parcelaHoje = parcelaPrice(valor * 0.8, jurosMensal, prazoFinanciamentoMeses);
  const parcela3 = parcelaPrice(valorEm3 * 0.8, jurosMensal, prazoFinanciamentoMeses);
  const diffParcela = parcela3 - parcelaHoje;

  return (
    <section className="bg-card rounded-2xl border border-border p-6 md:p-10 shadow-sm">
      <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-8">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-plan-bg border border-[hsl(var(--plan-border))] flex items-center justify-center shrink-0">
            <LineChartIcon className="w-6 h-6 text-plan-strong" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">
              Comprar Hoje <span className="text-muted-foreground font-light">x</span> Comprar Depois
            </h2>
            <p className="text-sm md:text-base text-muted-foreground mt-1 max-w-2xl">
              Veja como a valorização do imóvel pode impactar o valor da compra e do financiamento ao longo do tempo.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg border border-border bg-background shrink-0">
          <Percent className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Valorização a.a.</span>
          <input
            type="number"
            min={0}
            max={100}
            step={0.5}
            value={taxaAnual}
            onChange={(e) => setTaxaAnual(Math.max(0, Number(e.target.value)))}
            className="w-16 rounded-md border border-input bg-card px-2 py-1 text-center font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <span className="text-xs text-muted-foreground">%</span>
        </div>
      </div>

      {/* Cards de valorização */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-2">
        {dados.map((d, i) => (
          <div
            key={d.label}
            className={`rounded-xl border p-4 text-center transition-all ${
              i === 0
                ? 'bg-background border-border'
                : 'bg-plan-bg border-[hsl(var(--plan-border))]'
            }`}
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{d.label}</p>
            <AnimatedCurrency
              value={d.valor}
              className={`block text-lg md:text-xl font-black ${
                i === 0 ? 'text-foreground' : 'text-plan-strong'
              }`}
            />
            {i > 0 && (
              <p className="text-xs text-plan-strong/80 mt-1 font-medium">
                +<AnimatedCurrency value={d.diff} />
              </p>
            )}
          </div>
        ))}
      </div>
      <p className="text-xs text-muted-foreground text-center mb-8 italic">
        Simulação baseada em valorização anual estimada.
      </p>

      {/* Gráfico */}
      <div className="mb-8">
        <p className="text-sm font-semibold text-foreground mb-3">
          Evolução estimada do valor do imóvel
        </p>
        <div className="h-64 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dados} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--plan-accent))" stopOpacity={0.35} />
                <stop offset="95%" stopColor="hsl(var(--plan-accent))" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis dataKey="label" stroke="hsl(var(--muted-foreground))" fontSize={12} />
            <YAxis
              stroke="hsl(var(--muted-foreground))"
              fontSize={12}
              tickFormatter={(v) => `R$${(v / 1000).toFixed(0)}k`}
            />
            <Tooltip
              cursor={{ stroke: 'hsl(var(--plan-accent))', strokeOpacity: 0.2 }}
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 8,
                fontSize: 12,
              }}
              content={({ active, payload, label }) => {
                if (!active || !payload?.length) return null;
                const d = payload[0].payload as { valor: number; diff: number };
                return (
                  <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-md text-xs">
                    <p className="font-semibold text-foreground mb-1">{label}</p>
                    <p className="text-muted-foreground">
                      Valor: <span className="font-bold text-foreground">{formatCurrency(d.valor)}</span>
                    </p>
                    <p className="text-muted-foreground">
                      Diferença: <span className="font-bold text-plan-strong">+{formatCurrency(d.diff)}</span>
                    </p>
                  </div>
                );
              }}
            />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="hsl(var(--plan-accent))"
              strokeWidth={3}
              fill="url(#colorValor)"
            />
          </AreaChart>
        </ResponsiveContainer>
        </div>
      </div>

      {/* Comparativo de parcelas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-2">
        <div className="rounded-xl border border-border bg-background p-5">
          <div className="flex items-center gap-2 mb-2">
            <Calculator className="w-4 h-4 text-muted-foreground" />
            <span className="text-sm font-semibold text-foreground">Simulação de compra hoje</span>
          </div>
          <p className="text-2xl md:text-3xl font-black text-foreground">
            <AnimatedCurrency value={parcelaHoje} /><span className="text-sm font-medium text-muted-foreground">/mês</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Financ. 80% • {prazoFinanciamentoMeses}m • {jurosAnual}% a.a.
          </p>
        </div>
        <div className="rounded-xl border border-[hsl(var(--plan-border))] bg-plan-bg p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-plan-strong" />
            <span className="text-sm font-semibold text-plan-strong">Simulação após 3 anos de valorização</span>
          </div>
          <p className="text-2xl md:text-3xl font-black text-plan-strong">
            <AnimatedCurrency value={parcela3} /><span className="text-sm font-medium">/mês</span>
          </p>
          <p className="text-xs text-plan-strong/80 mt-1">
            +<AnimatedCurrency value={diffParcela} />/mês na parcela estimada
          </p>
        </div>
      </div>
      <p className="text-xs text-muted-foreground text-center mb-8 italic">
        Valores ilustrativos considerando as mesmas condições de financiamento.
      </p>

      {/* Bloco destaque - Impacto da Valorização */}
      <div className="rounded-2xl border border-[hsl(var(--plan-border))] bg-gradient-to-br from-plan-bg to-background p-6 md:p-10 text-center shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-card border border-border mb-4">
          <TrendingUp className="w-4 h-4 text-plan-strong" />
          <span className="text-xs font-semibold uppercase tracking-widest text-foreground">
            Impacto da Valorização
          </span>
        </div>
        <p className="text-4xl md:text-6xl font-black text-plan-strong leading-tight tracking-tight">
          <AnimatedCurrency value={ganho} />
        </p>
        <p className="text-sm md:text-base text-muted-foreground mt-3 max-w-md mx-auto">
          Diferença estimada entre comprar hoje e comprar após o período selecionado.
        </p>
      </div>

      {/* Bloco educativo */}
      <div className="mt-8 rounded-2xl border border-border bg-background p-6 md:p-8">
        <h3 className="text-lg md:text-xl font-black text-foreground mb-2">
          Por que muitas famílias antecipam a compra?
        </h3>
        <p className="text-sm md:text-base text-muted-foreground mb-6 max-w-3xl">
          A valorização do imóvel pode aumentar o valor financiado no futuro. Além disso, condições de mercado, subsídios e disponibilidade das unidades podem mudar ao longo do tempo.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: Home, title: 'Valorização do imóvel', text: 'O preço por m² tende a acompanhar a evolução do mercado.' },
            { icon: Shield, title: 'Condições de financiamento', text: 'Taxas, subsídios e regras podem mudar entre ciclos econômicos.' },
            { icon: Sparkles, title: 'Disponibilidade', text: 'Unidades em localizações estratégicas costumam ser limitadas.' },
          ].map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-3 p-4 rounded-xl bg-card border border-border">
              <div className="w-9 h-9 rounded-lg bg-plan-bg border border-[hsl(var(--plan-border))] flex items-center justify-center shrink-0">
                <Icon className="w-4 h-4 text-plan-strong" />
              </div>
              <div>
                <p className="text-sm font-bold text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground mt-1 leading-relaxed">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default CustoEsperar;