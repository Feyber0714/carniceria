
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import AnimalForm from './components/AnimalForm';
import InventoryList from './components/InventoryList';
import OrderForm from './components/OrderForm';
import { View, AnimalBatch, SaleOrder } from './types';
import { getBatches, getOrders } from './services/inventoryService';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [batches, setBatches] = useState<AnimalBatch[]>([]);
  const [orders, setOrders] = useState<SaleOrder[]>([]);
  const [isSyncing, setIsSyncing] = useState(false);

  const refreshData = () => {
    setIsSyncing(true);
    // Simulate real-time sync with a small timeout
    setTimeout(() => {
        setBatches(getBatches());
        setOrders(getOrders());
        setIsSyncing(false);
    }, 400);
  };

  useEffect(() => {
    refreshData();
  }, []);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard batches={batches} orders={orders} />;
      case 'register-animal':
        return <AnimalForm onSuccess={() => {
            refreshData();
            setCurrentView('inventory');
        }} />;
      case 'inventory':
        return <InventoryList batches={batches} />;
      case 'new-order':
        return <OrderForm batches={batches} onSuccess={() => {
            refreshData();
            setCurrentView('dashboard');
        }} />;
      case 'sales-history':
        return (
          <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            <header>
                <h2 className="text-2xl font-bold text-slate-800">Historial de Ventas</h2>
                <p className="text-slate-500">Registro completo de transacciones realizadas</p>
            </header>
            <div className="overflow-x-auto">
                <table className="w-full text-left">
                    <thead>
                        <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                            <th className="py-4">ID Pedido</th>
                            <th className="py-4">Fecha</th>
                            <th className="py-4">Cliente</th>
                            <th className="py-4">Productos</th>
                            <th className="py-4 text-right">Monto Total</th>
                        </tr>
                    </thead>
                    <tbody className="text-sm">
                        {orders.length === 0 ? (
                            <tr><td colSpan={5} className="py-20 text-center text-slate-400 font-medium">No se han registrado ventas aún.</td></tr>
                        ) : (
                            orders.map(order => (
                                <tr key={order.id} className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
                                    <td className="py-4 font-mono text-xs font-bold text-slate-500">{order.id}</td>
                                    <td className="py-4 text-slate-600">{order.date.toLocaleDateString()} {order.date.toLocaleTimeString()}</td>
                                    <td className="py-4 font-bold text-slate-900">{order.customerName}</td>
                                    <td className="py-4 text-slate-500">{order.items.length} cortes</td>
                                    <td className="py-4 text-right font-black text-red-600">${order.total.toFixed(2)}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
          </div>
        );
      default:
        return <Dashboard batches={batches} orders={orders} />;
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar currentView={currentView} onNavigate={setCurrentView} />
      
      <main className="flex-1 p-4 md:p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-8">
            <div className="md:hidden flex items-center gap-2">
                <span className="text-red-600 font-black text-xl uppercase tracking-tighter">Don Fito</span>
            </div>
            <div className="hidden md:block">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Sucursal Matriz</span>
                <p className="text-sm font-black text-slate-900">Carnicería Don Fito - Calidad Premium</p>
            </div>
            
            <div className="flex items-center gap-4">
                {isSyncing && (
                    <div className="flex items-center gap-2 text-[10px] font-black text-blue-600 animate-pulse uppercase">
                        <span className="w-2 h-2 bg-blue-600 rounded-full"></span>
                        Sincronizando...
                    </div>
                )}
                <button 
                    onClick={refreshData}
                    className="p-2 hover:bg-white rounded-lg border border-transparent hover:border-slate-200 transition-all text-slate-500"
                    title="Actualizar Datos"
                >
                    🔄
                </button>
                <div className="w-px h-6 bg-slate-200"></div>
                <div className="relative group">
                    <button className="flex items-center gap-2 p-2 hover:bg-white rounded-lg transition-all">
                        <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs">👤</div>
                    </button>
                </div>
            </div>
        </header>

        <div className="max-w-6xl mx-auto pb-20">
          {renderView()}
        </div>

        {/* Mobile Navigation */}
        <nav className="fixed bottom-0 left-0 right-0 md:hidden bg-slate-900 border-t border-slate-800 flex justify-around p-3 text-2xl z-50">
           <button onClick={() => setCurrentView('dashboard')} className={currentView === 'dashboard' ? 'text-red-500' : 'text-slate-500'}>📊</button>
           <button onClick={() => setCurrentView('register-animal')} className={currentView === 'register-animal' ? 'text-red-500' : 'text-slate-500'}>🐂</button>
           <button onClick={() => setCurrentView('inventory')} className={currentView === 'inventory' ? 'text-red-500' : 'text-slate-500'}>📦</button>
           <button onClick={() => setCurrentView('new-order')} className={currentView === 'new-order' ? 'text-red-500' : 'text-slate-500'}>💰</button>
        </nav>
      </main>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #f1f5f9;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #94a3b8;
        }
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default App;
