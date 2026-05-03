import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Loader2, AlertTriangle, Plus, ClipboardList } from 'lucide-react';

const API = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api`;
// const C = { ... };

interface Transaction {
  id: string;
  branchId: string;
  ingredientId: string;
  type: string;
  quantity: number;
  unitCost: number;
  totalCost: number;
  referenceId: string;
  note: string;
  createdAt: string;
  ingredient: { name: string; unit: string; costPerUnit: number };
}

interface Ingredient {
  id: string;
  name: string;
  unit: string;
  costPerUnit: number;
  sku: string;
}

export default function InventoryLedger() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [loading, setLoading] = useState(true);
  const [txModalOpen, setTxModalOpen] = useState(false);
  const [ingModalOpen, setIngModalOpen] = useState(false);
  const [form, setForm] = useState({ ingredientId: '', type: 'STOCK_IN', quantity: '', unitCost: '', note: '' });
  const [ingForm, setIngForm] = useState({ id: '', name: '', unit: '', costPerUnit: '', sku: '' });

  const fetchTransactions = async () => {
    try {
      const [txRes, ingRes] = await Promise.all([
        fetch(`${API}/inventory/transactions`),
        fetch(`${API}/products/ingredients`)
      ]);
      setTransactions(await txRes.json());
      setIngredients(await ingRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const submitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.ingredientId || !form.quantity) return;
    
    // Fallback branchId for testing, should come from auth
    const branchId = 'main-branch'; 

    await fetch(`${API}/inventory/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branchId,
        ingredientId: form.ingredientId,
        type: form.type,
        quantity: parseFloat(form.quantity),
        unitCost: form.unitCost ? parseFloat(form.unitCost) : undefined,
        note: form.note
      })
    });
    setTxModalOpen(false);
    fetchTransactions();
  };

  const submitIngredient = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ingForm.name || !ingForm.unit) return;

    const payload = {
      name: ingForm.name,
      unit: ingForm.unit,
      costPerUnit: ingForm.costPerUnit ? parseFloat(ingForm.costPerUnit) : 0,
      sku: ingForm.sku
    };

    if (ingForm.id) {
      await fetch(`${API}/products/ingredients/${ingForm.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    } else {
      await fetch(`${API}/products/ingredients`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
    }
    
    setIngModalOpen(false);
    setIngForm({ id: '', name: '', unit: '', costPerUnit: '', sku: '' });
    fetchTransactions();
  };

  if (loading) return <div className="flex-1 flex items-center justify-center"><Loader2 size={32} className="animate-spin text-[var(--coffee-400)]" /></div>;

  return (
    <div className="flex-1 flex flex-col h-full" style={{ background: 'var(--bg-main)' }}>
      <header className="h-20 flex items-center justify-between px-10 shrink-0" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
          <ClipboardList style={{ color: 'var(--accent)' }} /> บัญชีประวัติสต็อค
        </h1>
        <div className="flex gap-3">
          <button onClick={() => setIngModalOpen(true)} className="px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
            จัดการวัตถุดิบ (Ingredients)
          </button>
          <button onClick={() => setTxModalOpen(true)} className="px-5 py-2.5 rounded-xl text-white font-bold flex items-center gap-2 shadow-md hover:opacity-90 transition-colors" style={{ background: 'var(--accent)' }}>
            <Plus size={18} /> บันทึกรับเข้า/ของเสีย
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-10">
        <div className="rounded-2xl overflow-hidden shadow-sm admin-card">
          <table className="w-full text-left">
            <thead className="text-[1rem] uppercase tracking-wider" style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
              <tr>
                <th className="p-5 font-bold">วันที่/เวลา</th>
                <th className="p-5 font-bold">รายการ</th>
                <th className="p-5 font-bold">ประเภท</th>
                <th className="p-5 font-bold text-right">จำนวน</th>
                <th className="p-5 font-bold text-right">ต้นทุน/หน่วย</th>
                <th className="p-5 font-bold text-right">มูลค่ารวม</th>
                <th className="p-5 font-bold">หมายเหตุ</th>
              </tr>
            </thead>
            <tbody className="text-[1.05rem]" style={{ color: 'var(--text-main)', borderTop: '1px solid var(--border-color)' }}>
              {transactions.length === 0 ? (
                <tr><td colSpan={7} className="p-10 text-center text-lg" style={{ color: 'var(--text-muted)' }}>ยังไม่มีประวัติสต็อค</td></tr>
              ) : transactions.map((tx, idx) => {
                const isPositive = tx.quantity > 0;
                return (
                  <tr key={tx.id} className="transition-colors" style={{ borderBottom: idx === transactions.length - 1 ? 'none' : '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                    <td className="p-5 text-sm" style={{ color: 'var(--text-muted)' }}>{new Date(tx.createdAt).toLocaleString('th-TH')}</td>
                    <td className="p-5 font-bold">{tx.ingredient?.name}</td>
                    <td className="p-5">
                      <span className={`px-2.5 py-1.5 rounded-lg text-[0.8rem] font-bold ${
                        tx.type === 'STOCK_IN' ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' :
                        tx.type === 'WASTE' ? 'bg-rose-500/20 text-rose-600 dark:text-rose-400' :
                        tx.type === 'ORDER_DEDUCTION' ? 'bg-amber-500/20 text-amber-600 dark:text-amber-400' :
                        'bg-blue-500/20 text-blue-600 dark:text-blue-400'
                      }`}>
                        {tx.type}
                      </span>
                    </td>
                    <td className={`p-5 text-right font-extrabold text-lg ${isPositive ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                      {isPositive ? '+' : ''}{tx.quantity} {tx.ingredient?.unit}
                    </td>
                    <td className="p-5 text-right">฿{tx.unitCost.toFixed(2)}</td>
                    <td className="p-5 text-right font-extrabold text-lg">฿{Math.abs(tx.totalCost).toFixed(2)}</td>
                    <td className="p-5 text-sm" style={{ color: 'var(--text-muted)' }}>{tx.note || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {txModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setTxModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative rounded-3xl w-full max-w-md shadow-2xl p-8 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-main)' }}>บันทึกสต็อค</h2>
              <form onSubmit={submitTransaction} className="space-y-5">
                <div>
                  <label className="text-sm font-bold block mb-1.5" style={{ color: 'var(--text-muted)' }}>ประเภท</label>
                  <select value={form.type} onChange={e => setForm({...form, type: e.target.value})} className="w-full border rounded-xl p-3 text-[1rem] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                    <option value="STOCK_IN">รับของเข้าสต็อค (Stock In)</option>
                    <option value="WASTE">ทิ้งของเสีย (Waste)</option>
                    <option value="ADJUSTMENT">ปรับปรุงยอด (Adjustment)</option>
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold block mb-1.5" style={{ color: 'var(--text-muted)' }}>วัตถุดิบ</label>
                  <select value={form.ingredientId} onChange={e => setForm({...form, ingredientId: e.target.value})} className="w-full border rounded-xl p-3 text-[1rem] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                    <option value="">-- เลือกวัตถุดิบ --</option>
                    {ingredients.map(ig => <option key={ig.id} value={ig.id}>{ig.name}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-bold block mb-1.5" style={{ color: 'var(--text-muted)' }}>จำนวน</label>
                    <input type="number" step="any" required value={form.quantity} onChange={e => setForm({...form, quantity: e.target.value})} className="w-full border rounded-xl p-3 text-[1rem] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} placeholder="0" />
                  </div>
                  <div>
                    <label className="text-sm font-bold block mb-1.5" style={{ color: 'var(--text-muted)' }}>ราคาต่อหน่วย (฿)</label>
                    <input type="number" step="any" value={form.unitCost} onChange={e => setForm({...form, unitCost: e.target.value})} className="w-full border rounded-xl p-3 text-[1rem] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} placeholder="ปล่อยว่างใช้ค่าเดิม" />
                  </div>
                </div>
                <div>
                  <label className="text-sm font-bold block mb-1.5" style={{ color: 'var(--text-muted)' }}>หมายเหตุ</label>
                  <input type="text" value={form.note} onChange={e => setForm({...form, note: e.target.value})} className="w-full border rounded-xl p-3 text-[1rem] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} placeholder="เช่น ซื้อจากแม็คโคร, ของหมดอายุ" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setTxModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-[1rem] transition-colors" style={{ background: 'var(--bg-hover)', color: 'var(--text-main)' }}>ยกเลิก</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-[1rem] text-white transition-opacity hover:opacity-90" style={{ background: 'var(--accent)' }}>บันทึกรายการ</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}

        {ingModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setIngModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative rounded-3xl w-full max-w-lg shadow-2xl flex flex-col border max-h-[80vh]" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <div className="p-6 shrink-0 flex items-center justify-between" style={{ borderBottom: '1px solid var(--border-color)' }}>
                <h2 className="text-xl font-bold" style={{ color: 'var(--text-main)' }}>จัดการวัตถุดิบ (Ingredients)</h2>
                <button onClick={() => setIngModalOpen(false)} className="p-2 rounded-lg transition-colors hover:opacity-80" style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}><X size={20}/></button>
              </div>
              
              <div className="flex-1 overflow-auto p-6 space-y-8">
                <form onSubmit={submitIngredient} className="p-6 rounded-2xl border space-y-5" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                  <h3 className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>{ingForm.id ? 'แก้ไขวัตถุดิบ' : 'เพิ่มวัตถุดิบใหม่'}</h3>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="text-sm font-bold block mb-1.5" style={{ color: 'var(--text-muted)' }}>ชื่อวัตถุดิบ *</label>
                      <input type="text" required value={ingForm.name} onChange={e => setIngForm({...ingForm, name: e.target.value})} className="w-full border rounded-xl p-3 text-[1rem] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} placeholder="เช่น เมล็ดกาแฟ, นมสด" />
                    </div>
                    <div>
                      <label className="text-sm font-bold block mb-1.5" style={{ color: 'var(--text-muted)' }}>รหัส SKU (ถ้ามี)</label>
                      <input type="text" value={ingForm.sku} onChange={e => setIngForm({...ingForm, sku: e.target.value})} className="w-full border rounded-xl p-3 text-[1rem] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} placeholder="SKU-001" />
                    </div>
                    <div>
                      <label className="text-sm font-bold block mb-1.5" style={{ color: 'var(--text-muted)' }}>หน่วยนับ *</label>
                      <input type="text" required value={ingForm.unit} onChange={e => setIngForm({...ingForm, unit: e.target.value})} className="w-full border rounded-xl p-3 text-[1rem] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} placeholder="เช่น g, ml, ถุง" />
                    </div>
                    <div>
                      <label className="text-sm font-bold block mb-1.5" style={{ color: 'var(--text-muted)' }}>ต้นทุนต่อหน่วย (฿)</label>
                      <input type="number" step="any" required value={ingForm.costPerUnit} onChange={e => setIngForm({...ingForm, costPerUnit: e.target.value})} className="w-full border rounded-xl p-3 text-[1rem] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} placeholder="0.00" />
                    </div>
                  </div>
                  <div className="flex gap-3 pt-2">
                    {ingForm.id && <button type="button" onClick={() => setIngForm({ id: '', name: '', unit: '', costPerUnit: '', sku: '' })} className="py-2.5 px-5 rounded-xl font-bold transition-colors" style={{ background: 'var(--bg-hover)', color: 'var(--text-main)' }}>ยกเลิกแก้ไข</button>}
                    <button type="submit" className="flex-1 py-2.5 rounded-xl font-bold text-white transition-opacity hover:opacity-90" style={{ background: 'var(--accent)' }}>{ingForm.id ? 'บันทึกการแก้ไข' : 'เพิ่มวัตถุดิบ'}</button>
                  </div>
                </form>

                <div>
                  <h3 className="font-bold text-xl mb-4" style={{ color: 'var(--text-main)' }}>วัตถุดิบทั้งหมด ({ingredients.length})</h3>
                  <div className="space-y-3">
                    {ingredients.map(ig => (
                      <div key={ig.id} className="flex items-center justify-between p-4 border rounded-xl transition-colors cursor-pointer" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }} onClick={() => setIngForm({ id: ig.id, name: ig.name, unit: ig.unit, costPerUnit: ig.costPerUnit?.toString() || '0', sku: ig.sku || '' })}>
                        <div>
                          <p className="font-bold text-lg" style={{ color: 'var(--text-main)' }}>{ig.name} {ig.sku && <span className="text-xs px-2 py-1 rounded ml-2" style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>{ig.sku}</span>}</p>
                          <p className="text-sm mt-1" style={{ color: 'var(--text-muted)' }}>หน่วย: {ig.unit} | ต้นทุน: ฿{ig.costPerUnit}/{ig.unit}</p>
                        </div>
                        <button className="text-sm font-bold px-4 py-2 rounded-lg transition-colors hover:opacity-80" style={{ background: 'var(--bg-hover)', color: 'var(--accent)' }}>แก้ไข</button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
