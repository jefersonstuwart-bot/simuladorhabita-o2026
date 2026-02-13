import { formatCurrency } from '@/lib/formatter';
import { Building2, FileText, Landmark, UserCheck, Wrench, BookOpen } from 'lucide-react';

interface CardProntoProps {
  valor: number;
  tipo: 'novo' | 'usado';
  highlighted: boolean;
}

const CardPronto = ({ valor, tipo, highlighted }: CardProntoProps) => {
  const percEntrada = tipo === 'novo' ? 0.2 : 0.3;
  const entrada = valor * percEntrada;
  const documentacao = valor * 0.04;
  const funrejus = 850;
  const correspondente = 1700;
  const tacCaixa = 1200;
  const engenheiroCaixa = 2500;
  const registro = valor * 0.017;

  const total = entrada + documentacao + funrejus + correspondente + tacCaixa + engenheiroCaixa + registro;

  const items = [
    { icon: Building2, label: `Entrada (${percEntrada * 100}%)`, value: entrada },
    { icon: FileText, label: 'Documentação (4%)', value: documentacao },
    { icon: Landmark, label: 'Funrejus', value: funrejus },
    { icon: UserCheck, label: 'Correspondente', value: correspondente },
    { icon: Landmark, label: 'TAC Caixa', value: tacCaixa },
    { icon: Wrench, label: 'Engenheiro Caixa', value: engenheiroCaixa },
    { icon: BookOpen, label: 'Registro (1.7%)', value: registro },
  ];

  return (
    <div
      className={`card-ready rounded-2xl border-2 p-6 transition-all duration-500 ${
        highlighted ? 'highlight-ready' : ''
      }`}
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-ready-accent flex items-center justify-center">
          <Building2 className="w-5 h-5 text-primary-foreground" />
        </div>
        <h2 className="text-xl font-bold text-ready-strong">Imóvel Pronto</h2>
      </div>

      <div className="space-y-3">
        {items.map((item, i) => (
          <div
            key={i}
            className="flex items-center justify-between py-2 border-b border-[hsl(var(--ready-border))]"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="flex items-center gap-2 text-sm text-[hsl(var(--ready-text))]">
              <item.icon className="w-4 h-4 opacity-60" />
              {item.label}
            </div>
            <span className="font-semibold text-foreground transition-all duration-300">
              {formatCurrency(item.value)}
            </span>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="text-xs uppercase tracking-wider text-muted-foreground mb-1">Você precisa ter hoje</p>
        <p className="text-3xl md:text-4xl font-black text-ready-strong transition-all duration-300">
          {formatCurrency(total)}
        </p>
        <p className="mt-3 text-sm italic text-[hsl(var(--ready-text))] opacity-80">
          Alto impacto imediato no seu caixa.
        </p>
      </div>
    </div>
  );
};

export default CardPronto;
export function calcTotalPronto(valor: number, tipo: 'novo' | 'usado') {
  const percEntrada = tipo === 'novo' ? 0.2 : 0.3;
  return valor * percEntrada + valor * 0.04 + 850 + 1700 + 1200 + 2500 + valor * 0.017;
}
