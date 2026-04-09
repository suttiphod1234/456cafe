import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, CheckCircle2, BellRing, Clock } from 'lucide-react';

export default function QueueMonitorView({ branch, orders }: any) {
  const preparing = orders.filter((o: any) => ['PAID', 'PREPARING', 'READY_FOR_QC'].includes(o.status)).slice(0, 10);
  const ready = orders.filter((o: any) => o.status === 'READY_FOR_PICKUP').slice(0, 10);

  // Sound chime when a new order becomes ready
  useEffect(() => {
    const lastReady = ready[0];
    if (lastReady) {
       // Logic to play sound could go here
    }
  }, [ready]);

  return (
    <div className="h-full flex flex-col bg-[#1a1715] text-white overflow-hidden p-10 font-sans">
       {/* Header */}
       <div className="flex justify-between items-center mb-12">
          <div className="flex items-center gap-6">
             <div className="w-20 h-20 rounded-3xl bg-amber-500 flex items-center justify-center shadow-2xl shadow-amber-500/20">
                <Coffee size={48} className="text-[#2d241e]" />
             </div>
             <div>
                <h1 className="text-5xl font-black italic tracking-tighter uppercase">{branch?.name || '456 Coffee'}</h1>
                <p className="text-xl font-bold text-amber-500/60 uppercase tracking-widest mt-1">Order Status Monitor</p>
             </div>
          </div>
          <div className="text-right">
             <div className="text-6xl font-black text-white/10 italic">#456Cafe</div>
          </div>
       </div>

       {/* Main Display Grid */}
       <div className="flex-1 grid grid-cols-2 gap-12 overflow-hidden">
          
          {/* Column: Preparing */}
          <div className="flex flex-col h-full">
             <div className="flex items-center gap-4 mb-8">
                <Clock className="text-gray-500" size={32} />
                <h2 className="text-3xl font-black uppercase tracking-widest text-gray-500">Preparing</h2>
             </div>
             <div className="flex-1 bg-white/5 rounded-[3rem] p-8 border border-white/5 overflow-hidden">
                <div className="grid grid-cols-2 gap-6">
                   <AnimatePresence>
                      {preparing.map((order: any) => (
                        <motion.div 
                          key={order.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.8 }}
                          className="bg-white/5 rounded-2xl p-6 flex flex-col items-center justify-center border border-white/5"
                        >
                           <span className="text-5xl font-black text-white/40">#{order.queueNo || '---'}</span>
                           <span className="text-xs font-bold text-gray-500 mt-2 uppercase">{order.customerName || 'Customer'}</span>
                        </motion.div>
                      ))}
                   </AnimatePresence>
                </div>
                {preparing.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center opacity-10">
                      <Clock size={80} />
                      <p className="mt-4 font-black">WAITING FOR ORDERS</p>
                   </div>
                )}
             </div>
          </div>

          {/* Column: Ready for Pickup */}
          <div className="flex flex-col h-full">
             <div className="flex items-center gap-4 mb-8">
                <BellRing className="text-emerald-400 animate-pulse" size={32} />
                <h2 className="text-3xl font-black uppercase tracking-widest text-emerald-400">Ready to Pickup</h2>
             </div>
             <div className="flex-1 bg-emerald-500/10 rounded-[3rem] p-10 border border-emerald-500/20 overflow-hidden">
                <div className="flex flex-col gap-6">
                   <AnimatePresence>
                      {ready.map((order: any) => (
                        <motion.div 
                          key={order.id}
                          layoutId={order.id}
                          initial={{ x: 100, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          className="bg-emerald-500 text-[#1a1715] rounded-3xl p-8 flex items-center justify-between shadow-2xl shadow-emerald-500/20 border-4 border-emerald-400"
                        >
                           <div className="flex items-center gap-8">
                              <span className="text-8xl font-black italic tracking-tighter">#{order.queueNo || '---'}</span>
                              <div>
                                 <p className="text-2xl font-black uppercase tracking-tight leading-none">{order.customerName || 'Valued Customer'}</p>
                                 <p className="text-sm font-bold opacity-60 mt-2">Pick up at the counter</p>
                              </div>
                           </div>
                           <CheckCircle2 size={64} className="opacity-40" />
                        </motion.div>
                      ))}
                   </AnimatePresence>
                </div>
                {ready.length === 0 && (
                   <div className="h-full flex flex-col items-center justify-center opacity-10">
                      <BellRing size={80} />
                      <p className="mt-4 font-black">NO READY ORDERS</p>
                   </div>
                )}
             </div>
          </div>

       </div>

       {/* Footer */}
       <div className="mt-12 h-16 border-t border-white/5 flex items-center justify-between opacity-40">
          <p className="font-bold uppercase tracking-[0.3em] text-xs">Fresh Coffee • Premium Experience • Since 2024</p>
          <div className="flex gap-8 font-black text-xs uppercase tracking-widest">
             <span>Wifi: 456Coffee_Guest</span>
             <span>Pass: coffee1234</span>
          </div>
       </div>
    </div>
  );
}
