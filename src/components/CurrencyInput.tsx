import { parseCurrencyInput, formatCurrencyInput } from '@/lib/formatter';

interface CurrencyInputProps {
  value: number;
  onChange: (value: number) => void;
  label: string;
}

const CurrencyInput = ({ value, onChange, label }: CurrencyInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const parsed = parseCurrencyInput(e.target.value);
    onChange(parsed);
  };

  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-sm font-medium text-muted-foreground">{label}</label>
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium text-sm">R$</span>
        <input
          type="text"
          inputMode="numeric"
          value={formatCurrencyInput(value)}
          onChange={handleChange}
          className="w-full rounded-lg border border-input bg-card pl-10 pr-4 py-3 text-lg font-semibold text-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
        />
      </div>
    </div>
  );
};

export default CurrencyInput;
