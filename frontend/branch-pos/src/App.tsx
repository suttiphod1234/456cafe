import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, Store, CheckSquare, Truck, LogOut, 
  User, Settings, ChevronRight, Bell, HelpCircle
} from 'lucide-react';
import { io, Socket } from 'socket.io-client';

// Role Components
import POSView from './components/roles/POSView';
import BaristaView from './components/roles/BaristaView';
import QCView from './components/roles/QCView';
import DispatchView from './components/roles/DispatchView';
import QueueMonitorView from './components/roles/QueueMonitorView';

const API_BASE = 'http://localhost:5001/api';
const SOCKET_URL = 'http://localhost:5001';

type Role = 'SELECTOR' | 'CASHIER' | 'BARISTA' | 'QC' | 'DISPATCHER' | 'QUEUE_MONITOR';

export default function App() {
  const [selectedBranchId, setSelectedBranchId] = useState<string | null>(null);
  const [activeRole, setActiveRole] = useState<Role>('SELECTOR');
  const [branches, setBranches] = useState<any[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);

  // 1. Fetch Branches
  useEffect(() => {
    fetch(`${API_BASE}/branches`)
      .then(res => res.json())
      .then(data => setBranches(data))
      .catch(err => console.error("Fetch branches failed", err));
  }, []);

  // 2. Socket Connection
  useEffect(() => {
    if (!selectedBranchId) return;

    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      newSocket.emit('join-branch', selectedBranchId);
      refreshOrders();
    });

    newSocket.on('new-order', (order) => {
      setOrders(prev => [order, ...prev]);
    });

    newSocket.on('update-order', (order) => {
      setOrders(prev => prev.map(o => o.id === order.id ? { ...o, ...order } : o));
    });

    return () => { newSocket.disconnect(); };
  }, [selectedBranchId]);

  const refreshOrders = () => {
    if (!selectedBranchId) return;
    fetch(`${API_BASE}/branches/${selectedBranchId}/orders`)
      .then(res => res.json())
      .then(data => setOrders(data));
  };

  const updateStatus = async (orderId: string, status: string, metadata?: any) => {
    try {
      const res = await fetch(`${API_BASE}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, metadata })
      });
      if (!res.ok) throw new Error("Update failed");
    } catch (err) {
      console.error(err);
    }
  };

  const createExternalOrder = async (data: any) => {
    try {
      // Mock some products for external entry
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: selectedBranchId,
          platform: data.platform,
          customerName: data.customerName,
          note: data.note,
          totalAmount: 150, // Mock
          items: [{ productId: 'p-latte', quantity: 1, price: 150 }], // Mock
          paymentMethod: 'CASH',
        })
      });
      if (res.ok) refreshOrders();
    } catch (err) {
      console.error(err);
    }
  };

  // --- View: Branch Selector ---
  if (!selectedBranchId) {
    return (
      <div className="min-h-screen bg-[#fdfaf6] flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full bg-white rounded-[2.5rem] shadow-2xl p-10 border border-[#e8e2db]">
          <div className="text-center mb-10">
             <div className="w-16 h-16 rounded-2xl bg-[#7c543c]/10 flex items-center justify-center mx-auto mb-4">
                <Store size={32} className="text-[#7c543c]" />
             </div>
             <h1 className="text-2xl font-black text-[#2d241e]">Branch Management</h1>
             <p className="text-sm text-gray-400 font-bold mt-1">Select your station to begin</p>
          </div>
          <div className="space-y-4">
            {branches.map(b => (
              <button 
                key={b.id} 
                onClick={() => setSelectedBranchId(b.id)}
                className="w-full p-6 text-left rounded-3xl bg-gray-50 hover:bg-[#7c543c] hover:text-white transition-all group flex items-center justify-between"
              >
                <div className="flex flex-col text-left">
                  <h3 className="font-black text-lg text-slate-800">{b.name}</h3>
                  <p className="text-xs text-slate-400 font-bold">{b.location}</p>
                </div>
                <ChevronRight size={20} className="opacity-20 group-hover:opacity-100" />
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // --- View: Role Selector ---
  if (activeRole === 'SELECTOR') {
     const currentBranch = branches.find(b => b.id === selectedBranchId);
     const roles = [
       { id: 'CASHIER', label: 'Cashier / POS', desc: 'Menu & Order Entry', icon: <Store />, color: 'bg-emerald-500' },
       { id: 'BARISTA', label: 'Barista (KDS)', desc: 'Production Monitor', icon: <Coffee />, color: 'bg-amber-500' },
       { id: 'QC', label: 'Inspector (QC)', desc: 'Quality Verification', icon: <CheckSquare />, color: 'bg-blue-500' },
       { id: 'DISPATCHER', label: 'Dispatcher', desc: 'Handover & Pickup', icon: <Truck />, color: 'bg-orange-500' },
       { id: 'QUEUE_MONITOR', label: 'Queue Board', desc: 'Customer Monitor', icon: <Bell />, color: 'bg-rose-500' },
     ];

     return (
       <div className="min-h-screen bg-[#fdfaf6] flex flex-col items-center justify-center p-8 font-sans">
          <div className="w-full max-w-5xl">
             <div className="flex items-center justify-between mb-12">
                <div>
                   <h2 className="text-4xl font-black text-[#2d241e] italic uppercase tracking-tighter">Station: {currentBranch?.name}</h2>
                   <p className="text-gray-400 font-bold mt-1">Please select your primary role for this session</p>
                </div>
                <button 
                  onClick={() => setSelectedBranchId(null)}
                  className="p-4 rounded-full bg-white border border-gray-100 shadow-sm hover:bg-rose-50 text-rose-500 transition-all font-black"
                >
                   <LogOut size={24} />
                </button>
             </div>

             <div className="grid grid-cols-4 gap-8">
                {roles.map((r: any) => (
                  <motion.button
                    key={r.id}
                    whileHover={{ y: -10 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setActiveRole(r.id)}
                    className="bg-white p-8 rounded-[3rem] shadow-xl shadow-gray-200/50 border border-gray-50 text-left group hover:ring-4 hover:ring-[#7c543c]/10"
                  >
                     <div className={`w-16 h-16 rounded-3xl ${r.color} text-white flex items-center justify-center mb-6 shadow-lg rotate-3 group-hover:rotate-0 transition-transform`}>
                        {r.icon}
                     </div>
                     <h3 className="text-xl font-black text-[#2d241e] mb-2">{r.label}</h3>
                     <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">{r.desc}</p>
                     <div className="mt-8 flex items-center gap-2 text-[#7c543c] font-black text-sm group-hover:gap-4 transition-all">
                        SELECT ROLE <ChevronRight size={16} />
                     </div>
                  </motion.button>
                ))}
             </div>

             <div className="mt-20 flex justify-center gap-12 opacity-30 grayscale pointer-events-none">
                <div className="flex items-center gap-2 font-black text-xs"><Bell size={14}/> ALERT SYSTEM ACTIVE</div>
                <div className="flex items-center gap-2 font-black text-xs"><Settings size={14}/> AUTO-SYNC ENABLED</div>
                <div className="flex items-center gap-2 font-black text-xs"><HelpCircle size={14}/> HELP CENTER</div>
             </div>
          </div>
       </div>
     );
  }

  // --- Main Role Views ---
  return (
    <div className="h-screen flex flex-col overflow-hidden font-sans">
       {/* Global Mini Header */}
       <div className="h-10 bg-[#2d241e] text-white flex items-center justify-between px-6 z-50">
          <div className="flex items-center gap-4">
             <span className="text-[10px] font-black uppercase tracking-widest opacity-60">{branches.find(b=>b.id===selectedBranchId)?.name}</span>
             <span className="w-1 h-3 bg-white/20 rounded-full"/>
             <span className="text-[10px] font-black uppercase tracking-widest text-amber-500">{activeRole} STATION</span>
          </div>
          <button 
            onClick={() => setActiveRole('SELECTOR')}
            className="text-[10px] font-black uppercase tracking-widest hover:text-rose-400 transition-colors flex items-center gap-2"
          >
             Switch Role <Settings size={10} />
          </button>
       </div>

       <div className="flex-1 overflow-hidden">
          {activeRole === 'CASHIER' && <POSView branch={branches.find(b=>b.id===selectedBranchId)} orders={orders} updateStatus={updateStatus} />}
          {activeRole === 'BARISTA' && <BaristaView orders={orders} updateStatus={updateStatus} />}
          {activeRole === 'QC' && <QCView orders={orders} updateStatus={updateStatus} />}
          {activeRole === 'DISPATCHER' && <DispatchView orders={orders} updateStatus={updateStatus} />}
          {activeRole === 'QUEUE_MONITOR' && <QueueMonitorView branch={branches.find(b=>b.id===selectedBranchId)} orders={orders} />}
       </div>
    </div>
  );
}
