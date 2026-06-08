import { formatCurrency, formatCurrencyInput, parseCurrencyInput } from '@/lib/formatter';
import { TreePine, CalendarClock, PiggyBank, TrendingUp, FileText } from 'lucide-react';

interface CardPlantaProps {
  valor: number;
  highlighted: boolean;
  qtdParcelas: number;
  setQtdParcelas: (v: number) => void;
  entradaInicial: number;
  setEntradaInicial: (v: number) => void;
}

const CardPlanta = ({ valor, highlighted, qtdParcelas, setQtdParcelas, entradaInicial, setEntradaInicial }: CardPlantaProps) => {
  const entradaTotal = valor * 0.2;
  const entradaCapped = Math.min(Math.max(0, entradaInicial), entradaTotal);
  const restante = Math.max(0, entradaTotal - entradaCapped);
  const financiado = valor * 0.8;
  const documentacao = valor * 0.04;
  const totalParcelar = restante + documentacao;
  const parcelaMensal = totalParcelar / qtdParcelas;

  const items = [
    { icon: PiggyBank, label: 'Entrada total (20%)', value: entradaTotal },
    { icon: PiggyBank, label: 'Entrada inicial do cliente', value: entradaCapped, note: 'abatida do restante' },
    { icon: PiggyBank, label: 'Restante a parcelar', value: restante },
    { icon: FileText, label: 'Documentação (4%)', value: documentacao, note: 'incluída nas parcelas' },
    { icon: PiggyBank, label: 'Total parcelado (restante + doc.)', value: totalParcelar },
    { icon: TrendingUp, label: 'Valor financiado (80%)', value: financiado },
  ];

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

      {/* Entrada inicial do cliente */}
      <div className="flex items-center gap-3 mb-3 p-3 rounded-lg bg-[hsl(var(--plan-bg))] border border-[hsl(var(--plan-border))]">
        <PiggyBank className="w-4 h-4 text-[hsl(var(--plan-text))] opacity-60" />
        <span className="text-sm text-[hsl(var(--plan-text))]">Entrada inicial (R$):</span>
        <input
          type="text"
          inputMode="numeric"
          value={formatCurrencyInput(entradaInicial)}
          onChange={(e) => setEntradaInicial(parseCurrencyInput(e.target.value))}
          placeholder="0,00"
          className="flex-1 rounded-md border border-[hsl(var(--plan-border))] bg-card px-2 py-1 text-right font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--plan-accent))]"
        />
      </div>

      {/* Editable parcelas */}
      <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-[hsl(var(--plan-bg))] border border-[hsl(var(--plan-border))]">
        <CalendarClock className="w-4 h-4 text-[hsl(var(--plan-text))] opacity-60" />
        <span className="text-sm text-[hsl(var(--plan-text))]">Parcelas da entrada:</span>
        <input
          type="number"
          min={1}
          max={120}
          value={qtdParcelas}
          onChange={(e) => setQtdParcelas(Math.max(1, Number(e.target.value)))}
          className="w-20 rounded-md border border-[hsl(var(--plan-border))] bg-card px-2 py-1 text-center font-bold text-foreground focus:outline-none focus:ring-2 focus:ring-[hsl(var(--plan-accent))]"
        />
        <span className="text-sm text-[hsl(var(--plan-text))]">meses</span>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div key={i} className="flex items-center justify-between py-2 border-b border-[hsl(var(--plan-border))]">
            <div className="flex items-center gap-2 text-sm text-[hsl(var(--plan-text))]">
              <item.icon className="w-4 h-4 opacity-60" />
              <span>{item.label}</span>
              {item.note && (
                <span className="text-xs bg-[hsl(var(--plan-border))] text-[hsl(var(--plan-text))] px-1.5 py-0.5 rounded opacity-75">
                  {item.note}
                </span>
              )}
            </div>
            <span className="font-semibold text-foreground transition-all duration-300">
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}

        {/* Parcela mensal */}
        <div className="flex items-center justify-between py-2 border-b-2 border-[hsl(var(--plan-accent))]">
          <div className="flex items-center gap-2 text-sm font-bold text-plan-strong">
            <CalendarClock className="w-4 h-4" />
            Parcela mensal ({qtdParcelas}x)
          </div>
          <span className="font-bold text-lg text-plan-strong transition-all duration-300">
            {formatCurrency(parcelaMensal)}
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
