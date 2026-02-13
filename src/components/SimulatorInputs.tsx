import CurrencyInput from './CurrencyInput';

interface SimulatorInputsProps {
  valor: number;
  setValor: (v: number) => void;
  tipo: 'novo' | 'usado';
  setTipo: (t: 'novo' | 'usado') => void;
}

const SimulatorInputs = ({ valor, setValor, tipo, setTipo }: SimulatorInputsProps) => {
  return (
    <div className="bg-card rounded-2xl border border-border p-6 shadow-sm">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CurrencyInput value={valor} onChange={setValor} label="Valor do Imóvel" />

        <div className="flex flex-col gap-1.5">
          <label className="text-sm font-medium text-muted-foreground">Tipo do Imóvel</label>
          <div className="flex gap-4 mt-2">
            {(['novo', 'usado'] as const).map((t) => (
              <label
                key={t}
                className={`flex items-center gap-2 px-4 py-3 rounded-lg border cursor-pointer transition-all ${
                  tipo === t
                    ? 'border-foreground bg-primary text-primary-foreground'
                    : 'border-input bg-card hover:bg-muted'
                }`}
              >
                <input
                  type="radio"
                  name="tipo"
                  value={t}
                  checked={tipo === t}
                  onChange={() => setTipo(t)}
                  className="sr-only"
                />
                <span className="font-medium capitalize">{t}</span>
                <span className="text-xs opacity-75">
                  ({t === 'novo' ? '80%' : '70%'} financ.)
                </span>
              </label>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SimulatorInputs;
