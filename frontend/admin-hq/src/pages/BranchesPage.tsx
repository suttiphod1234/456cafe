import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Store, Plus, Edit2, Trash2, MapPin, ShoppingBag, Package,
  X, Check, Loader2, AlertTriangle, ChevronRight, Coffee
} from 'lucide-react';

interface Branch {
  id: string;
  name: string;
  location: string | null;
  createdAt: string;
  _count: {
    orders: number;
    inventory: number;
  };
}

interface BranchModalProps {
  branch?: Branch | null;
  onClose: () => void;
  onSave: (data: { name: string; location: string }) => Promise<void>;
}

function BranchModal({ branch, onClose, onSave }: BranchModalProps) {
  const [name, setName] = useState(branch?.name || '');
  const [location, setLocation] = useState(branch?.location || '');
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) { setError('กรุณากรอกชื่อสาขา'); return; }

    setIsSaving(true);
    setError('');
    try {
      await onSave({ name: name.trim(), location: location.trim() });
      onClose();
    } catch (err) {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
    >
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-md"
      >
        <div className="bg-[#131a2e] border border-white/10 rounded-3xl shadow-2xl shadow-black/50 overflow-hidden">
          {/* Header */}
          <div className="p-6 pb-0 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-indigo-500/20 flex items-center justify-center">
                <Store size={20} className="text-indigo-400" />
              </div>
              <div>
                <h2 className="text-lg font-bold">
                  {branch ? 'แก้ไขสาขา' : 'เพิ่มสาขาใหม่'}
                </h2>
                <p className="text-xs text-gray-500">
                  {branch ? `แก้ไขข้อมูลสาขา "${branch.name}"` : 'กรอกข้อมูลสาขาใหม่'}
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-xl bg-white/5 flex items-center justify-center text-gray-400 hover:text-white hover:bg-white/10 transition-all"
            >
              <X size={16} />
            </button>
          </div>

          {/* Divider */}
          <div className="mx-6 mt-4 border-t border-white/5" />

          {/* Form */}
          <form onSubmit={handleSubmit} className="p-6 space-y-4">
            {/* Branch Name */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                ชื่อสาขา *
              </label>
              <div className="relative">
                <Coffee size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-500" />
                <input
                  type="text"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  placeholder="เช่น 456 Coffee - เซ็นทรัลลาดพร้าว"
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder:text-gray-600 transition-all"
                />
              </div>
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                ที่ตั้ง / Location
              </label>
              <div className="relative">
                <MapPin size={16} className="absolute left-3.5 top-3.5 text-gray-500" />
                <textarea
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  placeholder="เช่น ชั้น G, เซ็นทรัลลาดพร้าว, กรุงเทพฯ&#10;หรือ Google Maps URL"
                  rows={3}
                  className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500/50 placeholder:text-gray-600 transition-all resize-none"
                />
              </div>
              <p className="text-[10px] text-gray-600">ใส่ที่อยู่หรือลิงก์ Google Maps ก็ได้</p>
            </div>

            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="flex items-center gap-2 text-rose-400 text-sm bg-rose-500/10 border border-rose-500/20 rounded-xl px-4 py-3"
                >
                  <AlertTriangle size={14} />
                  {error}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Actions */}
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-sm font-bold transition-all"
              >
                ยกเลิก
              </button>
              <motion.button
                type="submit"
                disabled={isSaving}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="flex-1 py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
              >
                {isSaving ? (
                  <><Loader2 size={16} className="animate-spin" /> กำลังบันทึก...</>
                ) : (
                  <><Check size={16} /> บันทึก</>
                )}
              </motion.button>
            </div>
          </form>
        </div>
      </motion.div>
    </motion.div>
  );
}

// Delete confirm modal
function DeleteModal({ branch, onClose, onConfirm }: { branch: Branch; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [isDeleting, setIsDeleting] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6"
    >
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92, y: 20 }}
        className="relative bg-[#131a2e] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl"
      >
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/20 flex items-center justify-center shrink-0">
            <Trash2 size={22} className="text-rose-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg">ยืนยันการลบสาขา</h3>
            <p className="text-sm text-gray-500">การดำเนินการนี้ไม่สามารถย้อนกลับได้</p>
          </div>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 mb-5 border border-white/5">
          <p className="font-bold text-sm">{branch.name}</p>
          {branch.location && <p className="text-xs text-gray-500 mt-1">{branch.location}</p>}
          <div className="flex gap-4 mt-3 text-xs text-gray-600">
            <span className="flex items-center gap-1.5"><ShoppingBag size={12} /> {branch._count.orders} ออเดอร์</span>
            <span className="flex items-center gap-1.5"><Package size={12} /> {branch._count.inventory} รายการสต็อก</span>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-sm font-bold transition-all">
            ยกเลิก
          </button>
          <motion.button
            whileTap={{ scale: 0.97 }}
            disabled={isDeleting}
            onClick={async () => { setIsDeleting(true); await onConfirm(); setIsDeleting(false); }}
            className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-2"
          >
            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            ลบสาขา
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function BranchesPage() {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingBranch, setEditingBranch] = useState<Branch | null | undefined>(undefined);
  const [deletingBranch, setDeletingBranch] = useState<Branch | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchBranches = async () => {
    try {
      const res = await fetch('http://localhost:5001/api/branches');
      const data = await res.json();
      setBranches(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => { fetchBranches(); }, []);

  const handleSave = async (data: { name: string; location: string }) => {
    if (editingBranch?.id) {
      // Update
      const res = await fetch(`http://localhost:5001/api/branches/${editingBranch.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Update failed');
      const updated = await res.json();
      setBranches(prev => prev.map(b => b.id === updated.id ? updated : b));
      showToast(`อัปเดตสาขา "${updated.name}" สำเร็จ`);
    } else {
      // Create
      const res = await fetch('http://localhost:5001/api/branches', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error('Create failed');
      const created = await res.json();
      setBranches(prev => [created, ...prev]);
      showToast(`เพิ่มสาขา "${created.name}" สำเร็จ`);
    }
  };

  const handleDelete = async () => {
    if (!deletingBranch) return;
    const res = await fetch(`http://localhost:5001/api/branches/${deletingBranch.id}`, { method: 'DELETE' });
    if (!res.ok) { showToast('ลบไม่สำเร็จ กรุณาลองใหม่', 'error'); return; }
    setBranches(prev => prev.filter(b => b.id !== deletingBranch.id));
    showToast(`ลบสาขา "${deletingBranch.name}" สำเร็จ`);
    setDeletingBranch(null);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="p-10 pb-0 flex items-center justify-between shrink-0">
        <div>
          <h2 className="text-2xl font-bold flex items-center gap-3">
            <Store size={24} className="text-indigo-400" />
            จัดการสาขา
          </h2>
          <p className="text-gray-500 text-sm mt-1">เพิ่ม แก้ไข และบันทึกข้อมูลสาขาทั้งหมดของคุณ</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(99,102,241,0.3)' }}
          whileTap={{ scale: 0.98 }}
          onClick={() => setEditingBranch(null)}
          className="flex items-center gap-2 px-5 py-3 bg-indigo-600 rounded-2xl text-sm font-bold shadow-lg shadow-indigo-600/20 transition-all"
        >
          <Plus size={18} />
          เพิ่มสาขาใหม่
        </motion.button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-10 pt-6 no-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={32} className="animate-spin text-indigo-400" />
          </div>
        ) : branches.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center h-64 text-center"
          >
            <div className="w-16 h-16 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
              <Store size={28} className="text-gray-600" />
            </div>
            <p className="font-bold text-gray-400">ยังไม่มีสาขา</p>
            <p className="text-sm text-gray-600 mt-1">กดปุ่ม "เพิ่มสาขาใหม่" เพื่อเริ่มต้น</p>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            <AnimatePresence mode="popLayout">
              {branches.map((branch, index) => (
                <motion.div
                  key={branch.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0, transition: { delay: index * 0.06 } }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="admin-card p-5 group hover:border-indigo-500/30 transition-all cursor-default"
                >
                  {/* Card Header */}
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-11 h-11 rounded-2xl bg-indigo-500/10 flex items-center justify-center shrink-0 group-hover:bg-indigo-500/20 transition-colors">
                        <Store size={20} className="text-indigo-400" />
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-bold text-sm leading-tight truncate pr-2">{branch.name}</h3>
                        <span className="text-[10px] text-gray-600 font-mono">#{branch.id.substring(0, 8)}</span>
                      </div>
                    </div>
                    {/* Actions */}
                    <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setEditingBranch(branch)}
                        className="w-8 h-8 rounded-xl bg-white/5 hover:bg-indigo-500/20 flex items-center justify-center text-gray-400 hover:text-indigo-400 transition-all"
                        title="แก้ไข"
                      >
                        <Edit2 size={14} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => setDeletingBranch(branch)}
                        className="w-8 h-8 rounded-xl bg-white/5 hover:bg-rose-500/20 flex items-center justify-center text-gray-400 hover:text-rose-400 transition-all"
                        title="ลบ"
                      >
                        <Trash2 size={14} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Location */}
                  <div className="flex items-start gap-2 mb-4 min-h-[40px]">
                    <MapPin size={13} className="text-indigo-400 mt-0.5 shrink-0" />
                    {branch.location ? (
                      <p className="text-xs text-gray-400 leading-relaxed line-clamp-2">{branch.location}</p>
                    ) : (
                      <p className="text-xs text-gray-600 italic">ยังไม่ได้บันทึกที่ตั้ง</p>
                    )}
                  </div>

                  {/* Stats */}
                  <div className="flex items-center gap-3 pt-4 border-t border-white/5">
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <ShoppingBag size={12} className="text-blue-400" />
                      <span><span className="font-bold text-white">{branch._count.orders}</span> ออเดอร์</span>
                    </div>
                    <div className="w-1 h-1 rounded-full bg-white/10" />
                    <div className="flex items-center gap-1.5 text-xs text-gray-500">
                      <Package size={12} className="text-amber-400" />
                      <span><span className="font-bold text-white">{branch._count.inventory}</span> รายการสต็อก</span>
                    </div>
                    <div className="ml-auto">
                      <motion.button
                        whileHover={{ x: 2 }}
                        onClick={() => setEditingBranch(branch)}
                        className="text-[10px] text-indigo-400 flex items-center gap-1 hover:text-indigo-300 transition-colors"
                      >
                        แก้ไข <ChevronRight size={10} />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {editingBranch !== undefined && (
          <BranchModal
            branch={editingBranch}
            onClose={() => setEditingBranch(undefined)}
            onSave={handleSave}
          />
        )}
        {deletingBranch && (
          <DeleteModal
            branch={deletingBranch}
            onClose={() => setDeletingBranch(null)}
            onConfirm={handleDelete}
          />
        )}
      </AnimatePresence>

      {/* Toast Notification */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl text-sm font-bold shadow-2xl flex items-center gap-3 z-50 ${
              toast.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
            }`}
          >
            {toast.type === 'success' ? <Check size={16} /> : <AlertTriangle size={16} />}
            {toast.msg}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
