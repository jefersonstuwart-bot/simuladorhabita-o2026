import { useMemo } from 'react';
import { formatCurrency } from '@/lib/formatter';
import { AlertTriangle, TrendingUp, TrendingDown, Percent } from 'lucide-react';
import {
  LineChart,
  Line,
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
      { label: 'Hoje', valor: valor, anos: 0 },
      { label: '+1 ano', valor: v1, anos: 1 },
      { label: '+2 anos', valor: v2, anos: 2 },
      { label: '+3 anos', valor: v3, anos: 3 },
    ];
  }, [valor, taxaAnual]);

  const valorEm3 = dados[3].valor;
  const ganho = valorEm3 - valor;

  const jurosMensal = Math.pow(1 + jurosAnual / 100, 1 / 12) - 1;
  const parcelaHoje = parcelaPrice(valor * 0.8, jurosMensal, prazoFinanciamentoMeses);
  const parcela3 = parcelaPrice(valorEm3 * 0.8, jurosMensal, prazoFinanciamentoMeses);
  const diffParcela = parcela3 - parcelaHoje;

  return (
    <section className="bg-card rounded-2xl border-2 border-[hsl(var(--ready-border))] p-6 md:p-8 shadow-lg">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-ready-accent flex items-center justify-center">
            <AlertTriangle className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h2 className="text-2xl md:text-3xl font-black text-ready-strong">Custo de Esperar</h2>
            <p className="text-sm text-muted-foreground">Quanto você perde ao adiar a compra</p>
          </div>
        </div>

        <div className="flex items-center gap-2 p-2 rounded-lg border border-border bg-background">
          <Percent className="w-4 h-4 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">Valorização a.a.:</span>
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

      {/* Tabela */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
        {dados.map((d, i) => (
          <div
            key={d.label}
            className={`rounded-xl border p-4 text-center transition-all ${
              i === 0
                ? 'bg-[hsl(var(--plan-bg))] border-[hsl(var(--plan-border))]'
                : 'bg-[hsl(var(--ready-bg))] border-[hsl(var(--ready-border))]'
            }`}
          >
            <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">{d.label}</p>
            <p
              className={`text-lg md:text-xl font-black ${
                i === 0 ? 'text-plan-strong' : 'text-ready-strong'
              }`}
            >
              {formatCurrency(d.valor)}
            </p>
            {i > 0 && (
              <p className="text-xs text-[hsl(var(--ready-text))] mt-1">
                +{formatCurrency(d.valor - valor)}
              </p>
            )}
          </div>
        ))}
      </div>

      {/* Gráfico */}
      <div className="h-64 mb-6 -mx-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={dados} margin={{ top: 10, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorValor" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--ready-accent))" stopOpacity={0.5} />
                <stop offset="95%" stopColor="hsl(var(--ready-accent))" stopOpacity={0} />
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
              formatter={(v: number) => formatCurrency(v)}
              contentStyle={{
                background: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: 8,
              }}
            />
            <Area
              type="monotone"
              dataKey="valor"
              stroke="hsl(var(--ready-accent))"
              strokeWidth={3}
              fill="url(#colorValor)"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Comparativo de parcelas */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="rounded-xl border-2 border-[hsl(var(--plan-border))] bg-[hsl(var(--plan-bg))] p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingDown className="w-4 h-4 text-plan-strong" />
            <span className="text-sm font-semibold text-plan-strong">Parcela comprando HOJE</span>
          </div>
          <p className="text-2xl md:text-3xl font-black text-plan-strong">
            {formatCurrency(parcelaHoje)}<span className="text-sm font-medium">/mês</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            Financ. 80% • {prazoFinanciamentoMeses}m • {jurosAnual}% a.a.
          </p>
        </div>
        <div className="rounded-xl border-2 border-[hsl(var(--ready-border))] bg-[hsl(var(--ready-bg))] p-5">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-ready-strong" />
            <span className="text-sm font-semibold text-ready-strong">Parcela em 3 ANOS</span>
          </div>
          <p className="text-2xl md:text-3xl font-black text-ready-strong">
            {formatCurrency(parcela3)}<span className="text-sm font-medium">/mês</span>
          </p>
          <p className="text-xs text-[hsl(var(--ready-text))] mt-1">
            +{formatCurrency(diffParcela)}/mês a mais
          </p>
        </div>
      </div>

      {/* Card destaque */}
      <div className="rounded-2xl bg-gradient-to-br from-[hsl(var(--ready-accent))] to-[hsl(var(--ready-accent-strong))] p-6 md:p-8 text-center shadow-xl">
        <p className="text-sm font-bold uppercase tracking-widest text-primary-foreground/90 mb-2">
          🚨 Custo de Esperar
        </p>
        <p className="text-3xl md:text-5xl font-black text-primary-foreground leading-tight">
          {formatCurrency(ganho)}
        </p>
        <p className="text-sm md:text-base text-primary-foreground/90 mt-1">
          de valorização perdida em 3 anos
        </p>
        <div className="h-px bg-primary-foreground/20 my-4 mx-auto max-w-xs" />
        <p className="text-2xl md:text-3xl font-black text-primary-foreground">
          +{formatCurrency(diffParcela)}<span className="text-base font-medium">/mês</span>
        </p>
        <p className="text-sm text-primary-foreground/90 mt-1">
          de aumento estimado na parcela
        </p>
      </div>
    </section>
  );
};

export default CustoEsperar;