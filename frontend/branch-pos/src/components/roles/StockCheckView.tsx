import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ClipboardCheck, Trash2, Save, 
  AlertCircle, CheckCircle2, ChevronRight, Package,
  Search, RefreshCw, Layers, Info
} from 'lucide-react';

const API_BASE = 'http://localhost:5001/api';

export default function StockCheckView({ branch }: any) {
  const [activeTab, setActiveTab] = useState<'open' | 'close'>('open');
  const [inventory, setInventory] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State for counts
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [waste, setWaste] = useState<Record<string, { qty: number, reason: string }>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    fetchInventory();
  }, [branch?.id]);

  const fetchInventory = async () => {
    if (!branch?.id) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/branches/${branch.id}/inventory`);
      const data = await res.json();
      setInventory(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredInventory = inventory.filter(item => 
    item.ingredient.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSaveOpening = async () => {
    setIsSubmitting(true);
    try {
      // In a real system, we'd log these as ADJUSTMENT or OPENING_COUNT
      // For this demo, we'll send them as ADJUSTMENT transactions
      for (const [ingredientId, qty] of Object.entries(counts)) {
        if (qty === undefined || qty === null) continue;
        
        await fetch(`${API_BASE}/inventory/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            branchId: branch.id,
            ingredientId,
            type: 'ADJUSTMENT',
            quantity: qty - (inventory.find(i => i.ingredientId === ingredientId)?.quantity || 0),
            note: 'Shift Opening Count'
          })
        });
      }
      setShowSuccess(true);
      fetchInventory();
      setCounts({});
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  const handleSaveClosing = async () => {
    setIsSubmitting(true);
    try {
      for (const [ingredientId, data] of Object.entries(waste)) {
        if (!data.qty || data.qty <= 0) continue;
        
        await fetch(`${API_BASE}/inventory/transactions`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            branchId: branch.id,
            ingredientId,
            type: 'WASTE',
            quantity: -data.qty,
            note: `Closing Waste: ${data.reason}`
          })
        });
      }
      setShowSuccess(true);
      fetchInventory();
      setWaste({});
    } catch (err) {
      console.error(err);
    } finally {
      setIsSubmitting(false);
      setTimeout(() => setShowSuccess(false), 3000);
    }
  };

  return (
    <div className="h-full flex flex-col bg-[#fdfaf6]">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 p-8 shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-2 text-[#7c543c]">
              <div className="w-10 h-10 rounded-2xl bg-[#7c543c]/10 flex items-center justify-center">
                <Layers size={20} />
              </div>
              <span className="font-black text-xs uppercase tracking-[0.2em]">Inventory Management</span>
            </div>
            <h1 className="text-3xl font-black text-slate-800 tracking-tight italic">
              Branch Stock Control
            </h1>
          </div>

          <div className="flex bg-gray-100 p-1.5 rounded-2xl">
            <button 
              onClick={() => setActiveTab('open')}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'open' ? 'bg-white text-[#7c543c] shadow-sm' : 'text-gray-400'}`}
            >
              <ClipboardCheck size={16} /> Opening Shift
            </button>
            <button 
              onClick={() => setActiveTab('close')}
              className={`px-8 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all flex items-center gap-2 ${activeTab === 'close' ? 'bg-white text-[#7c543c] shadow-sm' : 'text-gray-400'}`}
            >
              <Trash2 size={16} /> Closing Shift
            </button>
          </div>
        </div>
      </header>

      <main className="flex-1 overflow-hidden flex flex-col max-w-7xl mx-auto w-full p-8">
        {/* Search & Actions */}
        <div className="flex flex-col md:flex-row gap-4 mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search ingredients, materials..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-14 pr-6 py-4 bg-white rounded-3xl border border-gray-100 shadow-sm focus:ring-2 focus:ring-[#7c543c]/10 outline-none font-bold text-slate-700 transition-all"
            />
          </div>
          <button 
            onClick={fetchInventory}
            className="p-4 bg-white rounded-2xl border border-gray-100 shadow-sm text-gray-400 hover:text-[#7c543c] transition-colors"
          >
            <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          </button>
        </div>

        {/* Content Table */}
        <div className="flex-1 bg-white rounded-[3rem] shadow-xl shadow-gray-200/40 border border-gray-50 overflow-hidden flex flex-col">
          <div className="grid grid-cols-12 bg-gray-50/50 p-6 border-b border-gray-100">
            <div className="col-span-5 text-[10px] font-black text-gray-400 uppercase tracking-widest">Ingredient / Material</div>
            <div className="col-span-2 text-[10px] font-black text-gray-400 uppercase tracking-widest text-center">System Qty</div>
            <div className="col-span-5 text-[10px] font-black text-gray-400 uppercase tracking-widest text-right">Actual / Waste Entry</div>
          </div>

          <div className="flex-1 overflow-y-auto p-2 space-y-2 no-scrollbar">
            {filteredInventory.map((item) => (
              <div key={item.id} className="grid grid-cols-12 items-center p-6 rounded-[2rem] hover:bg-gray-50/80 transition-colors group">
                <div className="col-span-5 flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-xl">
                    {item.ingredient.imageUrl ? <img src={item.ingredient.imageUrl} className="w-full h-full object-cover rounded-2xl" /> : <Package size={20} className="text-gray-300" />}
                  </div>
                  <div>
                    <h4 className="font-black text-slate-800 text-sm">{item.ingredient.name}</h4>
                    <p className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">{item.ingredient.unit}</p>
                  </div>
                </div>

                <div className="col-span-2 text-center">
                  <span className={`px-4 py-2 rounded-xl text-xs font-black ${item.quantity <= item.lowStockThreshold ? 'bg-rose-50 text-rose-500' : 'bg-emerald-50 text-emerald-600'}`}>
                    {item.quantity} {item.ingredient.unit}
                  </span>
                </div>

                <div className="col-span-5 flex justify-end gap-3">
                  {activeTab === 'open' ? (
                    <div className="flex items-center gap-2 bg-gray-50 rounded-2xl p-1.5 focus-within:ring-2 focus-within:ring-[#7c543c]/10 transition-all border border-transparent focus-within:border-[#7c543c]/10">
                      <input 
                        type="number" 
                        placeholder="0"
                        value={counts[item.ingredientId] ?? ''}
                        onChange={(e) => setCounts({...counts, [item.ingredientId]: parseFloat(e.target.value)})}
                        className="w-24 bg-transparent text-right font-black text-sm outline-none px-2"
                      />
                      <span className="text-[10px] font-black text-gray-300 uppercase pr-2">{item.ingredient.unit}</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-3 w-full justify-end">
                      <input 
                        type="number" 
                        placeholder="Qty"
                        value={waste[item.ingredientId]?.qty ?? ''}
                        onChange={(e) => setWaste({
                          ...waste, 
                          [item.ingredientId]: { ...waste[item.ingredientId], qty: parseFloat(e.target.value) }
                        })}
                        className="w-20 p-3 bg-rose-50/30 rounded-xl border border-rose-100/50 font-black text-xs outline-none text-rose-600 placeholder:text-rose-300"
                      />
                      <input 
                        type="text" 
                        placeholder="Reason (Spoiled, Spilled...)"
                        value={waste[item.ingredientId]?.reason ?? ''}
                        onChange={(e) => setWaste({
                          ...waste, 
                          [item.ingredientId]: { ...waste[item.ingredientId], reason: e.target.value }
                        })}
                        className="flex-1 max-w-[200px] p-3 bg-gray-50 rounded-xl border border-gray-100 font-bold text-[11px] outline-none"
                      />
                    </div>
                  )}
                </div>
              </div>
            ))}

            {filteredInventory.length === 0 && (
              <div className="h-64 flex flex-col items-center justify-center text-gray-300 italic">
                <AlertCircle size={48} className="mb-4 opacity-20" />
                <p className="font-bold">No inventory items found</p>
              </div>
            )}
          </div>

          {/* Footer Save */}
          <div className="p-8 border-t border-gray-100 bg-gray-50/30 flex items-center justify-between">
            <div className="flex items-center gap-3 text-gray-400">
              <Info size={18} />
              <p className="text-xs font-bold">บันทึกข้อมูลจะทำการอัปเดตสต็อคในระบบทันที</p>
            </div>
            
            <button 
              onClick={activeTab === 'open' ? handleSaveOpening : handleSaveClosing}
              disabled={isSubmitting || (activeTab === 'open' ? Object.keys(counts).length === 0 : Object.keys(waste).length === 0)}
              className="flex items-center gap-3 px-10 py-4 bg-[#7c543c] text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-[#7c543c]/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50 disabled:scale-100"
            >
              {isSubmitting ? <RefreshCw size={18} className="animate-spin" /> : <Save size={18} />}
              {activeTab === 'open' ? 'Save Opening Count' : 'Report Waste'}
            </button>
          </div>
        </div>
      </main>

      {/* Success Notification */}
      <AnimatePresence>
        {showSuccess && (
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-10 left-1/2 -translate-x-1/2 bg-emerald-500 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 z-[100]"
          >
            <CheckCircle2 size={24} />
            <span className="font-black text-sm uppercase tracking-widest">Inventory Data Saved Successfully!</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
