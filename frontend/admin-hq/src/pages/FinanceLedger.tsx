import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Banknote, TrendingUp, TrendingDown, Plus, X, Loader2, ArrowUpRight, ArrowDownRight, Filter } from 'lucide-react';

const API = 'http://localhost:5001/api';

interface Cashflow {
  id: string;
  type: string;
  category: string;
  amount: number;
  note: string;
  createdAt: string;
}

export default function FinanceLedger() {
  const [transactions, setTransactions] = useState<Cashflow[]>([]);
  const [summary, setSummary] = useState({ totalIncome: 0, totalExpense: 0, netProfit: 0 });
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({ type: 'INCOME', category: 'SALES', amount: '', note: '' });

  const fetchFinance = async () => {
    try {
      const [txRes, sumRes] = await Promise.all([
        fetch(`${API}/finance/cashflow`),
        fetch(`${API}/finance/summary`)
      ]);
      setTransactions(await txRes.json());
      setSummary(await sumRes.json());
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinance();
  }, []);

  const submitTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.amount) return;
    
    await fetch(`${API}/finance/cashflow`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        branchId: 'main-branch',
        type: form.type,
        category: form.category,
        amount: parseFloat(form.amount),
        note: form.note
      })
    });
    setModalOpen(false);
    setForm({ type: 'INCOME', category: 'SALES', amount: '', note: '' });
    fetchFinance();
  };

  const getCategoryLabel = (cat: string) => {
    const map: any = { SALES: 'ยอดขาย', INGREDIENTS: 'ซื้อวัตถุดิบ', SALARY: 'เงินเดือน', UTILITIES: 'ค่าน้ำ-ไฟ', RENT: 'ค่าเช่า', MISC: 'จิปาถะ' };
    return map[cat] || cat;
  };

  if (loading) return <div className="flex-1 flex items-center justify-center"><Loader2 size={32} className="animate-spin text-[var(--accent)]" /></div>;

  return (
    <div className="flex-1 flex flex-col h-full" style={{ background: 'var(--bg-main)' }}>
      <header className="h-20 flex items-center justify-between px-10 shrink-0" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
          <Banknote style={{ color: 'var(--accent)' }} /> บัญชีรายรับ-รายจ่าย
        </h1>
        <div className="flex gap-3">
          <button className="px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-sm transition-colors hover:opacity-80" style={{ background: 'var(--bg-main)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}>
            <Filter size={18} /> กรองข้อมูล
          </button>
          <button onClick={() => setModalOpen(true)} className="px-5 py-2.5 rounded-xl text-white font-bold flex items-center gap-2 shadow-md transition-opacity hover:opacity-90" style={{ background: 'var(--accent)' }}>
            <Plus size={18} /> ลงบันทึกบัญชี
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-auto p-10 space-y-8">
        
        {/* Dashboard Summary */}
        <div className="grid grid-cols-3 gap-6">
          <div className="rounded-2xl p-6 border shadow-sm" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-emerald-500/20 flex items-center justify-center">
                <ArrowDownRight className="text-emerald-500" />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>รายรับรวม</p>
            </div>
            <h3 className="text-3xl font-extrabold text-emerald-500 mt-2">฿{summary.totalIncome.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
          </div>
          <div className="rounded-2xl p-6 border shadow-sm" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl bg-rose-500/20 flex items-center justify-center">
                <ArrowUpRight className="text-rose-500" />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>รายจ่ายรวม</p>
            </div>
            <h3 className="text-3xl font-extrabold text-rose-500 mt-2">฿{summary.totalExpense.toLocaleString(undefined, {minimumFractionDigits: 2})}</h3>
          </div>
          <div className="rounded-2xl p-6 border shadow-sm" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-hover)' }}>
                <Banknote style={{ color: 'var(--accent)' }} />
              </div>
              <p className="text-sm font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>กำไรสุทธิ</p>
            </div>
            <h3 className="text-3xl font-extrabold mt-2" style={{ color: summary.netProfit >= 0 ? 'var(--text-main)' : '#f43f5e' }}>
              {summary.netProfit < 0 ? '-' : ''}฿{Math.abs(summary.netProfit).toLocaleString(undefined, {minimumFractionDigits: 2})}
            </h3>
          </div>
        </div>

        {/* Ledger Table */}
        <div className="rounded-2xl overflow-hidden shadow-sm admin-card">
          <table className="w-full text-left">
            <thead className="text-[1rem] uppercase tracking-wider" style={{ background: 'var(--bg-hover)', color: 'var(--text-muted)' }}>
              <tr>
                <th className="p-5 font-bold">วันที่/เวลา</th>
                <th className="p-5 font-bold">ประเภท</th>
                <th className="p-5 font-bold">หมวดหมู่</th>
                <th className="p-5 font-bold text-right">จำนวนเงิน</th>
                <th className="p-5 font-bold">หมายเหตุ</th>
              </tr>
            </thead>
            <tbody className="text-[1.05rem]" style={{ color: 'var(--text-main)', borderTop: '1px solid var(--border-color)' }}>
              {transactions.length === 0 ? (
                <tr><td colSpan={5} className="p-10 text-center text-lg" style={{ color: 'var(--text-muted)' }}>ยังไม่มีรายการเดินบัญชี</td></tr>
              ) : transactions.map((tx, idx) => {
                const isIncome = tx.type === 'INCOME';
                return (
                  <tr key={tx.id} className="transition-colors" style={{ borderBottom: idx === transactions.length - 1 ? 'none' : '1px solid var(--border-color)', backgroundColor: 'var(--bg-card)' }}>
                    <td className="p-5 text-sm" style={{ color: 'var(--text-muted)' }}>{new Date(tx.createdAt).toLocaleString('th-TH')}</td>
                    <td className="p-5">
                      <span className={`px-2.5 py-1.5 rounded-lg text-[0.8rem] font-bold ${
                        isIncome ? 'bg-emerald-500/20 text-emerald-600 dark:text-emerald-400' : 'bg-rose-500/20 text-rose-600 dark:text-rose-400'
                      }`}>
                        {isIncome ? 'รายรับ' : 'รายจ่าย'}
                      </span>
                    </td>
                    <td className="p-5 font-bold">{getCategoryLabel(tx.category)}</td>
                    <td className={`p-5 text-right font-extrabold text-lg ${isIncome ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500 dark:text-rose-400'}`}>
                      {isIncome ? '+' : '-'}฿{tx.amount.toLocaleString(undefined, {minimumFractionDigits: 2})}
                    </td>
                    <td className="p-5 text-sm" style={{ color: 'var(--text-muted)' }}>{tx.note || '-'}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {modalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-6">
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={() => setModalOpen(false)} />
            <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative rounded-3xl w-full max-w-md shadow-2xl p-8 border" style={{ background: 'var(--bg-card)', borderColor: 'var(--border-color)' }}>
              <h2 className="text-xl font-bold mb-6" style={{ color: 'var(--text-main)' }}>ลงบันทึกบัญชีใหม่</h2>
              <form onSubmit={submitTransaction} className="space-y-5">
                <div className="grid grid-cols-2 gap-3">
                  <button type="button" onClick={() => setForm({...form, type: 'INCOME', category: 'SALES'})} className={`py-3 rounded-xl font-bold text-center border-2 transition-all ${form.type === 'INCOME' ? 'border-emerald-500 bg-emerald-500/10 text-emerald-600' : 'border-transparent bg-[var(--bg-hover)] text-[var(--text-muted)]'}`}>
                    รายรับ
                  </button>
                  <button type="button" onClick={() => setForm({...form, type: 'EXPENSE', category: 'MISC'})} className={`py-3 rounded-xl font-bold text-center border-2 transition-all ${form.type === 'EXPENSE' ? 'border-rose-500 bg-rose-500/10 text-rose-600' : 'border-transparent bg-[var(--bg-hover)] text-[var(--text-muted)]'}`}>
                    รายจ่าย
                  </button>
                </div>
                
                <div>
                  <label className="text-sm font-bold block mb-1.5" style={{ color: 'var(--text-muted)' }}>หมวดหมู่</label>
                  <select value={form.category} onChange={e => setForm({...form, category: e.target.value})} className="w-full border rounded-xl p-3 text-[1rem] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }}>
                    {form.type === 'INCOME' ? (
                      <>
                        <option value="SALES">ยอดขาย</option>
                        <option value="MISC">รายรับอื่นๆ</option>
                      </>
                    ) : (
                      <>
                        <option value="INGREDIENTS">ซื้อวัตถุดิบ</option>
                        <option value="SALARY">เงินเดือน</option>
                        <option value="UTILITIES">ค่าน้ำ-ไฟ</option>
                        <option value="RENT">ค่าเช่า</option>
                        <option value="MISC">รายจ่ายอื่นๆ</option>
                      </>
                    )}
                  </select>
                </div>
                <div>
                  <label className="text-sm font-bold block mb-1.5" style={{ color: 'var(--text-muted)' }}>จำนวนเงิน (฿)</label>
                  <input type="number" step="any" required value={form.amount} onChange={e => setForm({...form, amount: e.target.value})} className="w-full border rounded-xl p-3 text-[1rem] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} placeholder="0.00" />
                </div>
                <div>
                  <label className="text-sm font-bold block mb-1.5" style={{ color: 'var(--text-muted)' }}>หมายเหตุ</label>
                  <input type="text" value={form.note} onChange={e => setForm({...form, note: e.target.value})} className="w-full border rounded-xl p-3 text-[1rem] focus:outline-none focus:ring-2 focus:ring-[var(--accent)]" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)', color: 'var(--text-main)' }} placeholder="อธิบายเพิ่มเติม" />
                </div>
                <div className="flex gap-3 pt-4">
                  <button type="button" onClick={() => setModalOpen(false)} className="flex-1 py-3 rounded-xl font-bold text-[1rem] transition-colors" style={{ background: 'var(--bg-hover)', color: 'var(--text-main)' }}>ยกเลิก</button>
                  <button type="submit" className="flex-1 py-3 rounded-xl font-bold text-[1rem] text-white transition-opacity hover:opacity-90" style={{ background: 'var(--accent)' }}>บันทึกรายการ</button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
