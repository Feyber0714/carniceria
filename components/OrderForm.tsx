
import React, { useState, useMemo } from 'react';
import { AnimalBatch, SaleItem, SaleOrder } from '../types';
import { saveOrderToStorage } from '../services/inventoryService';

interface OrderFormProps {
  batches: AnimalBatch[];
  onSuccess: () => void;
}

const OrderForm: React.FC<OrderFormProps> = ({ batches, onSuccess }) => {
  const [customerName, setCustomerName] = useState('');
  const [cart, setCart] = useState<SaleItem[]>([]);
  
  // Flatten all available cuts into a single list
  const availableCuts = useMemo(() => {
    return batches.flatMap(batch => 
      batch.cuts.filter(cut => cut.availableWeight > 0).map(cut => ({
        ...cut,
        batchId: batch.id
      }))
    );
  }, [batches]);

  const addToCart = (cut: any, weight: number) => {
    if (weight <= 0) return;
    if (weight > cut.availableWeight) {
        alert('No hay suficiente stock para este corte.');
        return;
    }

    const newItem: SaleItem = {
      cutId: cut.id,
      name: `${cut.name} (${cut.batchId})`,
      weight: weight,
      price: cut.unitPrice * weight
    };
    setCart([...cart, newItem]);
  };

  const removeFromCart = (index: number) => {
    const newCart = [...cart];
    newCart.splice(index, 1);
    setCart(newCart);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName) return alert('Ingrese el nombre del cliente.');
    if (cart.length === 0) return alert('El carrito está vacío.');

    const order: SaleOrder = {
      id: `ORD-${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
      customerName,
      date: new Date(),
      items: cart,
      total: cart.reduce((acc, item) => acc + item.price, 0)
    };

    saveOrderToStorage(order);
    alert('Venta realizada con éxito. Inventario actualizado.');
    onSuccess();
  };

  const total = cart.reduce((acc, item) => acc + item.price, 0);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 animate-fadeIn">
      <div className="lg:col-span-2 space-y-6">
        <header>
          <h2 className="text-2xl font-bold text-slate-800">Nueva Venta</h2>
          <p className="text-slate-500">Seleccione los cortes y el peso para descontar de inventario.</p>
        </header>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
            <span>🥩</span> Cortes Disponibles
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {availableCuts.length === 0 ? (
                <div className="col-span-2 text-center py-20 text-slate-400">
                    No hay carne disponible para vender. Registre un animal primero.
                </div>
            ) : (
                availableCuts.map(cut => (
                <div key={cut.id} className="p-4 rounded-xl border border-slate-100 bg-slate-50 flex flex-col justify-between">
                    <div>
                        <div className="flex justify-between items-start mb-1">
                            <p className="font-bold text-slate-900 text-sm">{cut.name}</p>
                            <span className="text-[10px] bg-slate-200 text-slate-600 px-1.5 py-0.5 rounded font-black">{cut.batchId}</span>
                        </div>
                        <p className="text-xs text-slate-500 mb-3">Stock: <b>{cut.availableWeight.toFixed(2)} kg</b> @ ${cut.unitPrice}/kg</p>
                    </div>
                    <div className="flex gap-2">
                        <input 
                            type="number" 
                            step="0.1"
                            placeholder="Kg"
                            className="w-20 px-3 py-1.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-1 focus:ring-red-500"
                            id={`weight-${cut.id}`}
                        />
                        <button 
                            onClick={() => {
                                const input = document.getElementById(`weight-${cut.id}`) as HTMLInputElement;
                                addToCart(cut, parseFloat(input.value));
                                input.value = '';
                            }}
                            className="bg-red-600 text-white px-3 py-1.5 rounded-lg text-sm font-bold hover:bg-red-700 transition-colors"
                        >
                            +
                        </button>
                    </div>
                </div>
                ))
            )}
          </div>
        </div>
      </div>

      <div className="lg:col-span-1">
        <div className="bg-slate-900 text-white rounded-2xl p-6 shadow-xl sticky top-8">
          <h3 className="font-bold text-lg mb-6 border-b border-slate-800 pb-4 flex items-center gap-2">
            <span>🛒</span> Carrito de Venta
          </h3>
          
          <div className="space-y-4 mb-8">
            <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-500">Cliente</label>
                <input 
                    type="text" 
                    placeholder="Nombre del cliente"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full bg-slate-800 border-none rounded-xl px-4 py-3 text-white text-sm outline-none focus:ring-1 focus:ring-red-500 transition-all"
                />
            </div>

            <div className="max-h-[300px] overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                {cart.length === 0 ? (
                    <p className="text-slate-500 text-center py-10 text-xs italic">El carrito está vacío</p>
                ) : (
                    cart.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center group">
                            <div>
                                <p className="text-sm font-bold">{item.name}</p>
                                <p className="text-[10px] text-slate-400">{item.weight}kg x ${item.price/item.weight}/kg</p>
                            </div>
                            <div className="flex items-center gap-3">
                                <p className="text-sm font-black text-red-500">${item.price.toFixed(2)}</p>
                                <button 
                                    onClick={() => removeFromCart(idx)}
                                    className="text-slate-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                    ✕
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
          </div>

          <div className="border-t border-slate-800 pt-6 space-y-6">
            <div className="flex justify-between items-center">
                <p className="text-slate-400 font-bold text-sm uppercase">Total</p>
                <p className="text-3xl font-black text-white">${total.toFixed(2)}</p>
            </div>
            <button 
                onClick={handleSubmit}
                disabled={cart.length === 0}
                className={`w-full py-4 rounded-xl font-bold transition-all ${cart.length === 0 ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-red-600 text-white hover:bg-red-700 shadow-lg shadow-red-900/20 active:scale-95'}`}
            >
                Confirmar Venta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderForm;
