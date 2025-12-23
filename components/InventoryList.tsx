
import React, { useState } from 'react';
import { AnimalBatch, AnimalType } from '../types';

interface InventoryListProps {
  batches: AnimalBatch[];
}

const InventoryList: React.FC<InventoryListProps> = ({ batches }) => {
  const [filter, setFilter] = useState<AnimalType | 'ALL'>('ALL');

  const filteredBatches = filter === 'ALL' 
    ? batches 
    : batches.filter(b => b.type === filter);

  const stats = {
    pork: batches.filter(b => b.type === AnimalType.PORK).reduce((acc, b) => acc + b.cuts.reduce((cAcc, c) => cAcc + c.availableWeight, 0), 0),
    beef: batches.filter(b => b.type === AnimalType.BEEF).reduce((acc, b) => acc + b.cuts.reduce((cAcc, c) => cAcc + c.availableWeight, 0), 0)
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-800">Inventario en Tiempo Real</h2>
          <p className="text-slate-500">Stock disponible organizado por lotes de entrada</p>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => setFilter('ALL')}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === 'ALL' ? 'bg-slate-800 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
          >
            Todos
          </button>
          <button 
            onClick={() => setFilter(AnimalType.PORK)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === AnimalType.PORK ? 'bg-pink-600 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
          >
            Cerdos
          </button>
          <button 
            onClick={() => setFilter(AnimalType.BEEF)}
            className={`px-4 py-2 rounded-lg text-sm font-bold transition-all ${filter === AnimalType.BEEF ? 'bg-amber-800 text-white' : 'bg-white text-slate-600 border border-slate-200'}`}
          >
            Reses
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div className="bg-pink-50 p-4 rounded-xl border border-pink-100">
           <p className="text-xs font-bold text-pink-600 uppercase tracking-widest mb-1">Total Cerdo</p>
           <p className="text-2xl font-black text-pink-900">{stats.pork.toFixed(2)} kg</p>
        </div>
        <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
           <p className="text-xs font-bold text-amber-800 uppercase tracking-widest mb-1">Total Res</p>
           <p className="text-2xl font-black text-amber-900">{stats.beef.toFixed(2)} kg</p>
        </div>
      </div>

      <div className="space-y-8">
        {filteredBatches.length === 0 ? (
          <div className="bg-white p-20 text-center rounded-2xl border border-dashed border-slate-200">
            <span className="text-6xl block mb-4">📭</span>
            <p className="text-slate-500 font-medium">No hay registros en el inventario.</p>
          </div>
        ) : (
          filteredBatches.map(batch => (
            <div key={batch.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="bg-slate-50 px-6 py-4 flex justify-between items-center border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{batch.type === AnimalType.PORK ? '🐷' : '🐂'}</span>
                  <div>
                    <h3 className="font-bold text-slate-800">{batch.id}</h3>
                    <p className="text-[10px] text-slate-500 uppercase font-black tracking-widest">{batch.date.toLocaleDateString()} • Peso Inicial: {batch.initialWeight}kg</p>
                  </div>
                </div>
                <div className="text-right">
                   <p className="text-xs font-bold text-slate-400 mb-1">EFICIENCIA</p>
                   <div className="w-24 h-2 bg-slate-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500" style={{ width: '85%' }}></div>
                   </div>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 p-6">
                {batch.cuts.map(cut => (
                  <div key={cut.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50/50 hover:bg-white hover:shadow-md transition-all">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-bold text-slate-800 text-sm truncate pr-2">{cut.name}</p>
                      <span className={`text-[8px] font-black px-1.5 py-0.5 rounded uppercase tracking-tighter ${cut.availableWeight > 5 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                        {cut.availableWeight > 5 ? 'Disponible' : 'Bajo Stock'}
                      </span>
                    </div>
                    <div className="relative pt-4">
                      <div className="flex justify-between items-baseline">
                        <p className="text-xl font-black text-slate-900 leading-none">{cut.availableWeight.toFixed(2)}</p>
                        <p className="text-[10px] font-bold text-slate-400">/ {cut.totalWeight}kg</p>
                      </div>
                      <div className="mt-2 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div 
                          className={`h-full transition-all duration-1000 ${cut.availableWeight / cut.totalWeight > 0.3 ? 'bg-red-500' : 'bg-red-700'}`}
                          style={{ width: `${(cut.availableWeight / cut.totalWeight) * 100}%` }}
                        ></div>
                      </div>
                    </div>
                    <p className="mt-2 text-[10px] font-bold text-slate-500 text-right uppercase tracking-widest">${cut.unitPrice} MXN/KG</p>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default InventoryList;
