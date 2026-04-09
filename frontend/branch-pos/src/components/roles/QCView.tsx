import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ShieldCheck, CheckCircle2, ChevronRight, X, User, Package, Terminal } from 'lucide-react';

export default function QCView({ orders, updateStatus }: any) {
  const qcOrders = orders.filter((o: any) => o.status === 'READY_FOR_QC');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [checklist, setChecklist] = useState({
    menuCorrect: false,
    lidSecured: false,
    stickerApplied: false
  });

  const isComplete = checklist.menuCorrect && checklist.lidSecured && checklist.stickerApplied;

  return (
    <div className="h-full flex flex-col bg-[#f0f4f8]">
       <div className="h-20 bg-white border-b border-blue-100 flex items-center justify-between px-8 shadow-sm">
         <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center">
               <ShieldCheck size={24} className="text-blue-500" />
            </div>
            <h1 className="text-xl font-black uppercase tracking-widest text-slate-800">Quality Control (QC)</h1>
         </div>
         <div className="px-4 py-2 bg-blue-500 text-white rounded-2xl text-xs font-black">
            {qcOrders.length} PENDING INSPECTION
         </div>
      </div>

      <div className="flex-1 flex overflow-hidden p-8 gap-8">
         {/* Order List */}
         <div className="w-1/3 bg-white rounded-[2rem] shadow-sm overflow-y-auto no-scrollbar border border-gray-100 p-4 space-y-3">
            {qcOrders.map((order: any) => (
              <button 
                key={order.id}
                onClick={() => {
                  setSelectedOrder(order);
                  setChecklist({ menuCorrect: false, lidSecured: false, stickerApplied: false });
                }}
                className={`w-full p-6 rounded-2xl flex items-center justify-between transition-all ${selectedOrder?.id === order.id ? 'bg-blue-50 ring-2 ring-blue-500/20' : 'hover:bg-gray-50'}`}
              >
                 <div className="text-left">
                    <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest">#{order.orderNo.slice(-4)}</span>
                    <h4 className="font-black text-lg text-slate-800 italic">{order.customerName || 'Customer'}</h4>
                    <p className="text-[10px] font-bold text-gray-400">{order.items?.length} items • {order.platform}</p>
                 </div>
                 <ChevronRight className={selectedOrder?.id === order.id ? 'text-blue-500' : 'text-gray-300'} size={20} />
              </button>
            ))}
            {qcOrders.length === 0 && (
              <div className="h-full flex flex-col items-center justify-center opacity-20">
                 <CheckCircle2 size={48} />
                 <p className="mt-4 text-xs font-black uppercase tracking-widest">All Clear</p>
              </div>
            )}
         </div>

         {/* Inspection Panel */}
         <div className="flex-1">
            <AnimatePresence mode="wait">
              {selectedOrder ? (
                 <motion.div 
                    key={selectedOrder.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    className="h-full bg-white rounded-[2rem] shadow-xl border border-blue-100 flex flex-col overflow-hidden"
                 >
                    <div className="p-8 border-b border-gray-50">
                       <h2 className="text-2xl font-black italic mb-1 text-slate-800">Inspection: {selectedOrder.customerName || 'Customer'}</h2>
                       <p className="text-sm font-bold text-gray-400">Order ID: {selectedOrder.orderNo}</p>
                    </div>

                    <div className="flex-1 p-8 overflow-y-auto space-y-8">
                       {/* Menu List */}
                       <div className="space-y-3">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">Verify Menu Items</label>
                          {selectedOrder.items?.map((item: any, idx: number) => (
                             <div key={idx} className="flex gap-4 items-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center font-black text-slate-400">x{item.quantity}</div>
                                <div>
                                   <p className="font-black text-slate-800">{item.productName}</p>
                                   <p className="text-[10px] font-bold text-gray-400">{item.selectedOptions?.map((o:any)=>o.label).join(', ')}</p>
                                </div>
                             </div>
                          ))}
                       </div>

                       {/* Checklist */}
                       <div className="space-y-3 pt-6 border-t border-gray-100">
                          <label className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 block">QC Checklist</label>
                          {[
                            { id: 'menuCorrect', label: 'Item & Quantity is Correct', sub: 'ตรวจสอบรายการและจำนวนตาม Ticket' },
                            { id: 'lidSecured', label: 'Lids & Packing Secured', sub: 'ปิดฝาแน่นสนิท ไม่มีการหกเลอะเทอะ' },
                            { id: 'stickerApplied', label: 'Labels & Stickers Applied', sub: 'ติดสติกเกอร์ชื่อลูกค้าและเมนูเรียบร้อย' }
                          ].map(item => (
                            <button 
                              key={item.id}
                              onClick={() => setChecklist(prev => ({...prev, [item.id]: !prev[item.id as keyof typeof prev]}))}
                              className={`w-full p-6 rounded-3xl border-2 flex items-center gap-6 transition-all text-left ${checklist[item.id as keyof typeof checklist] ? 'bg-emerald-50 border-emerald-500/40 text-emerald-900' : 'bg-white border-gray-100 text-gray-400 hover:border-blue-200'}`}
                            >
                               <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-all ${checklist[item.id as keyof typeof checklist] ? 'bg-emerald-500 border-emerald-500 text-white' : 'border-gray-200'}`}>
                                  {checklist[item.id as keyof typeof checklist] && <CheckCircle2 size={16} />}
                               </div>
                               <div>
                                  <p className="font-black text-sm uppercase tracking-wider">{item.label}</p>
                                  <p className="text-[10px] opacity-60 font-bold">{item.sub}</p>
                                </div>
                            </button>
                          ))}
                       </div>
                    </div>

                    <div className="p-8 bg-gray-50/50 border-t border-gray-100">
                       <button 
                         disabled={!isComplete}
                         onClick={() => {
                            updateStatus(selectedOrder.id, 'READY_FOR_PICKUP');
                            setSelectedOrder(null);
                         }}
                         className={`w-full py-5 rounded-[1.5rem] font-black uppercase tracking-[0.2em] text-sm shadow-xl transition-all ${isComplete ? 'bg-emerald-500 text-white shadow-emerald-500/30' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
                       >
                          Pass QC & Move to Dispatch
                       </button>
                    </div>
                 </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-gray-300">
                   <Package size={80} strokeWidth={1} />
                   <p className="mt-4 font-black text-xs uppercase tracking-widest">Select an order to begin QC</p>
                </div>
              )}
            </AnimatePresence>
         </div>
      </div>
    </div>
  );
}
