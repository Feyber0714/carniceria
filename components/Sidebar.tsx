
import React from 'react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onNavigate: (view: View) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ currentView, onNavigate }) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'register-animal', label: 'Registrar Animal', icon: '🐂' },
    { id: 'inventory', label: 'Inventario Vivo', icon: '📦' },
    { id: 'new-order', label: 'Venta / Pedido', icon: '💰' },
    { id: 'sales-history', label: 'Historial Ventas', icon: '📜' },
  ];

  return (
    <aside className="w-64 bg-slate-900 text-white min-h-screen hidden md:flex flex-col">
      <div className="p-6 border-b border-slate-800">
        <h1 className="text-xl font-bold flex items-center gap-1">
          <span className="text-red-500 font-black tracking-tight">DON FITO</span>
        </h1>
        <p className="text-xs text-slate-400 mt-1 uppercase tracking-widest">Carnicería Pro</p>
      </div>
      <nav className="flex-1 mt-6 px-4 space-y-2">
        {navItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id as View)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 text-sm font-medium ${
              currentView === item.id
                ? 'bg-red-600 text-white shadow-lg'
                : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-slate-800">
        <div className="flex items-center gap-3 p-2 bg-slate-800 rounded-lg">
          <div className="w-8 h-8 rounded-full bg-red-500 flex items-center justify-center font-bold">DF</div>
          <div>
            <p className="text-xs font-semibold">Admin Fito</p>
            <p className="text-[10px] text-slate-400">Propietario</p>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
