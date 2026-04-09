import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Clock, AlertCircle, CheckCircle2, Play } from 'lucide-react';

export default function BaristaView({ orders, updateStatus }: any) {
  const preparingOrders = orders.filter((o: any) => o.status === 'PREPARING' || o.status === 'PAID');

  return (
    <div className="h-full flex flex-col bg-[#1a1715] text-white">
      {/* KDS Header */}
      <div className="h-20 border-b border-white/10 flex items-center justify-between px-8 bg-[#2d241e]">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 flex items-center justify-center">
               <Coffee size={24} className="text-amber-500" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-widest">Kitchen Display (KDS)</h1>
         </div>
         <div className="flex gap-4">
            <div className="text-right">
               <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Active Tickets</p>
               <p className="text-xl font-black text-amber-500">{preparingOrders.length}</p>
            </div>
         </div>
      </div>

      {/* Preparation Grid */}
      <div className="flex-1 overflow-x-auto p-6 flex gap-6 no-scrollbar">
         <AnimatePresence>
            {preparingOrders.map((order: any) => (
              <motion.div
                key={order.id}
                layoutId={order.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                className={`w-[400px] flex flex-col rounded-3xl overflow-hidden border-2 ${order.status === 'PAID' ? 'border-dashed border-white/20' : 'border-[#7c543c]'}`}
              >
                 {/* Ticket Header */}
                 <div className={`p-5 flex justify-between items-start ${order.status === 'PAID' ? 'bg-white/5' : 'bg-[#7c543c]'}`}>
                    <div>
                       <span className="text-[10px] font-black opacity-60 uppercase tracking-widest">#{order.orderNo.slice(-4)}</span>
                       <h3 className="text-xl font-black truncate max-w-[200px] italic">{order.customerName || 'Walk-in'}</h3>
                    </div>
                    <div className="flex flex-col items-end">
                       <span className={`px-2 py-1 rounded-lg text-[10px] font-black mb-1 ${order.platform === 'GRAB' ? 'bg-grab' : order.platform === 'LINE' ? 'bg-line' : 'bg-white/10'}`}>
                          {order.platform}
                       </span>
                       <div className="flex items-center gap-1 text-[10px] font-bold opacity-60">
                          <Clock size={10} /> {Math.floor((Date.now() - new Date(order.createdAt).getTime()) / 60000)}m ago
                       </div>
                    </div>
                 </div>

                 {/* Items Area */}
                 <div className="flex-1 bg-black/20 p-6 space-y-4 overflow-y-auto no-scrollbar">
                    {order.items?.map((item: any, idx: number) => (
                      <div key={idx} className="border-b border-white/5 pb-4 last:border-0">
                         <div className="flex justify-between items-start">
                           <div className="flex gap-3">
                             <span className="text-xl font-black text-amber-500">x{item.quantity}</span>
                             <span className="text-lg font-bold">{item.productName}</span>
                           </div>
                         </div>
                         {item.selectedOptions && (
                           <div className="flex flex-wrap gap-2 mt-2 ml-10">
                              {item.selectedOptions.map((opt: any, oidx: number) => (
                                <span key={oidx} className="text-xs font-bold text-amber-500/80 bg-amber-500/10 px-2 py-0.5 rounded-md">
                                   {opt.label}
                                </span>
                              ))}
                           </div>
                         )}
                      </div>
                    ))}
                    {order.note && (
                      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex gap-3 text-rose-300">
                         <AlertCircle size={18} className="shrink-0" />
                         <p className="text-sm italic font-bold">{order.note}</p>
                      </div>
                    )}
                 </div>

                 {/* Barista Actions */}
                 <div className="p-5 bg-[#2d241e]">
                    {order.status === 'PAID' ? (
                      <button 
                        onClick={() => updateStatus(order.id, 'PREPARING')}
                        className="w-full py-4 rounded-2xl bg-white text-black font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                      >
                         <Play size={18} /> Start Preparation
                      </button>
                    ) : (
                      <button 
                        onClick={() => updateStatus(order.id, 'READY_FOR_QC')}
                        className="w-full py-4 rounded-2xl bg-emerald-600 text-white font-black uppercase tracking-widest text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-900/40"
                      >
                         <CheckCircle2 size={18} /> Completed (Send to QC)
                      </button>
                    )}
                 </div>
              </motion.div>
            ))}
         </AnimatePresence>

         {preparingOrders.length === 0 && (
           <div className="flex-1 flex flex-col items-center justify-center opacity-20">
              <Coffee size={100} strokeWidth={1} />
              <p className="mt-6 font-black uppercase tracking-[0.2em]">Resting Time • No Orders</p>
           </div>
         )}
      </div>
    </div>
  );
}
