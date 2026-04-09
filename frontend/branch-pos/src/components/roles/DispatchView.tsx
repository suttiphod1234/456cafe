import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Truck, User, Phone, CheckCircle2, ChevronRight, Package, Search, ExternalLink, Calendar } from 'lucide-react';

export default function DispatchView({ orders, updateStatus }: any) {
  const readyOrders = orders.filter((o: any) => o.status === 'READY_FOR_PICKUP');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [riderInfo, setRiderInfo] = useState({ name: '', phone: '' });

  return (
    <div className="h-full flex flex-col bg-[#fdfaf6]">
       <div className="h-20 bg-white border-b border-orange-100 flex items-center justify-between px-8 shadow-sm">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center">
               <Truck size={24} className="text-orange-500" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-widest text-slate-800">Dispactcher / Logistics</h1>
         </div>
         <div className="flex items-center gap-6">
            <div className="text-right">
               <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Awaiting Rider</p>
               <p className="text-xl font-black text-orange-600">{readyOrders.length}</p>
            </div>
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden p-8 gap-8">
         {/* Queue List */}
         <div className="w-1/3 flex flex-col gap-4">
            <div className="relative">
               <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
               <input 
                  type="text" 
                  placeholder="ค้นหา Order ID / ชื่อ Rider..."
                  className="w-full pl-12 pr-4 py-4 bg-white rounded-2xl border border-orange-100 text-sm focus:ring-2 focus:ring-orange-500/20"
               />
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-3 no-scrollbar">
               {readyOrders.map((order: any) => (
                 <motion.button 
                   key={order.id}
                   whileHover={{ scale: 1.02 }}
                   whileTap={{ scale: 0.98 }}
                   onClick={() => {
                     setSelectedOrder(order);
                     setRiderInfo({ name: order.riderName || '', phone: order.riderPhone || '' });
                   }}
                   className={`w-full p-6 rounded-3xl border text-left transition-all ${selectedOrder?.id === order.id ? 'bg-orange-500 text-white border-orange-500 shadow-xl shadow-orange-500/30' : 'bg-white border-gray-100 text-slate-800 hover:border-orange-200'}`}
                 >
                    <div className="flex justify-between items-start mb-2">
                       <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${selectedOrder?.id === order.id ? 'bg-white/20' : order.platform === 'GRAB' ? 'bg-grab text-white' : 'bg-gray-100 text-gray-400'}`}>
                          {order.platform}
                       </span>
                       <span className={`text-[10px] font-bold ${selectedOrder?.id === order.id ? 'text-white/60' : 'text-gray-400'}`}>#{order.orderNo.slice(-4)}</span>
                    </div>
                    <h4 className="text-lg font-black italic truncate">{order.customerName || 'Delivery Order'}</h4>
                    <p className={`text-[10px] font-bold mt-1 ${selectedOrder?.id === order.id ? 'text-white/60' : 'text-gray-400'}`}>
                       {order.items?.length} items • Ready {Math.floor((Date.now() - new Date(order.updatedAt).getTime())/60000)}m ago
                    </p>
                 </motion.button>
               ))}
               {readyOrders.length === 0 && (
                  <div className="py-20 flex flex-col items-center justify-center opacity-10">
                     <Package size={64} />
                     <p className="mt-4 font-black uppercase tracking-widest text-xs">No Pending Pickup</p>
                  </div>
               )}
            </div>
         </div>

         {/* Dispatch Panel */}
         <div className="flex-1">
            <AnimatePresence mode="wait">
               {selectedOrder ? (
                  <motion.div 
                     key={selectedOrder.id}
                     initial={{ opacity: 0, y: 20 }}
                     animate={{ opacity: 1, y: 0 }}
                     exit={{ opacity: 0, y: -20 }}
                     className="bg-white h-full rounded-[2.5rem] shadow-2xl border border-orange-100 flex flex-col overflow-hidden"
                  >
                     <div className="p-8 bg-orange-50/50 border-b border-orange-100">
                        <div className="flex justify-between items-start">
                           <div>
                              <h2 className="text-3xl font-black italic text-slate-800">{selectedOrder.customerName || 'Delivery'}</h2>
                              <p className="text-sm font-bold text-orange-600">HANDOVER TO RIDER</p>
                           </div>
                           <button onClick={()=>setSelectedOrder(null)} className="p-2 hover:bg-orange-100 rounded-full transition-colors">
                              <ExternalLink size={20} className="text-orange-500" />
                           </button>
                        </div>
                     </div>

                     <div className="flex-1 p-8 space-y-10 overflow-y-auto">
                        {/* Summary */}
                        <div className="grid grid-cols-2 gap-4">
                           <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                              <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Order Items</p>
                              <div className="space-y-1">
                                 {selectedOrder.items?.map((item:any, idx:number)=>(
                                    <p key={idx} className="text-sm font-bold text-slate-700">x{item.quantity} {item.productName}</p>
                                 ))}
                              </div>
                           </div>
                           <div className="p-6 rounded-3xl bg-gray-50 border border-gray-100">
                              <p className="text-[10px] font-black text-gray-400 uppercase mb-2">Status History</p>
                              <div className="flex items-center gap-2 text-sm font-bold text-emerald-600">
                                 <CheckCircle2 size={16} /> QC PASSED
                              </div>
                              <p className="text-[10px] font-bold text-gray-400 mt-1">Checked by Branch Supervisor</p>
                           </div>
                        </div>

                        {/* Rider Form */}
                        <div className="space-y-6">
                           <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest">Rider Information</h3>
                           <div className="grid grid-cols-2 gap-6">
                              <div>
                                 <label className="text-[10px] font-black text-gray-500 ml-2">RIDER NAME</label>
                                 <div className="mt-1 relative">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300" size={18} />
                                    <input 
                                       type="text" 
                                       placeholder="เช่น G-1234 (Somsak)"
                                       value={riderInfo.name}
                                       onChange={e => setRiderInfo({...riderInfo, name: e.target.value})}
                                       className="w-full pl-12 pr-4 py-4 bg-orange-50/30 rounded-2xl border-2 border-transparent focus:border-orange-500/20 focus:ring-0 font-bold"
                                    />
                                 </div>
                              </div>
                              <div>
                                 <label className="text-[10px] font-black text-gray-500 ml-2">PHONE NUMBER</label>
                                 <div className="mt-1 relative">
                                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-orange-300" size={18} />
                                    <input 
                                       type="text" 
                                       placeholder="08X-XXX-XXXX"
                                       value={riderInfo.phone}
                                       onChange={e => setRiderInfo({...riderInfo, phone: e.target.value})}
                                       className="w-full pl-12 pr-4 py-4 bg-orange-50/30 rounded-2xl border-2 border-transparent focus:border-orange-500/20 focus:ring-0 font-bold"
                                    />
                                 </div>
                              </div>
                           </div>
                        </div>

                        {/* Timeline / Policy */}
                        <div className="p-6 rounded-3xl border-2 border-dashed border-gray-100">
                           <p className="text-xs font-bold text-gray-400 italic">"Dispatcher must verify the Rider App matching order # before handover"</p>
                        </div>
                     </div>

                     <div className="p-8 pt-0">
                        <button 
                           onClick={() => {
                              updateStatus(selectedOrder.id, 'DISPATCHED', { riderName: riderInfo.name, riderPhone: riderInfo.phone });
                              setSelectedOrder(null);
                           }}
                           className="w-full py-5 rounded-[2rem] bg-orange-600 text-white font-black uppercase tracking-[0.2em] shadow-xl shadow-orange-900/20 hover:scale-[1.02] transition-all"
                        >
                           Confirm Handover
                        </button>
                     </div>
                  </motion.div>
               ) : (
                  <div className="h-full flex flex-col items-center justify-center text-gray-200">
                     <Truck size={100} strokeWidth={1} />
                     <p className="mt-6 font-black uppercase tracking-[0.3em] text-xs">Awaiting Logistics Execution</p>
                  </div>
               )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
