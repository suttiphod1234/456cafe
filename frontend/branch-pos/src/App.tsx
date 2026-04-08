import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Clock, CheckCircle2, Play, Package, AlertTriangle, Coffee, MoreVertical } from 'lucide-react';

const mockOrders = [
  { id: '101', customer: 'John Doe', items: ['Dirty Coffee', 'Espresso'], status: 'PENDING', time: '5m' },
  { id: '102', customer: 'Jane Smith', items: ['Iced Americano'], status: 'PREPARING', time: '2m' },
  { id: '103', customer: 'Bob White', items: ['Latte', 'Croissant'], status: 'READY', time: '8m' },
  { id: '104', customer: 'Alice Green', items: ['Flat White'], status: 'PENDING', time: '1m' },
];

export default function App() {
  const [orders, setOrders] = useState(mockOrders);

  const columns = [
    { id: 'PENDING', title: 'Pending', icon: <Clock size={20} className="text-amber-500" />, color: 'border-amber-500/50' },
    { id: 'PREPARING', title: 'Preparing', icon: <Play size={20} className="text-blue-500" />, color: 'border-blue-500/50' },
    { id: 'READY', title: 'Ready', icon: <CheckCircle2 size={20} className="text-emerald-500" />, color: 'border-emerald-500/50' },
    { id: 'PICKED_UP', title: 'Picked Up', icon: <Package size={20} className="text-indigo-500" />, color: 'border-indigo-500/50' },
  ];

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Top Header */}
      <header className="h-16 flex items-center justify-between px-8 bg-white/5 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
            <Coffee size={24} className="text-emerald-500" />
          </div>
          <div>
            <h1 className="text-lg font-bold">Branch POS & Kanban</h1>
            <p className="text-xs text-gray-400">Main Branch - Station 1</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2 bg-amber-500/10 text-amber-500 px-3 py-1.5 rounded-lg text-xs font-bold border border-amber-500/20">
            <AlertTriangle size={14} /> Low Stock: Milk
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">8 April 2026</p>
            <p className="text-[10px] text-gray-500 uppercase tracking-widest">08:24 AM</p>
          </div>
        </div>
      </header>

      {/* Kanban Board */}
      <main className="flex-1 flex gap-6 p-6 overflow-x-auto no-scrollbar">
        {columns.map((column) => (
          <div key={column.id} className="w-[350px] flex flex-col shrink-0">
            <div className={`flex items-center justify-between mb-4 pb-2 border-b-2 ${column.color}`}>
              <div className="flex items-center gap-3">
                {column.icon}
                <h3 className="font-bold">{column.title}</h3>
                <span className="bg-white/10 px-2 py-0.5 rounded text-xs">
                  {orders.filter(o => o.status === column.id).length}
                </span>
              </div>
              <button className="text-gray-500 hover:text-white transition-colors">
                <MoreVertical size={18} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto pr-2 flex flex-col gap-4 no-scrollbar">
              {orders
                .filter((order) => order.status === column.id)
                .map((order) => (
                  <motion.div
                    key={order.id}
                    layoutId={order.id}
                    className="order-card p-5"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Order #{order.id}</span>
                        <h4 className="font-bold text-lg">{order.customer}</h4>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1.5 px-2 py-1 glass-morphism rounded-lg">
                        <Clock size={12} /> {order.time}
                      </div>
                    </div>
                    
                    <div className="space-y-2 mb-6">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-sm text-gray-300">
                          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 opacity-50" />
                          {item}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 py-2 text-xs font-bold rounded-xl glass-morphism hover:bg-white/10 transition-all">
                        Details
                      </button>
                      <button 
                        className="flex-1 py-2 text-xs font-bold rounded-xl bg-white text-black hover:bg-gray-200 transition-all"
                        onClick={() => {
                          const nextStatusIndex = columns.findIndex(c => c.id === order.status) + 1;
                          if (nextStatusIndex < columns.length) {
                            setOrders(orders.map(o => o.id === order.id ? { ...o, status: columns[nextStatusIndex].id } : o));
                          }
                        }}
                      >
                        {column.id === 'READY' ? 'Pick Up' : 'Next Step'}
                      </button>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}
