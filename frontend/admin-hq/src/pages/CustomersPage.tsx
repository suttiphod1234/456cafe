import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users, Search, Plus, Edit2, Trash2, X, Check, Loader2, 
  Gift, ShoppingBag, History, Mail, Phone, MessageCircle,
  ArrowUpRight, ArrowDownRight, ChevronRight, Filter, AlertTriangle
} from 'lucide-react';

const API = 'http://localhost:5001/api';
const C = { 50:'#fdf8f0',100:'#f5ebe0',200:'#e8d5c0',300:'#d4b896',400:'#b8956a',500:'#9c7a50',600:'#7a5c3a',700:'#5c4428',800:'#3d2d1a',900:'#1e160d' };

interface AuthProvider { id:string; provider:string; providerId:string; createdAt:string; }
interface User { 
  id:string; name:string|null; email:string|null; phone:string|null; 
  points:number; role:string; authProviders:AuthProvider[];
  createdAt:string; _count:{orders:number};
  orders?: any[];
}

function ProviderIcon({ provider }: { provider: string }) {
  if (provider === 'LINE') return <MessageCircle size={14} className="text-[#00b900]" />;
  if (provider === 'PHONE') return <Phone size={14} className="text-blue-600" />;
  if (provider === 'GOOGLE') return <Mail size={14} className="text-rose-500" />;
  return null;
}

export default function CustomersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPointsModal, setShowPointsModal] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchUsers = useCallback(async () => {
    setIsRefreshing(true);
    try {
      const res = await fetch(`${API}/users?search=${search}`);
      const data = await res.json();
      setUsers(data);
    } catch (e) {
      console.error('Fetch users error:', e);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  }, [search]);

  useEffect(() => {
    const timer = setTimeout(fetchUsers, 300);
    return () => clearTimeout(timer);
  }, [fetchUsers]);

  const handleAdjustPoints = async (delta: number, reason: string) => {
    if (!selectedUser) return;
    try {
      const res = await fetch(`${API}/users/${selectedUser.id}/points`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ delta, reason })
      });
      if (res.ok) {
        const updated = await res.json();
        setUsers(prev => prev.map(u => u.id === updated.id ? { ...u, points: updated.points } : u));
        setSelectedUser(prev => prev ? { ...prev, points: updated.points } : null);
        setShowPointsModal(false);
      }
    } catch (e) {
      alert('ไม่สามารถอัปเดตแต้มได้');
    }
  };

  const fetchUserDetails = async (user: User) => {
     try {
        const res = await fetch(`${API}/users/${user.id}`);
        const data = await res.json();
        setSelectedUser(data);
     } catch (e) {
        console.error('Fetch user detail error:', e);
     }
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-10 py-6 bg-white border-b border-[#e8d5c0]">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: C[100] }}>
              <Users size={24} style={{ color: C[600] }} />
            </div>
            <div>
              <h1 className="text-2xl font-black" style={{ color: C[800] }}>จัดการลูกค้า</h1>
              <p className="text-sm" style={{ color: C[500] }}>ดูแลสมาชิก {users.length} ราย และระบบสะสมแต้ม Reward</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <button onClick={fetchUsers} disabled={isRefreshing} className="p-2.5 rounded-xl border border-[#e8d5c0] hover:bg-gray-50 transition-all">
                <Loader2 size={18} className={isRefreshing ? 'animate-spin' : ''} style={{ color: C[500] }} />
             </button>
             <button className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md active:scale-95 transition-all" style={{ background: C[400] }}>
                <Plus size={18}/> เพิ่มลูกค้าใหม่
             </button>
          </div>
        </div>

        <div className="flex items-center gap-4">
           <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2" size={18} style={{ color: C[400] }} />
              <input 
                type="text" 
                placeholder="ค้นหาชื่อ, เบอร์โทร, หรืออีเมล..." 
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="w-full bg-[#fdf8f0] border border-[#e8d5c0] rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8956a]/20 transition-all font-medium"
              />
           </div>
           <button className="flex items-center gap-2 px-4 py-3 rounded-xl border border-[#e8d5c0] bg-white text-sm font-bold" style={{ color: C[600] }}>
              <Filter size={16}/> กรองข้อมูล
           </button>
        </div>
      </div>

      {/* Main Table */}
      <div className="flex-1 overflow-x-auto p-10 no-scrollbar">
         {loading ? (
            <div className="flex flex-col items-center justify-center py-24 gap-4">
               <Loader2 size={40} className="animate-spin" style={{ color: C[400] }} />
               <p className="text-sm font-bold" style={{ color: C[500] }}>กำลังโหลดข้อมูลลูกค้า...</p>
            </div>
         ) : (
            <div className="bg-white border border-[#e8d5c0] rounded-[2rem] shadow-sm overflow-hidden min-w-[800px]">
               <table className="w-full text-left">
                  <thead style={{ background: C[50] }}>
                    <tr className="text-[10px] uppercase font-bold tracking-widest" style={{ color: C[500] }}>
                       <th className="px-8 py-5">ลูกค้า / สมาชิก</th>
                       <th className="px-6 py-5">เบอร์โทรศัพท์</th>
                       <th className="px-6 py-5 text-center">แต้มสะสม</th>
                       <th className="px-6 py-5 text-center">ออเดอร์</th>
                       <th className="px-6 py-5">ช่องทาง</th>
                       <th className="px-8 py-5 text-right">แอคชั่น</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f5ebe0]">
                     {users.map(user => (
                        <tr key={user.id} className="hover:bg-[#fdf8f0]/50 transition-colors group">
                           <td className="px-8 py-5">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold uppercase" style={{ background: C[100], color: C[600] }}>
                                    {user.name?.[0] || 'C'}
                                 </div>
                                 <div className="min-w-0">
                                    <p className="font-bold text-sm truncate" style={{ color: C[800] }}>{user.name || 'ลูกค้าทั่วไป'}</p>
                                    <p className="text-[10px]" style={{ color: C[500] }}>เข้าร่วม: {new Date(user.createdAt).toLocaleDateString('th-TH')}</p>
                                 </div>
                              </div>
                           </td>
                           <td className="px-6 py-5">
                              <span className="text-sm font-medium" style={{ color: C[700] }}>{user.phone || '-'}</span>
                           </td>
                           <td className="px-6 py-5 text-center">
                              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-50 text-amber-700 border border-amber-100">
                                 <Gift size={12}/> {user.points.toLocaleString()}
                              </div>
                           </td>
                           <td className="px-6 py-5 text-center">
                              <span className="text-sm font-bold" style={{ color: C[500] }}>{user._count.orders} ครั้ง</span>
                           </td>
                           <td className="px-6 py-5">
                              <div className="flex gap-1.5">
                                 {user.authProviders.map(p => (
                                    <div key={p.id} className="w-6 h-6 rounded-md bg-gray-50 flex items-center justify-center border border-gray-100" title={p.provider}>
                                       <ProviderIcon provider={p.provider} />
                                    </div>
                                 ))}
                              </div>
                           </td>
                           <td className="px-8 py-5 text-right">
                              <button onClick={() => fetchUserDetails(user)} className="p-2.5 rounded-xl hover:bg-white hover:shadow-md hover:border-[#e8d5c0] border border-transparent transition-all" style={{ color: C[400] }}>
                                 <ChevronRight size={18}/>
                              </button>
                           </td>
                        </tr>
                     ))}
                  </tbody>
               </table>
            </div>
         )}
      </div>

      {/* User Detail Side Panel */}
      <AnimatePresence>
         {selectedUser && (
            <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} className="fixed inset-0 z-[60] flex justify-end">
               <div className="absolute inset-0 bg-black/20 backdrop-blur-[2px]" onClick={() => setSelectedUser(null)} />
               <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} transition={{ type:'spring', damping:30, stiffness:300 }}
                 className="relative w-full max-w-md bg-white h-full shadow-2xl flex flex-col border-l border-[#e8d5c0]">
                  {/* Panel Header */}
                  <div className="p-8 pb-6 border-b border-[#f5ebe0]">
                     <div className="flex justify-between items-start mb-6">
                        <div className="w-16 h-16 rounded-[2rem] flex items-center justify-center text-xl font-black uppercase shadow-inner" style={{ background: C[100], color: C[600] }}>
                           {selectedUser.name?.[0] || 'C'}
                        </div>
                        <button onClick={() => setSelectedUser(null)} className="p-2 rounded-full hover:bg-gray-100 transition-colors"><X size={20}/></button>
                     </div>
                     <h2 className="text-2xl font-black" style={{ color: C[800] }}>{selectedUser.name || 'ลูกค้าทั่วไป'}</h2>
                     <p className="text-sm font-medium" style={{ color: C[500] }}>ID: {selectedUser.id}</p>
                     
                     <div className="flex gap-2 mt-4">
                        <button onClick={() => setShowPointsModal(true)} className="flex-1 flex items-center justify-center gap-2 bg-[#b8956a] text-white py-3 rounded-2xl font-bold shadow-lg shadow-[#b8956a]/20">
                           <Gift size={16}/> จัดการแต้ม
                        </button>
                        <button className="p-3 rounded-2xl border border-[#e8d5c0] hover:bg-gray-50 flex items-center justify-center transition-all"><Edit2 size={16}/></button>
                     </div>
                  </div>

                  {/* Panel Content */}
                  <div className="flex-1 overflow-y-auto no-scrollbar p-8 space-y-8">
                     {/* Summary Stats */}
                     <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#fdf8f0] p-4 rounded-2xl border border-[#e8d5c0]">
                           <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: C[500] }}>ยอดซื้อสะสม</p>
                           <p className="text-xl font-black" style={{ color: C[800] }}>฿{selectedUser.orders?.reduce((s:number,o:any)=>s+o.totalAmount,0).toLocaleString()}</p>
                        </div>
                        <div className="bg-[#fdf8f0] p-4 rounded-2xl border border-[#e8d5c0]">
                           <p className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: C[500] }}>แต้มปัจจุบัน</p>
                           <p className="text-xl font-black text-amber-600">{selectedUser.points.toLocaleString()} pts</p>
                        </div>
                     </div>

                     {/* Order History */}
                     <div>
                        <div className="flex items-center justify-between mb-4">
                           <h3 className="font-bold text-sm tracking-tight flex items-center gap-2" style={{ color: C[800] }}>
                              <History size={16} style={{ color: C[400] }} /> ประวัติออเดอร์ล่าสุด
                           </h3>
                        </div>
                        <div className="space-y-3">
                           {selectedUser.orders?.map((order: any) => (
                              <div key={order.id} className="p-4 rounded-2xl border border-[#f5ebe0] hover:border-[#b8956a]/40 transition-all cursor-pointer group">
                                 <div className="flex justify-between items-start mb-1">
                                    <p className="font-bold text-xs" style={{ color: C[700] }}>#{order.orderNo}</p>
                                    <span className="text-[10px] font-black text-[#b8956a]">฿{order.totalAmount}</span>
                                 </div>
                                 <div className="flex justify-between items-center">
                                    <p className="text-[10px]" style={{ color: C[500] }}>{order.branch?.name || 'ไม่ระบุสาขา'}</p>
                                    <p className="text-[9px]" style={{ color: C[400] }}>{new Date(order.createdAt).toLocaleDateString('th-TH')}</p>
                                 </div>
                              </div>
                           ))}
                           {(!selectedUser.orders || selectedUser.orders.length === 0) && (
                              <p className="text-center py-6 text-xs text-gray-400">ไม่พบประวัติการสั่งซื้อ</p>
                           )}
                        </div>
                     </div>

                     <div className="pt-8 opacity-50 text-[10px] text-center" style={{ color: C[500] }}>
                        ระงับการใช้งานบัญชี • ลบข้อมูลสมาชิก
                     </div>
                  </div>
               </motion.div>
            </motion.div>
         )}
      </AnimatePresence>

      {/* Points Adjustment Modal */}
      <AnimatePresence>
         {showPointsModal && selectedUser && (
            <PointsModal 
               user={selectedUser} 
               onClose={() => setShowPointsModal(false)}
               onSave={handleAdjustPoints}
            />
         )}
      </AnimatePresence>
    </div>
  );
}

function PointsModal({ user, onClose, onSave }: any) {
   const [delta, setDelta] = useState<number>(0);
   const [reason, setReason] = useState('');
   const [isSubmitting, setIsSubmitting] = useState(false);

   const handleSubmit = async (e: React.FormEvent) => {
      e.preventDefault();
      if (delta === 0) return;
      setIsSubmitting(true);
      await onSave(delta, reason);
      setIsSubmitting(false);
   };

   return (
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-6">
         <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
         <motion.div initial={{ scale: 0.92, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl">
            <div className="p-8 bg-[#fdf8f0] border-b border-[#e8d5c0]">
               <h3 className="text-xl font-black mb-1" style={{ color: C[800] }}>เพิ่ม / ลด แต้ม</h3>
               <p className="text-sm" style={{ color: C[500] }}>ลูกค้า: {user.name || 'ลูกค้าทั่วไป'}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="p-8 space-y-6">
               <div className="flex flex-col items-center">
                  <div className="flex items-center gap-4 mb-6">
                     <button type="button" onClick={() => setDelta(prev => prev - 10)} className="w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all hover:bg-rose-50 hover:text-rose-600 bg-gray-50 text-gray-400 border border-gray-100"><Minus size={20}/></button>
                     <div className="w-24 text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: C[500] }}>จำนวน</p>
                        <input type="number" value={delta} onChange={e => setDelta(parseInt(e.target.value) || 0)} className="text-4xl font-black w-full text-center focus:outline-none bg-transparent" />
                     </div>
                     <button type="button" onClick={() => setDelta(prev => prev + 10)} className="w-12 h-12 rounded-2xl flex items-center justify-center font-black transition-all hover:bg-emerald-50 hover:text-emerald-600 bg-gray-50 text-gray-400 border border-gray-100"><Plus size={20}/></button>
                  </div>
                  
                  <div className="w-full flex justify-between bg-white rounded-xl p-1 border border-[#e8d5c0]">
                     <button type="button" onClick={() => setDelta(10)} className="flex-1 py-1.5 text-[10px] font-bold hover:bg-gray-50 rounded-lg">+10</button>
                     <button type="button" onClick={() => setDelta(50)} className="flex-1 py-1.5 text-[10px] font-bold hover:bg-gray-50 rounded-lg group border-x border-[#f5ebe0]">🎁 +50</button>
                     <button type="button" onClick={() => setDelta(100)} className="flex-1 py-1.5 text-[10px] font-bold hover:bg-gray-50 rounded-lg">+100</button>
                  </div>
               </div>

               <div className="space-y-1.5">
                  <label className="text-[10px] font-bold uppercase tracking-widest block ml-1" style={{ color: C[500] }}>เหตุผล (เพื่อบันทึก Audit Log)</label>
                  <input value={reason} onChange={e => setReason(e.target.value)} placeholder="เช่น ชดเชยการบริการ, โปรโมชั่น..." className="w-full bg-white border border-[#e8d5c0] rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8956a]/20" />
               </div>

               <div className="flex gap-3 pt-4">
                  <button type="button" onClick={onClose} className="flex-1 py-3 rounded-2xl text-sm font-bold bg-[#f5ebe0] text-[#7a5c3a]">ยกเลิก</button>
                  <button type="submit" disabled={isSubmitting || delta === 0} className="flex-1 py-3 rounded-2xl text-white text-sm font-bold shadow-lg shadow-[#b8956a]/20 bg-[#b8956a] disabled:opacity-50 flex items-center justify-center gap-2">
                     {isSubmitting ? <Loader2 size={16} className="animate-spin"/> : 'ยืนยัน'}
                  </button>
               </div>
            </form>
         </motion.div>
      </motion.div>
   );
}

function Minus({ size, className }: any) { return <span className={className}>-</span>; }
