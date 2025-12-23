
import React, { useState } from 'react';
import { AnimalType } from '../types';
import { generateAnimalBatch, saveBatchToStorage } from '../services/inventoryService';
import { YIELD_FORMULAS } from '../constants';

interface AnimalFormProps {
  onSuccess: () => void;
}

const AnimalForm: React.FC<AnimalFormProps> = ({ onSuccess }) => {
  const [type, setType] = useState<AnimalType>(AnimalType.PORK);
  const [weight, setWeight] = useState<number>(0);
  const [preview, setPreview] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (weight <= 0) return alert('Por favor ingrese un peso válido.');
    
    const batch = generateAnimalBatch(type, weight);
    saveBatchToStorage(batch);
    alert(`${type} registrado exitosamente.`);
    onSuccess();
  };

  const formula = YIELD_FORMULAS[type];

  return (
    <div className="max-w-4xl mx-auto animate-fadeIn">
      <header className="mb-8">
        <h2 className="text-2xl font-bold text-slate-800">Registro de Animal</h2>
        <p className="text-slate-500">Ingrese los datos básicos para calcular la distribución de cortes.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl space-y-6">
          <div className="space-y-4">
            <label className="block text-sm font-bold text-slate-700">Tipo de Animal</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setType(AnimalType.PORK)}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  type === AnimalType.PORK
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                }`}
              >
                <span className="text-3xl">🐷</span>
                <span className="font-bold">Cerdo</span>
              </button>
              <button
                type="button"
                onClick={() => setType(AnimalType.BEEF)}
                className={`p-4 rounded-xl border-2 transition-all flex flex-col items-center gap-2 ${
                  type === AnimalType.BEEF
                    ? 'border-red-500 bg-red-50 text-red-600'
                    : 'border-slate-100 bg-slate-50 text-slate-400 hover:border-slate-200'
                }`}
              >
                <span className="text-3xl">🐂</span>
                <span className="font-bold">Res</span>
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-bold text-slate-700">Peso Total (kg)</label>
            <input
              type="number"
              value={weight || ''}
              onChange={(e) => setWeight(Number(e.target.value))}
              placeholder="Ej. 90"
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-red-500 outline-none transition-all text-lg font-medium"
              required
            />
          </div>

          <div className="pt-4 flex gap-3">
             <button
              type="button"
              onClick={() => setPreview(true)}
              className="flex-1 py-3 bg-slate-800 text-white rounded-xl font-bold hover:bg-slate-700 transition-colors"
            >
              Previsualizar
            </button>
            <button
              type="submit"
              className="flex-1 py-3 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 shadow-lg shadow-red-200 transition-all active:scale-95"
            >
              Registrar Entrada
            </button>
          </div>
        </form>

        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-xl overflow-hidden">
          <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>📋</span> Distribución Estimada
          </h3>
          {weight > 0 ? (
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {formula.map((cut) => (
                <div key={cut.name} className="flex justify-between items-center py-3 border-b border-slate-50 last:border-0">
                  <div>
                    <p className="font-bold text-slate-800 text-sm">{cut.name}</p>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">rendimiento: {(cut.percentage * 100).toFixed(0)}%</p>
                  </div>
                  <div className="text-right">
                    <p className="text-md font-black text-red-600">{(weight * cut.percentage).toFixed(2)} kg</p>
                    <p className="text-[10px] text-slate-400">${cut.unitPrice}/kg</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 space-y-3 opacity-60">
              <span className="text-5xl">⚖️</span>
              <p className="text-sm font-medium">Ingrese el peso para ver el cálculo</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AnimalForm;
