import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, Plus, Edit2, Trash2, MapPin, ShoppingBag, Package,
  X, Check, Loader2, AlertTriangle, Users, Clock, ToggleLeft,
  ToggleRight, BarChart3, ChevronRight, Coffee, TrendingUp,
  Phone, Mail, Shield, UserPlus, Crown, User, Navigation,
  CalendarClock, DollarSign, AlertCircle
} from 'lucide-react';

const API = 'http://localhost:5001/api';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Manager {
  id: string;
  branchId: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  lineUid: string | null;
  createdAt: string;
}

interface Branch {
  id: string;
  name: string;
  location: string | null;
  address: string | null;
  latitude: number | null;
  longitude: number | null;
  isOpen: boolean;
  openTime: string | null;
  closeTime: string | null;
  managers: Manager[];
  createdAt: string;
  _count: { orders: number; inventory: number };
}

interface DashboardData {
  totalOrders: number;
  todayOrders: number;
  totalRevenue: number;
  todayRevenue: number;
  recentOrders: any[];
  topProducts: { name: string; totalSold: number }[];
}

// ─── Helpers ──────────────────────────────────────────────────────────────────

const ROLE_CONFIG: Record<string, { label: string; icon: typeof Crown; color: string }> = {
  OWNER:          { label: 'เจ้าของร้าน',       icon: Crown,  color: 'text-amber-400 bg-amber-500/10 border-amber-500/20' },
  BRANCH_MANAGER: { label: 'ผู้จัดการสาขา',    icon: Shield, color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
  STAFF:          { label: 'พนักงาน',           icon: User,   color: 'text-gray-400 bg-white/5 border-white/10' },
};

function RoleBadge({ role }: { role: string }) {
  const cfg = ROLE_CONFIG[role] || ROLE_CONFIG['STAFF'];
  const Icon = cfg.icon;
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${cfg.color}`}>
      <Icon size={9} /> {cfg.label}
    </span>
  );
}

// ─── Toast ────────────────────────────────────────────────────────────────────

function Toast({ msg, type }: { msg: string; type: 'success' | 'error' }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 20, scale: 0.95 }}
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl text-sm font-bold shadow-2xl flex items-center gap-3 z-[100] ${
        type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
      }`}>
      {type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}{msg}
    </motion.div>
  );
}

// ─── Branch Form Modal ────────────────────────────────────────────────────────

function BranchFormModal({ branch, onClose, onSave }: {
  branch?: Branch | null; onClose: () => void; onSave: (data: any) => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: branch?.name || '',
    location: branch?.location || '',
    address: branch?.address || '',
    latitude: branch?.latitude?.toString() || '',
    longitude: branch?.longitude?.toString() || '',
    openTime: branch?.openTime || '08:00',
    closeTime: branch?.closeTime || '22:00',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const up = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('กรุณากรอกชื่อสาขา'); return; }
    setIsSaving(true); setError('');
    try {
      await onSave({
        ...form,
        latitude: form.latitude ? parseFloat(form.latitude) : null,
        longitude: form.longitude ? parseFloat(form.longitude) : null,
      });
      onClose();
    } catch { setError('เกิดข้อผิดพลาด กรุณาลองใหม่'); }
    finally { setIsSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }} transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-lg bg-[#131a2e] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-500/15 flex items-center justify-center">
              <Store size={20} className="text-indigo-400" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{branch ? 'แก้ไขสาขา' : 'เพิ่มสาขาใหม่'}</h2>
              <p className="text-xs text-gray-500">{branch ? `แก้ไข "${branch.name}"` : 'กรอกรายละเอียดสาขา'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Store size={11} /> ชื่อสาขา *</label>
            <input value={form.name} onChange={e => up('name', e.target.value)} placeholder="เช่น 456 Coffee - เซ็นทรัลลาดพร้าว"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 placeholder:text-gray-600 transition-all" />
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><MapPin size={11} /> ที่อยู่</label>
            <textarea value={form.address} onChange={e => up('address', e.target.value)} rows={2}
              placeholder="เช่น ชั้น G เซ็นทรัลลาดพร้าว ถ.พหลโยธิน แขวงลาดยาว ก.กรุงเทพฯ 10900"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 placeholder:text-gray-600 transition-all resize-none" />
          </div>

          {/* Location (Google Maps link) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Navigation size={11} /> Google Maps Link</label>
            <input value={form.location} onChange={e => up('location', e.target.value)} placeholder="https://maps.google.com/..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 placeholder:text-gray-600 transition-all" />
          </div>

          {/* Latitude / Longitude */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">ละติจูด</label>
              <input type="number" step="any" value={form.latitude} onChange={e => up('latitude', e.target.value)} placeholder="13.7563"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 placeholder:text-gray-600 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">ลองจิจูด</label>
              <input type="number" step="any" value={form.longitude} onChange={e => up('longitude', e.target.value)} placeholder="100.5018"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 placeholder:text-gray-600 transition-all" />
            </div>
          </div>

          {/* Hours */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={11} /> เวลาเปิด</label>
              <input type="time" value={form.openTime} onChange={e => up('openTime', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5"><Clock size={11} /> เวลาปิด</label>
              <input type="time" value={form.closeTime} onChange={e => up('closeTime', e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 transition-all" />
            </div>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3">
                <AlertTriangle size={14} />{error}
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-sm font-bold transition-all">ยกเลิก</button>
            <motion.button type="submit" disabled={isSaving} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 disabled:opacity-50 transition-all">
              {isSaving ? <><Loader2 size={16} className="animate-spin" />กำลังบันทึก...</> : <><Check size={16} />บันทึก</>}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Manager Form Modal ───────────────────────────────────────────────────────

function ManagerModal({ branchId, manager, onClose, onSave }: {
  branchId: string; manager?: Manager | null; onClose: () => void; onSave: () => void;
}) {
  const [form, setForm] = useState({ name: manager?.name || '', email: manager?.email || '', phone: manager?.phone || '', role: manager?.role || 'BRANCH_MANAGER', lineUid: manager?.lineUid || '' });
  const [isSaving, setIsSaving] = useState(false);
  const up = (k: string, v: string) => setForm(p => ({ ...p, [k]: v }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setIsSaving(true);
    try {
      if (manager) {
        await fetch(`${API}/branches/managers/${manager.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      } else {
        await fetch(`${API}/branches/${branchId}/managers`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      }
      onSave();
      onClose();
    } finally { setIsSaving(false); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="relative w-full max-w-md bg-[#131a2e] border border-white/10 rounded-3xl shadow-2xl overflow-hidden">
        <div className="p-6 pb-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-violet-500/15 flex items-center justify-center"><Users size={20} className="text-violet-400" /></div>
            <div>
              <h2 className="font-bold text-lg">{manager ? 'แก้ไขผู้ดูแล' : 'เพิ่มผู้ดูแลสาขา'}</h2>
              <p className="text-xs text-gray-500">กำหนดสิทธิ์และข้อมูลผู้ดูแล</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all"><X size={16} /></button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">ชื่อ-นามสกุล *</label>
            <input value={form.name} onChange={e => up('name', e.target.value)} placeholder="เช่น สมชาย รักกาแฟ"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 placeholder:text-gray-600 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1"><Mail size={10} /> อีเมล</label>
              <input value={form.email} onChange={e => up('email', e.target.value)} placeholder="example@mail.com" type="email"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 placeholder:text-gray-600 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1"><Phone size={10} /> โทรศัพท์</label>
              <input value={form.phone} onChange={e => up('phone', e.target.value)} placeholder="08x-xxx-xxxx"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/40 placeholder:text-gray-600 transition-all" />
            </div>
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1"><Shield size={10} /> สิทธิ์ (Role)</label>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(ROLE_CONFIG).map(([key, cfg]) => {
                const Icon = cfg.icon;
                return (
                  <button key={key} type="button" onClick={() => up('role', key)}
                    className={`flex flex-col items-center gap-1.5 p-3 rounded-2xl border text-xs font-bold transition-all ${form.role === key ? cfg.color : 'bg-white/5 border-white/10 text-gray-500 hover:text-white'}`}>
                    <Icon size={16} />{cfg.label}
                  </button>
                );
              })}
            </div>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-sm font-bold transition-all">ยกเลิก</button>
            <motion.button type="submit" disabled={isSaving || !form.name.trim()} whileTap={{ scale: 0.98 }}
              className="flex-1 py-3 rounded-2xl bg-violet-600 hover:bg-violet-500 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
              {isSaving ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}บันทึก
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Delete Branch Modal ──────────────────────────────────────────────────────

function DeleteBranchModal({ branch, onClose, onConfirm }: { branch: Branch; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.92 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
        className="relative bg-[#131a2e] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 flex items-center justify-center shrink-0"><Trash2 size={22} className="text-rose-400" /></div>
          <div><h3 className="font-bold text-lg">ยืนยันลบสาขา</h3><p className="text-sm text-gray-500">การดำเนินการนี้ไม่สามารถย้อนกลับได้</p></div>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 mb-5 border border-white/5">
          <p className="font-bold text-sm">{branch.name}</p>
          <div className="flex gap-4 mt-2 text-xs text-gray-600">
            <span className="flex items-center gap-1"><ShoppingBag size={11} /> {branch._count.orders} ออเดอร์</span>
            <span className="flex items-center gap-1"><Users size={11} /> {branch.managers.length} ผู้ดูแล</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-sm font-bold transition-all">ยกเลิก</button>
          <motion.button whileTap={{ scale: 0.97 }} disabled={isDeleting}
            onClick={async () => { setIsDeleting(true); await onConfirm(); setIsDeleting(false); }}
            className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}ลบสาขา
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Branch Detail (4 Tabs) ───────────────────────────────────────────────────

function BranchDetail({ branch, onRefresh, showToast }: {
  branch: Branch; onRefresh: () => void; showToast: (m: string, t?: 'success' | 'error') => void;
}) {
  const [tab, setTab] = useState<'info' | 'managers' | 'dashboard' | 'orders'>('info');
  const [dashboard, setDashboard] = useState<DashboardData | null>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [isLoadingDash, setIsLoadingDash] = useState(false);
  const [isLoadingOrders, setIsLoadingOrders] = useState(false);
  const [managerModal, setManagerModal] = useState<{ open: boolean; manager?: Manager | null }>({ open: false });

  useEffect(() => {
    if (tab === 'dashboard' && !dashboard) {
      setIsLoadingDash(true);
      fetch(`${API}/branches/${branch.id}/dashboard`)
        .then(r => r.json()).then(d => setDashboard(d)).finally(() => setIsLoadingDash(false));
    }
    if (tab === 'orders' && orders.length === 0) {
      setIsLoadingOrders(true);
      fetch(`${API}/branches/${branch.id}/orders`)
        .then(r => r.json()).then(d => setOrders(d)).finally(() => setIsLoadingOrders(false));
    }
  }, [tab, branch.id]);

  const deleteManager = async (mgr: Manager) => {
    const res = await fetch(`${API}/branches/managers/${mgr.id}`, { method: 'DELETE' });
    if (res.ok) { showToast(`ลบ ${mgr.name} สำเร็จ`); onRefresh(); }
    else showToast('ลบไม่สำเร็จ', 'error');
  };

  const STATUS_CONFIG: Record<string, { label: string; color: string }> = {
    PENDING:    { label: 'รอดำเนินการ', color: 'text-amber-400 bg-amber-500/10' },
    PREPARING:  { label: 'กำลังทำ',    color: 'text-blue-400 bg-blue-500/10' },
    READY:      { label: 'พร้อมส่ง',   color: 'text-emerald-400 bg-emerald-500/10' },
    PICKED_UP:  { label: 'รับแล้ว',    color: 'text-gray-400 bg-white/5' },
    CANCELLED:  { label: 'ยกเลิก',     color: 'text-rose-400 bg-rose-500/10' },
  };

  const TABS = [
    { id: 'info',      label: 'ข้อมูลทั่วไป', icon: MapPin },
    { id: 'managers',  label: 'ผู้ดูแล',       icon: Users },
    { id: 'dashboard', label: 'สถิติ',          icon: BarChart3 },
    { id: 'orders',    label: 'ออเดอร์',        icon: ShoppingBag },
  ] as const;

  return (
    <div className="flex flex-col h-full">
      {/* Detail Header */}
      <div className="px-8 pt-8 pb-4 border-b border-white/5 shrink-0">
        <div className="flex items-center gap-3 mb-4">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${branch.isOpen ? 'bg-emerald-500/15' : 'bg-gray-500/10'}`}>
            <Store size={22} className={branch.isOpen ? 'text-emerald-400' : 'text-gray-500'} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-lg truncate">{branch.name}</h3>
              <span className={`px-2 py-0.5 rounded-lg text-[10px] font-bold border ${branch.isOpen ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' : 'text-gray-500 bg-white/5 border-white/10'}`}>
                {branch.isOpen ? '🟢 เปิด' : '🔴 ปิด'}
              </span>
            </div>
            {branch.openTime && <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1"><Clock size={10} /> {branch.openTime} - {branch.closeTime}</p>}
          </div>
          <div className="flex gap-2 shrink-0">
            <span className="text-xs text-gray-500"><span className="text-white font-bold">{branch._count.orders}</span> ออเดอร์</span>
            <span className="text-gray-600">·</span>
            <span className="text-xs text-gray-500"><span className="text-white font-bold">{branch.managers.length}</span> ผู้ดูแล</span>
          </div>
        </div>
        {/* Tabs */}
        <div className="flex gap-1">
          {TABS.map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setTab(t.id)}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all ${tab === t.id ? 'bg-white/10 text-white' : 'text-gray-500 hover:text-gray-300 hover:bg-white/5'}`}>
                <Icon size={13} />{t.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <AnimatePresence mode="wait">
          {/* ── Tab: Info ── */}
          {tab === 'info' && (
            <motion.div key="info" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="p-8 space-y-6">
              {/* Address */}
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><MapPin size={10} /> ที่อยู่</p>
                <p className="text-sm text-gray-300 leading-relaxed">{branch.address || <span className="text-gray-600 italic">ยังไม่ได้ระบุที่อยู่</span>}</p>
              </div>

              {/* Coordinates */}
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Navigation size={10} /> พิกัด GPS</p>
                {branch.latitude && branch.longitude ? (
                  <div className="space-y-2">
                    <div className="flex gap-3">
                      <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5">
                        <p className="text-[9px] text-gray-600 uppercase tracking-wider">Latitude</p>
                        <p className="text-sm font-mono">{branch.latitude}</p>
                      </div>
                      <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2.5">
                        <p className="text-[9px] text-gray-600 uppercase tracking-wider">Longitude</p>
                        <p className="text-sm font-mono">{branch.longitude}</p>
                      </div>
                    </div>
                    {/* Google Maps Embed */}
                    <div className="rounded-2xl overflow-hidden border border-white/10 h-52">
                      <iframe
                        title="branch-map"
                        width="100%" height="100%"
                        loading="lazy"
                        style={{ border: 0 }}
                        src={`https://maps.google.com/maps?q=${branch.latitude},${branch.longitude}&z=16&output=embed`}
                      />
                    </div>
                    {branch.location && (
                      <a href={branch.location} target="_blank" rel="noopener noreferrer"
                        className="flex items-center gap-2 text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
                        <Navigation size={12} /> เปิดใน Google Maps
                      </a>
                    )}
                  </div>
                ) : (
                  <div className="bg-white/[0.03] border border-white/5 rounded-2xl p-6 text-center">
                    <Navigation size={24} className="text-gray-700 mx-auto mb-2" />
                    <p className="text-sm text-gray-500">ยังไม่ได้บันทึกพิกัด</p>
                    <p className="text-xs text-gray-600 mt-1">กด "แก้ไขสาขา" เพื่อเพิ่มละติจูด-ลองจิจูด</p>
                  </div>
                )}
              </div>

              {/* Hours */}
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2 flex items-center gap-1.5"><Clock size={10} /> เวลาเปิด-ปิด</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-emerald-500/5 border border-emerald-500/10 rounded-2xl px-4 py-3">
                    <p className="text-[9px] text-emerald-600 uppercase tracking-wider mb-1">เปิด</p>
                    <p className="text-lg font-bold text-emerald-400">{branch.openTime || '--:--'}</p>
                  </div>
                  <div className="bg-rose-500/5 border border-rose-500/10 rounded-2xl px-4 py-3">
                    <p className="text-[9px] text-rose-600 uppercase tracking-wider mb-1">ปิด</p>
                    <p className="text-lg font-bold text-rose-400">{branch.closeTime || '--:--'}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* ── Tab: Managers ── */}
          {tab === 'managers' && (
            <motion.div key="managers" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="p-8">
              <div className="flex items-center justify-between mb-5">
                <p className="text-sm font-bold">{branch.managers.length} ผู้ดูแลสาขา</p>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
                  onClick={() => setManagerModal({ open: true, manager: null })}
                  className="flex items-center gap-2 px-4 py-2 bg-violet-600 rounded-xl text-xs font-bold text-white shadow-lg shadow-violet-600/20">
                  <UserPlus size={14} /> เพิ่มผู้ดูแล
                </motion.button>
              </div>

              <div className="space-y-3">
                <AnimatePresence>
                  {branch.managers.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-12 text-center">
                      <Users size={28} className="text-gray-700 mb-3" />
                      <p className="text-sm text-gray-500">ยังไม่มีผู้ดูแล</p>
                      <p className="text-xs text-gray-600 mt-1">กด "เพิ่มผู้ดูแล" เพื่อกำหนดผู้รับผิดชอบ</p>
                    </div>
                  ) : branch.managers.map(mgr => (
                    <motion.div key={mgr.id} layout initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                      className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3 group">
                      <div className="w-10 h-10 rounded-xl bg-violet-500/10 flex items-center justify-center shrink-0 text-sm font-bold text-violet-400">
                        {mgr.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="font-bold text-sm truncate">{mgr.name}</p>
                          <RoleBadge role={mgr.role} />
                        </div>
                        <div className="flex gap-3 text-xs text-gray-500">
                          {mgr.email && <span className="flex items-center gap-1"><Mail size={10} />{mgr.email}</span>}
                          {mgr.phone && <span className="flex items-center gap-1"><Phone size={10} />{mgr.phone}</span>}
                        </div>
                      </div>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => setManagerModal({ open: true, manager: mgr })}
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-indigo-500/20 flex items-center justify-center text-gray-500 hover:text-indigo-400 transition-all">
                          <Edit2 size={12} />
                        </button>
                        <button onClick={() => deleteManager(mgr)}
                          className="w-7 h-7 rounded-lg bg-white/5 hover:bg-rose-500/20 flex items-center justify-center text-gray-500 hover:text-rose-400 transition-all">
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
          )}

          {/* ── Tab: Dashboard ── */}
          {tab === 'dashboard' && (
            <motion.div key="dashboard" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="p-8">
              {isLoadingDash ? (
                <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-indigo-400" /></div>
              ) : dashboard ? (
                <div className="space-y-6">
                  {/* Stat Cards */}
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { label: 'ยอดขายวันนี้', value: `฿${dashboard.todayRevenue.toLocaleString()}`, sub: `รวม ฿${dashboard.totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'text-emerald-400 bg-emerald-500/10' },
                      { label: 'ออเดอร์วันนี้', value: dashboard.todayOrders.toString(), sub: `รวม ${dashboard.totalOrders} ออเดอร์`, icon: ShoppingBag, color: 'text-blue-400 bg-blue-500/10' },
                    ].map(s => {
                      const Icon = s.icon;
                      return (
                        <div key={s.label} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4">
                          <div className={`w-8 h-8 rounded-xl flex items-center justify-center mb-3 ${s.color}`}>
                            <Icon size={16} />
                          </div>
                          <p className="text-2xl font-black">{s.value}</p>
                          <p className="text-[10px] text-gray-500 mt-0.5">{s.label}</p>
                          <p className="text-[9px] text-gray-600 mt-1">{s.sub}</p>
                        </div>
                      );
                    })}
                  </div>

                  {/* Top Products */}
                  {dashboard.topProducts.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><TrendingUp size={10} /> เมนูขายดี</p>
                      <div className="space-y-2">
                        {dashboard.topProducts.map((p, i) => (
                          <div key={p.productId || i} className="flex items-center gap-3">
                            <span className="text-[10px] font-bold w-5 text-center text-gray-600">{i + 1}</span>
                            <div className="flex-1 bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2 flex items-center justify-between">
                              <span className="text-sm font-bold">{p.name}</span>
                              <span className="text-xs text-indigo-400 font-bold">{p.totalSold} แก้ว</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Recent Orders Preview */}
                  {dashboard.recentOrders.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-3 flex items-center gap-1.5"><CalendarClock size={10} /> ออเดอร์ล่าสุด</p>
                      <div className="space-y-2">
                        {dashboard.recentOrders.slice(0, 3).map((o: any) => (
                          <div key={o.id} className="flex items-center justify-between bg-white/[0.03] border border-white/5 rounded-xl px-3 py-2">
                            <div className="flex items-center gap-2">
                              <span className="text-xs font-mono text-gray-500">#{o.id.substring(0, 6)}</span>
                              <span className="text-xs text-gray-400">{o.items?.length || 0} รายการ</span>
                            </div>
                            <span className="text-xs font-bold text-amber-400">฿{o.totalAmount}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center py-12"><AlertCircle size={28} className="text-gray-700 mb-3" /><p className="text-sm text-gray-500">ไม่สามารถโหลดข้อมูลได้</p></div>
              )}
            </motion.div>
          )}

          {/* ── Tab: Orders ── */}
          {tab === 'orders' && (
            <motion.div key="orders" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -10 }}
              className="p-8">
              {isLoadingOrders ? (
                <div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin text-indigo-400" /></div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12">
                  <ShoppingBag size={28} className="text-gray-700 mb-3" />
                  <p className="text-sm text-gray-500">ยังไม่มีออเดอร์</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {orders.map((o: any) => (
                    <div key={o.id} className="bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="text-xs font-mono text-gray-400">#{o.id.substring(0, 8)}</span>
                          <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold ${STATUS_CONFIG[o.status]?.color || 'text-gray-400 bg-white/5'}`}>
                            {STATUS_CONFIG[o.status]?.label || o.status}
                          </span>
                        </div>
                        <span className="text-sm font-bold text-amber-400">฿{o.totalAmount}</span>
                      </div>
                      <div className="flex gap-1 flex-wrap">
                        {o.items?.map((item: any) => (
                          <span key={item.id} className="text-[10px] text-gray-500 bg-white/5 px-2 py-0.5 rounded-lg">
                            {item.product?.name} ×{item.quantity}
                          </span>
                        ))}
                      </div>
                      <p className="text-[9px] text-gray-600 mt-2">{new Date(o.createdAt).toLocaleString('th-TH')}</p>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Manager Modal */}
      <AnimatePresence>
        {managerModal.open && (
          <ManagerModal
            branchId={branch.id}
            manager={managerModal.manager}
            onClose={() => setManagerModal({ open: false })}
            onSave={onRefresh}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBranches = useCallback(async () => {
    try {
      const res = await fetch(`${API}/branches`);
      const data = await res.json();
      setBranches(data);
      if (data.length > 0 && !selectedId) setSelectedId(data[0].id);
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  }, [selectedId]);

  useEffect(() => { fetchBranches(); }, []);

  const selectedBranch = branches.find(b => b.id === selectedId) || null;

  const handleSave = async (data: any) => {
    if (modal === 'edit' && selectedBranch) {
      const res = await fetch(`${API}/branches/${selectedBranch.id}`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setBranches(prev => prev.map(b => b.id === updated.id ? updated : b));
      showToast(`อัปเดต "${updated.name}" สำเร็จ`);
    } else {
      const res = await fetch(`${API}/branches`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setBranches(prev => [created, ...prev]);
      setSelectedId(created.id);
      showToast(`เพิ่มสาขา "${created.name}" สำเร็จ`);
    }
  };

  const handleDelete = async () => {
    if (!selectedBranch) return;
    const res = await fetch(`${API}/branches/${selectedBranch.id}`, { method: 'DELETE' });
    if (!res.ok) { showToast('ลบไม่สำเร็จ', 'error'); return; }
    const remaining = branches.filter(b => b.id !== selectedBranch.id);
    setBranches(remaining);
    setSelectedId(remaining[0]?.id || null);
    showToast(`ลบ "${selectedBranch.name}" สำเร็จ`);
    setModal(null);
  };

  const handleToggleOpen = async (branch: Branch) => {
    const res = await fetch(`${API}/branches/${branch.id}/toggle-open`, { method: 'PATCH' });
    if (res.ok) {
      const updated = await res.json();
      setBranches(prev => prev.map(b => b.id === updated.id ? updated : b));
      showToast(`${updated.name} ${updated.isOpen ? 'เปิดแล้ว 🟢' : 'ปิดแล้ว 🔴'}`);
    }
  };

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* ── Left Sidebar: Branch List ── */}
      <div className="w-72 shrink-0 border-r border-white/5 flex flex-col overflow-hidden">
        {/* Sidebar Header */}
        <div className="px-6 pt-8 pb-4 shrink-0">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold flex items-center gap-2"><Store size={16} className="text-indigo-400" /> สาขาทั้งหมด</h2>
            <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
              onClick={() => setModal('add')}
              className="w-8 h-8 bg-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-600/20">
              <Plus size={16} />
            </motion.button>
          </div>
          <p className="text-xs text-gray-500">{branches.length} สาขา · {branches.filter(b => b.isOpen).length} เปิดอยู่</p>
        </div>

        {/* Branch List */}
        <div className="flex-1 overflow-y-auto px-4 pb-6 no-scrollbar space-y-2">
          {isLoading ? (
            <div className="flex justify-center pt-8"><Loader2 size={24} className="animate-spin text-indigo-400" /></div>
          ) : branches.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <Store size={24} className="text-gray-700 mb-2" />
              <p className="text-xs text-gray-500">ยังไม่มีสาขา</p>
            </div>
          ) : branches.map(branch => (
            <motion.div key={branch.id} layout
              onClick={() => setSelectedId(branch.id)}
              className={`rounded-2xl px-4 py-3 cursor-pointer border transition-all ${selectedId === branch.id ? 'bg-indigo-500/10 border-indigo-500/30' : 'bg-white/[0.02] border-white/5 hover:bg-white/5 hover:border-white/10'}`}
            >
              <div className="flex items-center gap-2 mb-1.5">
                <span className={`w-2 h-2 rounded-full shrink-0 ${branch.isOpen ? 'bg-emerald-400' : 'bg-gray-600'}`} />
                <p className="font-bold text-sm truncate flex-1">{branch.name}</p>
              </div>
              <div className="flex items-center gap-2 ml-4">
                {branch.openTime && (
                  <span className="text-[10px] text-gray-600 flex items-center gap-1"><Clock size={9} />{branch.openTime}-{branch.closeTime}</span>
                )}
                <span className="text-[10px] text-gray-600 flex items-center gap-1 ml-auto"><Users size={9} />{branch.managers.length}</span>
              </div>
              {/* Quick Actions */}
              {selectedId === branch.id && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="flex gap-1.5 mt-3 pt-2 border-t border-white/5">
                  <button onClick={e => { e.stopPropagation(); setModal('edit'); }}
                    className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl bg-white/5 hover:bg-indigo-500/20 text-[10px] font-bold text-gray-400 hover:text-indigo-400 transition-all">
                    <Edit2 size={10} /> แก้ไข
                  </button>
                  <button onClick={e => { e.stopPropagation(); handleToggleOpen(branch); }}
                    className={`flex-1 flex items-center justify-center gap-1 py-1.5 rounded-xl text-[10px] font-bold transition-all ${branch.isOpen ? 'bg-rose-500/10 text-rose-400 hover:bg-rose-500/20' : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20'}`}>
                    {branch.isOpen ? <><ToggleRight size={10} />ปิด</> : <><ToggleLeft size={10} />เปิด</>}
                  </button>
                  <button onClick={e => { e.stopPropagation(); setModal('delete'); }}
                    className="w-8 flex items-center justify-center rounded-xl bg-white/5 hover:bg-rose-500/20 text-gray-500 hover:text-rose-400 transition-all">
                    <Trash2 size={10} />
                  </button>
                </motion.div>
              )}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Right Panel: Branch Detail ── */}
      <div className="flex-1 overflow-hidden">
        {selectedBranch ? (
          <BranchDetail
            key={selectedBranch.id}
            branch={selectedBranch}
            onRefresh={fetchBranches}
            showToast={showToast}
          />
        ) : (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <Coffee size={40} className="text-gray-700 mb-4" />
            <p className="text-gray-400 font-bold">เลือกสาขาเพื่อดูรายละเอียด</p>
            <p className="text-xs text-gray-600 mt-2">หรือกด "+" เพื่อเพิ่มสาขาใหม่</p>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {(modal === 'add' || modal === 'edit') && (
          <BranchFormModal
            branch={modal === 'edit' ? selectedBranch : null}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />
        )}
        {modal === 'delete' && selectedBranch && (
          <DeleteBranchModal
            branch={selectedBranch}
            onClose={() => setModal(null)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && <Toast msg={toast.msg} type={toast.type} />}
      </AnimatePresence>
    </div>
  );
}
