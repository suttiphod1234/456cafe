import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee, Plus, Edit2, Trash2, X, Check, Loader2, AlertTriangle,
  Search, Filter, Package, ShoppingBag,
  FlaskConical, Image, Tag, DollarSign, AlignLeft, Beaker, ChevronDown
} from 'lucide-react';

const CATEGORIES = ['ทั้งหมด', 'Signature', 'กาแฟเย็น', 'กาแฟร้อน', 'Non-Coffee', 'อาหาร'];
const CATEGORY_COLORS: Record<string, string> = {
  'Signature': 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  'กาแฟเย็น': 'text-blue-400 bg-blue-500/10 border-blue-500/20',
  'กาแฟร้อน': 'text-orange-400 bg-orange-500/10 border-orange-500/20',
  'Non-Coffee': 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
  'อาหาร': 'text-rose-400 bg-rose-500/10 border-rose-500/20',
};

interface Ingredient {
  id: string;
  name: string;
  unit: string;
}

interface Recipe {
  id: string;
  ingredientId: string;
  ingredient: Ingredient;
  quantity: number;
}

interface Product {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  imageUrl: string | null;
  createdAt: string;
  recipes: Recipe[];
  _count: { orderItems: number };
}

// ─── Product Form Modal ────────────────────────────────────────────────────
function ProductModal({
  product, onClose, onSave
}: {
  product?: Product | null;
  onClose: () => void;
  onSave: (data: any) => Promise<void>;
}) {
  const [form, setForm] = useState({
    name: product?.name || '',
    description: product?.description || '',
    price: product?.price?.toString() || '',
    category: product?.category || 'Signature',
    imageUrl: product?.imageUrl || '',
  });
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  const update = (field: string, value: string) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim()) { setError('กรุณากรอกชื่อสินค้า'); return; }
    if (!form.price || isNaN(Number(form.price))) { setError('กรุณากรอกราคาที่ถูกต้อง'); return; }
    setIsSaving(true);
    setError('');
    try {
      await onSave({ ...form, price: parseFloat(form.price) });
      onClose();
    } catch {
      setError('เกิดข้อผิดพลาด กรุณาลองใหม่');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        transition={{ type: 'spring', damping: 25, stiffness: 350 }}
        className="relative w-full max-w-lg bg-[#131a2e] border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 pb-4 flex items-center justify-between border-b border-white/5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/15 flex items-center justify-center">
              <Coffee size={20} className="text-amber-400" />
            </div>
            <div>
              <h2 className="font-bold text-lg">{product ? 'แก้ไขสินค้า' : 'เพิ่มสินค้าใหม่'}</h2>
              <p className="text-xs text-gray-500">{product ? `แก้ไข "${product.name}"` : 'กรอกรายละเอียดสินค้า'}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all">
            <X size={16} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto no-scrollbar">
          {/* Name */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Tag size={11} /> ชื่อสินค้า *
            </label>
            <input value={form.name} onChange={e => update('name', e.target.value)}
              placeholder="เช่น Dirty Coffee, Caramel Latte"
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 placeholder:text-gray-600 transition-all" />
          </div>

          {/* Description */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <AlignLeft size={11} /> คำอธิบาย
            </label>
            <textarea value={form.description} onChange={e => update('description', e.target.value)}
              placeholder="บอกเล่าเกี่ยวกับสินค้า รสชาติ และส่วนผสมหลัก..."
              rows={2}
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 placeholder:text-gray-600 transition-all resize-none" />
          </div>

          {/* Price + Category */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <DollarSign size={11} /> ราคา (฿) *
              </label>
              <input type="number" min="0" step="5" value={form.price} onChange={e => update('price', e.target.value)}
                placeholder="120"
                className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 placeholder:text-gray-600 transition-all" />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
                <Filter size={11} /> หมวดหมู่
              </label>
              <div className="relative">
                <select value={form.category} onChange={e => update('category', e.target.value)}
                  className="w-full appearance-none bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 transition-all pr-8">
                  {CATEGORIES.filter(c => c !== 'ทั้งหมด').map(cat => (
                    <option key={cat} value={cat} className="bg-[#1a2236]">{cat}</option>
                  ))}
                </select>
                <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Image URL */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1.5">
              <Image size={11} /> URL รูปภาพ
            </label>
            <input value={form.imageUrl} onChange={e => update('imageUrl', e.target.value)}
              placeholder="https://images.unsplash.com/..."
              className="w-full bg-white/5 border border-white/10 rounded-2xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/40 placeholder:text-gray-600 transition-all" />
            {form.imageUrl && (
              <div className="mt-2 rounded-xl overflow-hidden h-28 border border-white/5">
                <img src={form.imageUrl} alt="Preview" className="w-full h-full object-cover" onError={e => (e.currentTarget.style.display = 'none')} />
              </div>
            )}
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
              className="flex-1 py-3 rounded-2xl bg-amber-600 hover:bg-amber-500 text-white text-sm font-bold flex items-center justify-center gap-2 shadow-lg shadow-amber-600/20 disabled:opacity-50 transition-all">
              {isSaving ? <><Loader2 size={16} className="animate-spin" />กำลังบันทึก...</> : <><Check size={16} />บันทึก</>}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Recipe Management Panel ───────────────────────────────────────────────
function RecipePanel({ product, ingredients, onClose, onRefresh }: {
  product: Product;
  ingredients: Ingredient[];
  onClose: () => void;
  onRefresh: () => void;
}) {
  const [recipes, setRecipes] = useState<Recipe[]>(product.recipes);
  const [newIngId, setNewIngId] = useState('');
  const [newQty, setNewQty] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editQty, setEditQty] = useState('');

  const availableIngredients = ingredients.filter(ing => !recipes.find(r => r.ingredientId === ing.id));

  const handleAddRecipe = async () => {
    if (!newIngId || !newQty) return;
    setIsAdding(true);
    try {
      const res = await fetch(`http://localhost:5001/api/products/${product.id}/recipes`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ingredientId: newIngId, quantity: parseFloat(newQty) }),
      });
      if (!res.ok) throw new Error('Failed');
      const newRecipe = await res.json();
      setRecipes(prev => [...prev, newRecipe]);
      setNewIngId(''); setNewQty('');
      onRefresh();
    } catch (e) { console.error(e); }
    finally { setIsAdding(false); }
  };

  const handleUpdateRecipe = async (recipeId: string) => {
    const res = await fetch(`http://localhost:5001/api/recipes/${recipeId}`, {
      method: 'PATCH', headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ quantity: parseFloat(editQty) }),
    });
    if (res.ok) {
      const updated = await res.json();
      setRecipes(prev => prev.map(r => r.id === recipeId ? updated : r));
      setEditingId(null);
      onRefresh();
    }
  };

  const handleDeleteRecipe = async (recipeId: string) => {
    const res = await fetch(`http://localhost:5001/api/recipes/${recipeId}`, { method: 'DELETE' });
    if (res.ok) { setRecipes(prev => prev.filter(r => r.id !== recipeId)); onRefresh(); }
  };

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.92 }}
        className="relative w-full max-w-md bg-[#131a2e] border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
      >
        {/* Header */}
        <div className="p-6 pb-4 border-b border-white/5 shrink-0">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <FlaskConical size={16} className="text-indigo-400" />
                <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest">สูตรส่วนผสม</span>
              </div>
              <h3 className="font-bold text-lg leading-tight">{product.name}</h3>
              <p className="text-xs text-gray-500 mt-0.5">จัดการวัตถุดิบที่ใช้ในการทำเมนูนี้</p>
            </div>
            <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 flex items-center justify-center text-gray-400 hover:text-white transition-all shrink-0">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Recipe List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-2 no-scrollbar">
          <AnimatePresence>
            {recipes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <Beaker size={32} className="text-gray-700 mb-3" />
                <p className="text-sm text-gray-500">ยังไม่มีส่วนผสม</p>
                <p className="text-xs text-gray-600">เพิ่มวัตถุดิบด้านล่าง</p>
              </div>
            ) : recipes.map(recipe => (
              <motion.div key={recipe.id} layout initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 10 }}
                className="flex items-center gap-3 bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-3 group"
              >
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 flex items-center justify-center shrink-0">
                  <Package size={14} className="text-indigo-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold truncate">{recipe.ingredient.name}</p>
                  {editingId === recipe.id ? (
                    <div className="flex items-center gap-2 mt-1">
                      <input type="number" value={editQty} onChange={e => setEditQty(e.target.value)}
                        className="w-20 bg-white/10 border border-white/20 rounded-lg px-2 py-1 text-xs focus:outline-none" />
                      <span className="text-xs text-gray-500">{recipe.ingredient.unit}</span>
                      <button onClick={() => handleUpdateRecipe(recipe.id)} className="text-emerald-400 hover:text-emerald-300"><Check size={14} /></button>
                      <button onClick={() => setEditingId(null)} className="text-gray-500 hover:text-white"><X size={14} /></button>
                    </div>
                  ) : (
                    <p className="text-xs text-gray-500">{recipe.quantity} {recipe.ingredient.unit}</p>
                  )}
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button onClick={() => { setEditingId(recipe.id); setEditQty(recipe.quantity.toString()); }}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-indigo-500/20 flex items-center justify-center text-gray-500 hover:text-indigo-400 transition-all">
                    <Edit2 size={12} />
                  </button>
                  <button onClick={() => handleDeleteRecipe(recipe.id)}
                    className="w-7 h-7 rounded-lg bg-white/5 hover:bg-rose-500/20 flex items-center justify-center text-gray-500 hover:text-rose-400 transition-all">
                    <Trash2 size={12} />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Add Recipe Row */}
        {availableIngredients.length > 0 && (
          <div className="p-5 pt-3 border-t border-white/5 shrink-0">
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">เพิ่มส่วนผสม</p>
            <div className="flex gap-2">
              <select value={newIngId} onChange={e => setNewIngId(e.target.value)}
                className="flex-1 bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 appearance-none min-w-0">
                <option value="" className="bg-[#1a2236]">เลือกวัตถุดิบ</option>
                {availableIngredients.map(ing => (
                  <option key={ing.id} value={ing.id} className="bg-[#1a2236]">{ing.name} ({ing.unit})</option>
                ))}
              </select>
              <input type="number" min="0" step="1" value={newQty} onChange={e => setNewQty(e.target.value)}
                placeholder="จำนวน"
                className="w-20 bg-white/5 border border-white/10 rounded-xl py-2.5 px-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/40 shrink-0" />
              <motion.button whileTap={{ scale: 0.95 }} disabled={!newIngId || !newQty || isAdding}
                onClick={handleAddRecipe}
                className="w-10 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 flex items-center justify-center text-white shrink-0 disabled:opacity-40 transition-all">
                {isAdding ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
              </motion.button>
            </div>
          </div>
        )}
      </motion.div>
    </motion.div>
  );
}

// ─── Delete Confirm ────────────────────────────────────────────────────────
function DeleteModal({ product, onClose, onConfirm }: { product: Product; onClose: () => void; onConfirm: () => Promise<void> }) {
  const [isDeleting, setIsDeleting] = useState(false);
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <motion.div initial={{ opacity: 0, scale: 0.92, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0 }}
        className="relative bg-[#131a2e] border border-white/10 rounded-3xl p-6 max-w-sm w-full shadow-2xl">
        <div className="flex items-center gap-4 mb-4">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/15 flex items-center justify-center shrink-0">
            <Trash2 size={22} className="text-rose-400" />
          </div>
          <div>
            <h3 className="font-bold text-lg">ยืนยันการลบสินค้า</h3>
            <p className="text-sm text-gray-500">สูตรทั้งหมดจะถูกลบด้วย</p>
          </div>
        </div>
        <div className="bg-white/5 rounded-2xl p-4 mb-5 border border-white/5 flex items-center gap-3">
          {product.imageUrl && <img src={product.imageUrl} className="w-12 h-12 rounded-xl object-cover shrink-0" alt="" />}
          <div>
            <p className="font-bold text-sm">{product.name}</p>
            <p className="text-xs text-gray-500">฿{product.price} · {product.recipes.length} ส่วนผสม · {product._count.orderItems} ยอดขาย</p>
          </div>
        </div>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 py-3 rounded-2xl bg-white/5 hover:bg-white/10 text-sm font-bold transition-all">ยกเลิก</button>
          <motion.button whileTap={{ scale: 0.97 }} disabled={isDeleting}
            onClick={async () => { setIsDeleting(true); await onConfirm(); setIsDeleting(false); }}
            className="flex-1 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50 transition-all">
            {isDeleting ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}ลบสินค้า
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────
export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [ingredients, setIngredients] = useState<Ingredient[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [modal, setModal] = useState<'add' | 'edit' | 'delete' | 'recipe' | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' } | null>(null);

  const showToast = (msg: string, type: 'success' | 'error' = 'success') => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchAll = async () => {
    try {
      const [prodRes, ingRes] = await Promise.all([
        fetch('http://localhost:5001/api/products'),
        fetch('http://localhost:5001/api/products/ingredients'),
      ]);
      setProducts(await prodRes.json());
      setIngredients(await ingRes.json());
    } catch (e) { console.error(e); }
    finally { setIsLoading(false); }
  };

  useEffect(() => { fetchAll(); }, []);

  const filteredProducts = products.filter(p => {
    const matchCat = activeCategory === 'ทั้งหมด' || p.category === activeCategory;
    const matchSearch = !search || p.name.toLowerCase().includes(search.toLowerCase()) || (p.description || '').toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const handleSave = async (data: any) => {
    if (modal === 'edit' && selectedProduct) {
      const res = await fetch(`http://localhost:5001/api/products/${selectedProduct.id}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const updated = await res.json();
      setProducts(prev => prev.map(p => p.id === updated.id ? updated : p));
      showToast(`อัปเดต "${updated.name}" สำเร็จ`);
    } else {
      const res = await fetch('http://localhost:5001/api/products', {
        method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error();
      const created = await res.json();
      setProducts(prev => [created, ...prev]);
      showToast(`เพิ่ม "${created.name}" สำเร็จ`);
    }
  };

  const handleDelete = async () => {
    if (!selectedProduct) return;
    const res = await fetch(`http://localhost:5001/api/products/${selectedProduct.id}`, { method: 'DELETE' });
    if (!res.ok) { showToast('ลบไม่สำเร็จ', 'error'); return; }
    setProducts(prev => prev.filter(p => p.id !== selectedProduct.id));
    showToast(`ลบ "${selectedProduct.name}" สำเร็จ`);
    setModal(null);
  };

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="px-10 pt-10 pb-6 shrink-0">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <Coffee size={24} className="text-amber-400" /> จัดการสินค้า
            </h2>
            <p className="text-gray-500 text-sm mt-1">
              ทั้งหมด {products.length} รายการ • {products.filter(p => p.recipes.length > 0).length} มีสูตรสินค้าแล้ว
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.02, boxShadow: '0 0 20px rgba(217,119,6,0.3)' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => { setSelectedProduct(null); setModal('add'); }}
            className="flex items-center gap-2 px-5 py-3 bg-amber-600 rounded-2xl text-sm font-bold shadow-lg shadow-amber-600/20 transition-all"
          >
            <Plus size={18} /> เพิ่มสินค้าใหม่
          </motion.button>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          {/* Search */}
          <div className="relative flex-1 max-w-xs">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" />
            <input value={search} onChange={e => setSearch(e.target.value)}
              placeholder="ค้นหาสินค้า..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-amber-500/40 placeholder:text-gray-600" />
          </div>
          {/* Category Pills */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            {CATEGORIES.map(cat => (
              <motion.button key={cat} whileTap={{ scale: 0.95 }}
                onClick={() => setActiveCategory(cat)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap border transition-all ${
                  activeCategory === cat
                    ? 'bg-amber-500/20 border-amber-500/40 text-amber-400'
                    : 'bg-white/5 border-white/5 text-gray-500 hover:text-white'
                }`}>
                {cat}
              </motion.button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="flex-1 overflow-y-auto px-10 pb-10 no-scrollbar">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 size={32} className="animate-spin text-amber-400" />
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <Coffee size={32} className="text-gray-700 mb-3" />
            <p className="text-gray-400 font-bold">ไม่พบสินค้า</p>
            <p className="text-xs text-gray-600 mt-1">{search ? 'ลองค้นหาคำอื่น' : 'กดปุ่มเพิ่มสินค้าใหม่'}</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-5">
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product, idx) => (
                <motion.div key={product.id} layout
                  initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0, transition: { delay: idx * 0.05 } }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="admin-card overflow-hidden group hover:border-amber-500/30 transition-all cursor-default flex flex-col"
                >
                  {/* Product Image */}
                  <div className="relative h-40 overflow-hidden bg-white/5">
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Coffee size={40} className="text-gray-700" />
                      </div>
                    )}
                    {/* Category Badge */}
                    <div className={`absolute top-2.5 left-2.5 px-2 py-1 rounded-lg text-[10px] font-bold border backdrop-blur-sm ${CATEGORY_COLORS[product.category] || 'text-gray-400 bg-white/10 border-white/10'}`}>
                      {product.category}
                    </div>
                    {/* Action Buttons */}
                    <div className="absolute top-2.5 right-2.5 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => { setSelectedProduct(product); setModal('recipe'); }}
                        className="w-7 h-7 rounded-lg bg-indigo-600/80 backdrop-blur-sm flex items-center justify-center text-white"
                        title="จัดการสูตร">
                        <FlaskConical size={13} />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => { setSelectedProduct(product); setModal('edit'); }}
                        className="w-7 h-7 rounded-lg bg-white/60 backdrop-blur-sm flex items-center justify-center text-gray-800"
                        title="แก้ไข">
                        <Edit2 size={13} />
                      </motion.button>
                      <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}
                        onClick={() => { setSelectedProduct(product); setModal('delete'); }}
                        className="w-7 h-7 rounded-lg bg-rose-600/80 backdrop-blur-sm flex items-center justify-center text-white"
                        title="ลบ">
                        <Trash2 size={13} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Product Info */}
                  <div className="p-4 flex-1 flex flex-col">
                    <h4 className="font-bold text-sm leading-tight mb-1">{product.name}</h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 flex-1">
                      {product.description || 'ไม่มีคำอธิบาย'}
                    </p>

                    {/* Stats Row */}
                    <div className="flex items-center gap-3 mt-3 pt-3 border-t border-white/5">
                      <span className="text-lg font-black text-amber-400">฿{product.price}</span>
                      <div className="flex items-center gap-1.5 ml-auto">
                        {product.recipes.length > 0 ? (
                          <span className="text-[10px] flex items-center gap-1 text-indigo-400 bg-indigo-500/10 px-2 py-1 rounded-lg border border-indigo-500/20">
                            <FlaskConical size={10} /> {product.recipes.length} ส่วนผสม
                          </span>
                        ) : (
                          <span className="text-[10px] text-gray-600 bg-white/5 px-2 py-1 rounded-lg">ยังไม่มีสูตร</span>
                        )}
                        <span className="text-[10px] flex items-center gap-1 text-gray-500">
                          <ShoppingBag size={10} /> {product._count.orderItems}
                        </span>
                      </div>
                    </div>

                    {/* Recipe Summary */}
                    {product.recipes.length > 0 && (
                      <div className="mt-2 flex flex-wrap gap-1">
                        {product.recipes.slice(0, 3).map(r => (
                          <span key={r.id} className="text-[9px] text-gray-600 bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/5">
                            {r.ingredient.name} {r.quantity}{r.ingredient.unit}
                          </span>
                        ))}
                        {product.recipes.length > 3 && (
                          <span className="text-[9px] text-gray-600 bg-white/[0.03] px-2 py-0.5 rounded-md border border-white/5">
                            +{product.recipes.length - 3} อีก
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* Modals */}
      <AnimatePresence>
        {(modal === 'add' || modal === 'edit') && (
          <ProductModal
            product={modal === 'edit' ? selectedProduct : null}
            onClose={() => setModal(null)}
            onSave={handleSave}
          />
        )}
        {modal === 'delete' && selectedProduct && (
          <DeleteModal
            product={selectedProduct}
            onClose={() => setModal(null)}
            onConfirm={handleDelete}
          />
        )}
        {modal === 'recipe' && selectedProduct && (
          <RecipePanel
            product={selectedProduct}
            ingredients={ingredients}
            onClose={() => setModal(null)}
            onRefresh={fetchAll}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
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
