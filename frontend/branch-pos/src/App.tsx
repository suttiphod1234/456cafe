import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle2, Play, Package, AlertTriangle, Coffee, MoreVertical } from 'lucide-react';
import { io } from 'socket.io-client';

const mockOrders: any[] = [];

export default function App() {
  const [orders, setOrders] = useState<any[]>(mockOrders);
  const [lowStockAlerts, setLowStockAlerts] = useState<any[]>([]);

  useEffect(() => {
    // 1. Connect to backend
    const newSocket = io('http://localhost:5001');

    // 2. Join specific branch room
    newSocket.on('connect', () => {
      newSocket.emit('join-branch', 'branch-1');
    });

    // 3. Listen to incoming events
    newSocket.on('new-order', (order) => {
      const formattedItems = order.items.map((i: any) => ({
        name: i.product.name,
        customization: i.customization,
      }));
      
      const newOrder = {
        id: order.id.substring(0, 5),
        customer: 'Customer ' + order.customerUid.substring(0, 4),
        items: formattedItems,
        status: order.status,
        time: 'Just now',
        rawId: order.id,
      };
      
      setOrders(prev => [...prev, newOrder]);
    });

    newSocket.on('update-order', (order) => {
      setOrders(prev => prev.map(o => o.rawId === order.id ? { ...o, status: order.status } : o));
    });

    newSocket.on('inventory-alert', (alerts) => {
      setLowStockAlerts(alerts);
    });

    newSocket.on('inventory-error', (error) => {
      alert(`[สต็อกไม่พอ!] ออเดอร์ #${error.orderId.substring(0,5)}: ${error.message}`);
    });

    return () => {
      newSocket.close();
    };
  }, []);

  const columns = [
    { id: 'PENDING', title: 'รอรับออเดอร์', icon: <Clock size={20} className="text-amber-500" />, color: 'border-amber-500/50' },
    { id: 'PREPARING', title: 'กำลังทำ', icon: <Play size={20} className="text-blue-500" />, color: 'border-blue-500/50' },
    { id: 'READY', title: 'พร้อมเสิร์ฟ', icon: <CheckCircle2 size={20} className="text-emerald-500" />, color: 'border-emerald-500/50' },
    { id: 'PICKED_UP', title: 'รับสินค้าแล้ว', icon: <Package size={20} className="text-indigo-500" />, color: 'border-indigo-500/50' },
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
            <h1 className="text-lg font-bold">ระบบจัดการสาขา (POS & Kanban)</h1>
            <p className="text-xs text-gray-400">สาขาหลัก - จุดเตรียมที่ 1</p>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <AnimatePresence>
            {lowStockAlerts.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="flex items-center gap-2 bg-rose-500/10 text-rose-500 px-3 py-1.5 rounded-lg text-xs font-bold border border-rose-500/20"
              >
                <AlertTriangle size={14} /> วัตถุดิบใกล้หมด: {lowStockAlerts.map(a => a.ingredient).join(', ')}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="text-right">
            <p className="text-sm font-medium">8 เมษายน 2026</p>
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
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">ออเดอร์ #{order.id}</span>
                        <h4 className="font-bold text-lg">{order.customer}</h4>
                      </div>
                      <div className="text-xs text-gray-500 flex items-center gap-1.5 px-2 py-1 glass-morphism rounded-lg">
                        <Clock size={12} /> {order.time}
                      </div>
                    </div>
                    
                    <div className="space-y-3 mb-6">
                      {order.items.map((item: any, idx: number) => (
                        <div key={idx} className="flex flex-col gap-1">
                          <div className="flex items-center gap-2 text-sm font-bold text-white">
                            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                            {item.name}
                          </div>
                          {item.customization && (
                            <div className="flex flex-wrap gap-1.5 ml-3.5">
                              {Object.entries(item.customization).map(([key, value]: [string, any]) => (
                                <span key={key} className="text-[10px] bg-white/5 px-2 py-0.5 rounded-md text-gray-400 border border-white/5">
                                  {key}: {value}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button className="flex-1 py-2 text-xs font-bold rounded-xl glass-morphism hover:bg-white/10 transition-all">
                        รายละเอียด
                      </button>
                      <button 
                        className="flex-1 py-2 text-xs font-bold rounded-xl bg-white text-black hover:bg-gray-200 transition-all"
                        onClick={async () => {
                          const nextStatusIndex = columns.findIndex(c => c.id === order.status) + 1;
                          if (nextStatusIndex < columns.length) {
                            const newStatus = columns[nextStatusIndex].id;
                            // Optimistic update
                            setOrders(orders.map(o => o.id === order.id ? { ...o, status: newStatus } : o));
                            
                            // Send to backend
                            if (order.rawId) {
                               try {
                                  await fetch(`http://localhost:5001/api/orders/${order.rawId}/status`, {
                                    method: 'PATCH',
                                    headers: { 'Content-Type': 'application/json' },
                                    body: JSON.stringify({ status: newStatus })
                                  });
                               } catch (e) {
                                  console.error("Failed to update status", e);
                               }
                            }
                          }
                        }}
                      >
                        {column.id === 'READY' ? 'ส่งมอบสินค้า' : 'ขั้นตอนถัดไป'}
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
