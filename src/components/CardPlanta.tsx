import { formatCurrency } from '@/lib/formatter';
import { TreePine, CalendarClock, PiggyBank, TrendingUp } from 'lucide-react';

interface CardPlantaProps {
  valor: number;
  prazoObra: number;
  highlighted: boolean;
}

const CardPlanta = ({ valor, prazoObra, highlighted }: CardPlantaProps) => {
  const entradaTotal = valor * 0.2;
  const parcelaMensal = entradaTotal / prazoObra;
  const financiado = valor * 0.8;

  return (
    <div
      className={`card-plan rounded-2xl border-2 p-6 transition-all duration-500 ${
        highlighted ? 'highlight-plan' : ''
      }`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-plan-accent flex items-center justify-center">
          <TreePine className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-bold text-plan-strong">Imóvel na Planta</h2>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between py-2 border-b border-[hsl(var(--plan-border))]">
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--plan-text))]">
            <PiggyBank className="w-4 h-4 opacity-60" />
            Entrada total (20%)
          </div>
          <span className="font-semibold text-foreground transition-all duration-300">
            {formatCurrency(entradaTotal)}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-[hsl(var(--plan-border))]">
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--plan-text))]">
            <CalendarClock className="w-4 h-4 opacity-60" />
            Parcela mensal ({prazoObra}x)
          </div>
          <span className="font-semibold text-foreground transition-all duration-300">
            {formatCurrency(parcelaMensal)}
          </span>
        </div>

        <div className="flex items-center justify-between py-2 border-b border-[hsl(var(--plan-border))]">
          <div className="flex items-center gap-2 text-sm text-[hsl(var(--plan-text))]">
            <TrendingUp className="w-4 h-4 opacity-60" />
            Valor financiado (80%)
          </div>
          <span className="font-semibold text-foreground transition-all duration-300">
            {formatCurrency(financiado)}
          </span>
        </div>
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Você entra com</p>
        <p className="text-3xl md:text-4xl font-black text-plan-strong transition-all duration-300">
          {formatCurrency(parcelaMensal)}<span className="text-lg font-medium">/mês</span>
        </p>
        <p className="mt-3 text-sm italic text-[hsl(var(--plan-text))] opacity-80">
          Você preserva seu dinheiro e se organiza com planejamento.
        </p>
      </div>
    </div>
  );
};

export default CardPlanta;
