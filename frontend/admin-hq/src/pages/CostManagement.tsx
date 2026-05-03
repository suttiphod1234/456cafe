import { useState, useEffect } from 'react';
// import { motion } from 'framer-motion';
import { DollarSign, Loader2, AlertCircle, Coffee } from 'lucide-react';

const API = 'http://localhost:5001/api';

export default function CostManagement() {
  const [costingData, setCostingData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API}/menu/costing`)
      .then(res => res.json())
      .then(data => {
        setCostingData(data);
        setLoading(false);
      })
      .catch(e => {
        console.error(e);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex-1 flex items-center justify-center"><Loader2 size={32} className="animate-spin text-[var(--coffee-400)]" /></div>;

  return (
    <div className="flex-1 flex flex-col h-full" style={{ background: 'var(--bg-main)' }}>
      <header className="h-20 flex items-center justify-between px-10 shrink-0" style={{ background: 'var(--bg-card)', borderBottom: '1px solid var(--border-color)' }}>
        <h1 className="text-2xl font-bold flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
          <DollarSign style={{ color: 'var(--accent)' }} /> วิเคราะห์ต้นทุนและกำไร (Cost & Margin)
        </h1>
      </header>

      <div className="flex-1 overflow-auto p-10">
        <div className="grid gap-6">
          {costingData.map(item => {
            const hasLowMargin = item.marginPercentage < 30 && item.price > 0;
            return (
              <div key={item.id} className="rounded-3xl border p-8 shadow-sm flex flex-col xl:flex-row gap-8 items-start xl:items-center transition-transform hover:-translate-y-1" style={{ background: hasLowMargin ? 'rgba(245, 158, 11, 0.05)' : 'var(--bg-card)', borderColor: hasLowMargin ? '#fcd34d' : 'var(--border-color)' }}>
                <div className="flex items-center gap-5 w-72 shrink-0">
                  <div className="w-20 h-20 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg-hover)' }}>
                    {item.imageUrl ? <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover rounded-2xl" /> : <Coffee size={28} style={{ color: 'var(--accent)' }} />}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-xl" style={{ color: 'var(--text-main)' }}>{item.name}</h3>
                    <p className="text-sm font-bold" style={{ color: 'var(--text-muted)' }}>{item.category?.name}</p>
                  </div>
                </div>

                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
                  <div className="rounded-2xl p-5 border" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                    <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>ต้นทุนวัตถุดิบ (COGS)</p>
                    <p className="text-2xl font-extrabold text-rose-500 dark:text-rose-400">฿{item.cogs.toFixed(2)}</p>
                  </div>
                  <div className="rounded-2xl p-5 border" style={{ background: 'var(--bg-main)', borderColor: 'var(--border-color)' }}>
                    <p className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: 'var(--text-muted)' }}>ราคาขาย</p>
                    <p className="text-2xl font-extrabold" style={{ color: 'var(--text-main)' }}>฿{item.price.toFixed(2)}</p>
                  </div>
                  <div className={`rounded-2xl p-5 border ${hasLowMargin ? 'bg-amber-50/50 dark:bg-amber-900/20 border-amber-300 dark:border-amber-700' : 'bg-emerald-50/50 dark:bg-emerald-900/20 border-emerald-300 dark:border-emerald-700'}`}>
                    <div className="flex items-center justify-between mb-2">
                      <p className={`text-sm font-bold uppercase tracking-wider ${hasLowMargin ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'}`}>กำไร (Profit)</p>
                      {hasLowMargin && <AlertCircle size={18} className="text-amber-500" />}
                    </div>
                    <div className="flex items-baseline gap-3">
                      <p className={`text-3xl font-extrabold ${hasLowMargin ? 'text-amber-600 dark:text-amber-500' : 'text-emerald-600 dark:text-emerald-500'}`}>฿{item.profit.toFixed(2)}</p>
                      <p className={`text-[1rem] font-bold ${hasLowMargin ? 'text-amber-500' : 'text-emerald-500'}`}>({item.marginPercentage.toFixed(1)}%)</p>
                    </div>
                  </div>
                </div>

                <div className="w-56 shrink-0 pt-4 xl:pt-0">
                  <p className="text-sm font-bold mb-3" style={{ color: 'var(--text-muted)' }}>สูตรวัตถุดิบ ({item.recipes.length})</p>
                  <div className="space-y-2">
                    {item.recipes.map((r: any) => (
                      <div key={r.id} className="flex items-center justify-between text-sm">
                        <span className="truncate pr-3" style={{ color: 'var(--text-main)' }}>{r.ingredient.name}</span>
                        <span className="font-bold whitespace-nowrap" style={{ color: 'var(--text-muted)' }}>{r.quantity} {r.ingredient.unit}</span>
                      </div>
                    ))}
                    {item.recipes.length === 0 && <p className="text-xs italic" style={{ color: 'var(--accent)' }}>ยังไม่ได้ตั้งค่าสูตร</p>}
                  </div>
                </div>
              </div>
            );
          })}
          
          {costingData.length === 0 && (
            <div className="text-center py-20 text-[var(--coffee-500)]">ยังไม่มีข้อมูลเมนู</div>
          )}
        </div>
      </div>
    </div>
  );
}
