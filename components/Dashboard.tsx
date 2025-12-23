
import React from 'react';
import { AnimalBatch, SaleOrder } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface DashboardProps {
  batches: AnimalBatch[];
  orders: SaleOrder[];
}

const Dashboard: React.FC<DashboardProps> = ({ batches, orders }) => {
  const totalWeightInStock = batches.reduce((acc, b) => 
    acc + b.cuts.reduce((cAcc, c) => cAcc + c.availableWeight, 0), 0
  );
  
  const totalSalesValue = orders.reduce((acc, o) => acc + o.total, 0);
  const totalOrders = orders.length;

  const chartData = [
    { name: 'Stock Disponible (kg)', value: totalWeightInStock, color: '#ef4444' },
    { name: 'Ventas Totales ($)', value: totalSalesValue / 100, color: '#22c55e' } // Scaled for visual comparison
  ];

  return (
    <div className="space-y-6 animate-fadeIn">
      <header>
        <h2 className="text-2xl font-bold text-slate-800">Panel de Control</h2>
        <p className="text-slate-500">Resumen del estado actual del negocio</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center text-red-600 text-xl">🥩</div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Stock Total</p>
            <p className="text-2xl font-bold text-slate-900">{totalWeightInStock.toFixed(1)} <span className="text-sm font-normal">kg</span></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center text-green-600 text-xl">💰</div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Ventas Totales</p>
            <p className="text-2xl font-bold text-slate-900">${totalSalesValue.toLocaleString()} <span className="text-sm font-normal text-slate-400">MXN</span></p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">🛒</div>
          <div>
            <p className="text-sm text-slate-500 font-medium">Pedidos Realizados</p>
            <p className="text-2xl font-bold text-slate-900">{totalOrders}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-6">Métricas Operativas</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} />
                <YAxis axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: '#f8fafc' }} />
                <Bar dataKey="value" radius={[6, 6, 0, 0]}>
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-sm">
          <h3 className="font-bold text-slate-800 mb-4">Actividad Reciente</h3>
          <div className="space-y-4">
            {orders.length === 0 ? (
              <p className="text-slate-400 text-center py-10">No hay ventas registradas.</p>
            ) : (
              orders.slice(0, 5).map((order) => (
                <div key={order.id} className="flex justify-between items-center p-3 hover:bg-slate-50 rounded-lg border border-transparent transition-colors">
                  <div className="flex gap-3 items-center">
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600 text-xs">
                      {order.customerName.charAt(0)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">{order.customerName}</p>
                      <p className="text-xs text-slate-500">{order.date.toLocaleTimeString()}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-slate-900">${order.total.toFixed(2)}</p>
                    <p className="text-[10px] text-green-600 font-bold uppercase tracking-wider">Completada</p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
