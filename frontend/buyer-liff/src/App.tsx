import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, ShoppingBag, ClipboardList, User, Search, MapPin, Clock, Star,
  ChevronRight, Plus, Minus, X, Check, Heart, Sparkles, Coffee, Loader2,
  ArrowLeft, QrCode, Banknote, CreditCard, Truck, Store as StoreIcon,
  Gift, Settings, LogOut, Bell, Phone, RefreshCw, Receipt, ChevronDown
} from 'lucide-react';
import { useLiff } from './hooks/useLiff';

const API = 'http://localhost:5001/api';
const C = { bg:'#fdf8f0', card:'#ffffff', border:'#e8d5c0', accent:'#b8956a', dark:'#3d2d1a', mid:'#7a5c3a', light:'#f5ebe0', muted:'#9c7a50' };

// ─── Types ─────────────────────────────────────────────────────────────────
interface Category { id:string; name:string; icon?:string; _count:{products:number}; }
interface MenuOption { id:string; label:string; priceAddon:number; isDefault:boolean; }
interface OptionGroup { id:string; name:string; isRequired:boolean; maxSelect:number; options:MenuOption[]; }
interface MenuItem { id:string; name:string; description?:string; price:number; imageUrl?:string; status:string; tags:string; category?:Category; optionGroups:OptionGroup[]; }
interface Branch { id:string; name:string; address?:string; latitude?:number; longitude?:number; isOpen:boolean; openTime?:string; closeTime?:string; _count:{orders:number}; }
interface CartItem { menuItem:MenuItem; quantity:number; selectedOptions:Record<string,MenuOption[]>; note:string; unitTotal:number; }
interface Order { id:string; orderNo:string; status:string; totalAmount:number; items:any[]; payment?:any; createdAt:string; branch?:Branch; }

const STATUS_CFG:Record<string,{label:string;color:string;bg:string;step:number}> = {
  PENDING:   {label:'รอชำระเงิน',  color:'text-amber-700',   bg:'bg-amber-50',   step:0},
  PAID:      {label:'ชำระแล้ว',    color:'text-blue-700',    bg:'bg-blue-50',    step:1},
  PREPARING: {label:'กำลังทำ',     color:'text-indigo-700',  bg:'bg-indigo-50',  step:2},
  READY:     {label:'พร้อมรับ!',   color:'text-emerald-700', bg:'bg-emerald-50', step:3},
  COMPLETED: {label:'เสร็จสิ้น',  color:'text-green-700',   bg:'bg-green-50',   step:4},
  PICKED_UP: {label:'รับแล้ว',    color:'text-gray-600',    bg:'bg-gray-50',    step:5},
  CANCELLED: {label:'ยกเลิก',     color:'text-rose-700',    bg:'bg-rose-50',    step:-1},
};

const TAG_COLORS:Record<string,string> = {
  Bestseller:'bg-amber-100 text-amber-800', Recommended:'bg-blue-100 text-blue-700',
  New:'bg-emerald-100 text-emerald-700', Signature:'bg-rose-100 text-rose-700', Seasonal:'bg-purple-100 text-purple-700',
};

function parseTags(t:string):string[] { try{const p=JSON.parse(t);return Array.isArray(p)?p:[];}catch{return[];} }

// ─── Small components ──────────────────────────────────────────────────────
function PageHeader({title,onBack,right}:{title:string;onBack?:()=>void;right?:React.ReactNode}) {
  return (
    <header className="sticky top-0 z-30 flex items-center justify-between px-4 h-14 bg-white border-b" style={{borderColor:C.border}}>
      <div className="flex items-center gap-3">
        {onBack&&<button onClick={onBack} className="w-9 h-9 rounded-full flex items-center justify-center bg-gray-50"><ArrowLeft size={18} style={{color:C.dark}}/></button>}
        <h1 className="font-bold text-base" style={{color:C.dark}}>{title}</h1>
      </div>
      {right&&<div>{right}</div>}
    </header>
  );
}

function MenuCard({item,onSelect,onAddQuick}:{item:MenuItem;onSelect:()=>void;onAddQuick:()=>void}) {
  const tags=parseTags(item.tags);
  return (
    <motion.div whileTap={{scale:0.97}} onClick={onSelect} className="bg-white rounded-2xl overflow-hidden shadow-sm border" style={{borderColor:C.border}}>
      <div className="relative">
        <div className="h-36 overflow-hidden" style={{background:`linear-gradient(135deg,${C.light},${C.bg})`}}>
          {item.imageUrl?<img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover"/>
          :<div className="w-full h-full flex items-center justify-center"><Coffee size={36} style={{color:C.accent}}/></div>}
        </div>
        {tags.length>0&&<div className="absolute top-2 left-2 flex gap-1 flex-wrap">{tags.slice(0,2).map(t=><span key={t} className={`text-[9px] px-1.5 py-0.5 rounded-md font-bold ${TAG_COLORS[t]||'bg-gray-100 text-gray-600'}`}>{t}</span>)}</div>}
        {item.status!=='AVAILABLE'&&<div className="absolute inset-0 bg-white/70 flex items-center justify-center"><span className="text-xs font-bold text-gray-500 bg-white px-3 py-1 rounded-full border">หมดชั่วคราว</span></div>}
      </div>
      <div className="p-3">
        <p className="font-bold text-sm truncate" style={{color:C.dark}}>{item.name}</p>
        {item.description&&<p className="text-[10px] mt-0.5 line-clamp-2" style={{color:C.muted}}>{item.description}</p>}
        <div className="flex items-center justify-between mt-2">
          <span className="font-extrabold text-base" style={{color:C.accent}}>฿{item.price}</span>
          {item.status==='AVAILABLE'&&(
            <motion.button whileTap={{scale:0.9}} onClick={e=>{e.stopPropagation();onAddQuick();}}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white shadow-md" style={{background:C.accent}}>
              <Plus size={16}/>
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Menu Detail Sheet ─────────────────────────────────────────────────────
function MenuDetailSheet({item,onClose,onAddToCart}:{item:MenuItem;onClose:()=>void;onAddToCart:(item:MenuItem,qty:number,opts:Record<string,MenuOption[]>,note:string)=>void}) {
  const [qty,setQty]=useState(1);
  const [selected,setSelected]=useState<Record<string,MenuOption[]>>({});
  const [note,setNote]=useState('');

  const toggleOption=(group:OptionGroup,opt:MenuOption)=>{
    setSelected(prev=>{
      const cur=prev[group.id]||[];
      if(group.maxSelect===1){return {...prev,[group.id]:[opt]};}
      const exists=cur.find(o=>o.id===opt.id);
      if(exists){return {...prev,[group.id]:cur.filter(o=>o.id!==opt.id)};}
      if(cur.length>=group.maxSelect)return {...prev,[group.id]:[...cur.slice(1),opt]};
      return {...prev,[group.id]:[...cur,opt]};
    });
  };

  const optionsTotal=Object.values(selected).flat().reduce((s,o)=>s+o.priceAddon,0);
  const total=(item.price+optionsTotal)*qty;

  useEffect(()=>{
    item.optionGroups.forEach(g=>{
      const def=g.options.find(o=>o.isDefault);
      if(def)setSelected(p=>({...p,[g.id]:[def]}));
    });
  },[item]);

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex flex-col justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose}/>
      <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring',damping:30,stiffness:350}}
        className="relative bg-white rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden">
        {/* Header image */}
        <div className="h-48 shrink-0" style={{background:`linear-gradient(135deg,${C.light},${C.bg})`}}>
          {item.imageUrl?<img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover"/>
          :<div className="w-full h-full flex items-center justify-center"><Coffee size={56} style={{color:C.accent}}/></div>}
          <button onClick={onClose} className="absolute top-4 right-4 w-9 h-9 rounded-full bg-white/90 flex items-center justify-center shadow-md"><X size={18} style={{color:C.dark}}/></button>
        </div>
        {/* Content */}
        <div className="flex-1 overflow-y-auto p-5 space-y-5 no-scrollbar">
          <div className="flex items-start justify-between">
            <div className="flex-1"><h2 className="font-bold text-xl" style={{color:C.dark}}>{item.name}</h2>{item.description&&<p className="text-sm mt-1" style={{color:C.muted}}>{item.description}</p>}</div>
            <span className="font-extrabold text-xl ml-3" style={{color:C.accent}}>฿{item.price}</span>
          </div>

          {/* Option groups */}
          {item.optionGroups.map(group=>(
            <div key={group.id}>
              <div className="flex items-center gap-2 mb-2">
                <p className="font-bold text-sm" style={{color:C.dark}}>{group.name}</p>
                {group.isRequired&&<span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">จำเป็น</span>}
                <span className="text-[9px]" style={{color:C.muted}}>เลือกได้ {group.maxSelect}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.options.map(opt=>{
                  const isSelected=(selected[group.id]||[]).some(o=>o.id===opt.id);
                  return (
                    <motion.button key={opt.id} whileTap={{scale:0.95}} onClick={()=>toggleOption(group,opt)}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-all ${isSelected?'text-white border-transparent':'border-gray-200 text-gray-600'}`}
                      style={isSelected?{background:C.accent}:{}}>
                      {opt.label}{opt.priceAddon>0?` +฿${opt.priceAddon}`:''}
                    </motion.button>
                  );
                })}
              </div>
            </div>
          ))}

          {/* Note */}
          <div>
            <p className="font-bold text-sm mb-2" style={{color:C.dark}}>หมายเหตุ</p>
            <input value={note} onChange={e=>setNote(e.target.value)} placeholder="เช่น ไม่ใส่น้ำแข็ง, ใส่ถุงให้ด้วย..." className="w-full border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200" style={{borderColor:C.border}}/>
          </div>
        </div>

        {/* Footer */}
        <div className="p-5 pb-8 border-t" style={{borderColor:C.border}}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <motion.button whileTap={{scale:0.9}} onClick={()=>setQty(q=>Math.max(1,q-1))} className="w-10 h-10 rounded-full border-2 flex items-center justify-center font-bold" style={{borderColor:C.accent,color:C.accent}}><Minus size={16}/></motion.button>
              <span className="font-bold text-xl w-6 text-center" style={{color:C.dark}}>{qty}</span>
              <motion.button whileTap={{scale:0.9}} onClick={()=>setQty(q=>q+1)} className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold" style={{background:C.accent}}><Plus size={16}/></motion.button>
            </div>
            <p className="font-extrabold text-lg" style={{color:C.dark}}>฿{total}</p>
          </div>
          <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={()=>{onAddToCart(item,qty,selected,note);onClose();}}
            className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg flex items-center justify-center gap-2" style={{background:C.accent}}>
            <ShoppingBag size={20}/>เพิ่มลงตะกร้า · ฿{total}
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── HOME PAGE ─────────────────────────────────────────────────────────────
function HomePage({cart,onNavigate,onSelectBranch,user}:{cart:CartItem[];onNavigate:(p:string)=>void;onSelectBranch:(b:Branch)=>void;user:any}) {
  const [branches,setBranches]=useState<Branch[]>([]);
  const [featured,setFeatured]=useState<MenuItem[]>([]);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState('');

  useEffect(()=>{
    Promise.all([fetch(`${API}/branches`).then(r=>r.json()),fetch(`${API}/menu`).then(r=>r.json())])
      .then(([b,m])=>{setBranches(b);setFeatured(m.slice(0,6));})
      .finally(()=>setLoading(false));
  },[]);

  const cartCount=cart.reduce((s,i)=>s+i.quantity,0);

  return (
    <div className="flex-1 overflow-y-auto no-scrollbar" style={{background:C.bg}}>
      {/* Header */}
      <div className="px-5 pt-6 pb-4" style={{background:`linear-gradient(135deg, ${C.accent}, ${C.mid})`}}>
        <div className="flex items-center justify-between mb-4">
          <div>
            <p className="text-white/80 text-xs">สวัสดี ☀️</p>
            <h1 className="text-white font-bold text-lg">{user?.displayName||'ลูกค้า'}</h1>
          </div>
          <div className="flex items-center gap-3">
            <button className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"><Bell size={18} className="text-white"/></button>
            {user?.pictureUrl?<img src={user.pictureUrl} alt="" className="w-9 h-9 rounded-full border-2 border-white/50"/>:<div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"><User size={18} className="text-white"/></div>}
          </div>
        </div>
        {/* Search bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{color:C.muted}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาเมนู, ร้านกาแฟ..." className="w-full bg-white rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none" style={{color:C.dark}}/>
        </div>
      </div>

      {loading?<div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin" style={{color:C.accent}}/></div>:(
        <div className="space-y-6 pb-24">
          {/* Banner */}
          <div className="mx-5 mt-5 rounded-3xl overflow-hidden h-36 relative shadow-md" style={{background:`linear-gradient(135deg, #5c4428, #9c7a50)`}}>
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <span className="text-white/80 text-xs font-medium">☕ โปรโมชัน</span>
              <h2 className="text-white font-bold text-xl">สั่งครบ ฿199</h2>
              <p className="text-white/80 text-sm">รับฟรี เครื่องดื่ม 1 แก้ว!</p>
            </div>
            <Coffee size={80} className="absolute right-4 top-4 text-white/20"/>
          </div>

          {/* Featured Menu */}
          <div>
            <div className="flex items-center justify-between px-5 mb-3">
              <h2 className="font-bold text-base" style={{color:C.dark}}>เมนูแนะนำ 🔥</h2>
              <button onClick={()=>onNavigate('menu')} className="text-xs font-bold" style={{color:C.accent}}>ดูทั้งหมด</button>
            </div>
            <div className="px-5 grid grid-cols-2 gap-3">
              {featured.map(m=>(
                <MenuCard key={m.id} item={m} onSelect={()=>onNavigate('menu')} onAddQuick={()=>onNavigate('menu')}/>
              ))}
            </div>
          </div>

          {/* Nearby branches */}
          <div>
            <div className="flex items-center justify-between px-5 mb-3">
              <h2 className="font-bold text-base" style={{color:C.dark}}>ร้านใกล้ฉัน 📍</h2>
            </div>
            <div className="space-y-3 px-5">
              {branches.filter(b=>b.isOpen).map(b=>(
                <motion.div key={b.id} whileTap={{scale:0.98}} onClick={()=>onSelectBranch(b)} className="bg-white rounded-2xl p-4 border flex items-center gap-3 shadow-sm" style={{borderColor:C.border}}>
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0" style={{background:C.light}}><Coffee size={22} style={{color:C.accent}}/></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate" style={{color:C.dark}}>{b.name}</p>
                    <div className="flex gap-2 mt-0.5 text-[10px]" style={{color:C.muted}}>
                      {b.address&&<span className="flex items-center gap-0.5"><MapPin size={9}/>{b.address.slice(0,25)}</span>}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`text-[9px] px-1.5 py-0.5 rounded font-bold ${b.isOpen?'bg-emerald-100 text-emerald-700':'bg-gray-100 text-gray-500'}`}>{b.isOpen?'🟢 เปิด':'🔴 ปิด'}</span>
                      {b.openTime&&<span className="text-[9px]" style={{color:C.muted}}>{b.openTime}–{b.closeTime}</span>}
                    </div>
                  </div>
                  <ChevronRight size={16} style={{color:C.accent}}/>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── MENU PAGE ─────────────────────────────────────────────────────────────
function MenuPage({onAddToCart,cart}:{onAddToCart:(item:MenuItem,qty:number,opts:Record<string,MenuOption[]>,note:string)=>void;cart:CartItem[]}) {
  const [categories,setCategories]=useState<Category[]>([]);
  const [items,setItems]=useState<MenuItem[]>([]);
  const [activeCat,setActiveCat]=useState<string|null>(null);
  const [selectedItem,setSelectedItem]=useState<MenuItem|null>(null);
  const [loading,setLoading]=useState(true);
  const [search,setSearch]=useState('');

  useEffect(()=>{
    Promise.all([fetch(`${API}/categories`).then(r=>r.json()),fetch(`${API}/menu`).then(r=>r.json())])
      .then(([cats,menu])=>{setCategories(cats);setItems(menu);})
      .finally(()=>setLoading(false));
  },[]);

  const filtered=items.filter(i=>{
    if(i.status==='HIDDEN')return false;
    if(activeCat&&i.category?.id!==activeCat)return false;
    if(search&&!i.name.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  });

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{background:C.bg}}>
      <div className="px-4 pt-5 pb-3 bg-white" style={{borderBottom:`1px solid ${C.border}`}}>
        <h1 className="font-bold text-lg mb-3" style={{color:C.dark}}>เมนูทั้งหมด ☕</h1>
        <div className="relative mb-3">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:C.muted}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาเมนู..." className="w-full border rounded-xl py-2.5 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200" style={{borderColor:C.border}}/>
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <button onClick={()=>setActiveCat(null)} className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${!activeCat?'text-white border-transparent':'border-gray-200'}`} style={!activeCat?{background:C.accent}:{color:C.mid}}>ทั้งหมด</button>
          {categories.map(cat=>(
            <button key={cat.id} onClick={()=>setActiveCat(cat.id)} className={`shrink-0 px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${activeCat===cat.id?'text-white border-transparent':'border-gray-200'}`} style={activeCat===cat.id?{background:C.accent}:{color:C.mid}}>
              {cat.icon} {cat.name}
            </button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {loading?<div className="flex justify-center py-12"><Loader2 size={28} className="animate-spin" style={{color:C.accent}}/></div>
        :filtered.length===0?<div className="flex flex-col items-center justify-center py-16"><Coffee size={40} className="mb-3" style={{color:C.accent}}/><p style={{color:C.muted}}>ไม่พบเมนู</p></div>
        :<div className="grid grid-cols-2 gap-3 pb-24">{filtered.map(m=><MenuCard key={m.id} item={m} onSelect={()=>setSelectedItem(m)} onAddQuick={()=>setSelectedItem(m)}/>)}</div>}
      </div>

      <AnimatePresence>{selectedItem&&<MenuDetailSheet item={selectedItem} onClose={()=>setSelectedItem(null)} onAddToCart={onAddToCart}/>}</AnimatePresence>
    </div>
  );
}

// ─── CART PAGE ──────────────────────────────────────────────────────────────
function CartPage({cart,onUpdateQty,onRemove,onCheckout,selectedBranch,setSelectedBranch}:{cart:CartItem[];onUpdateQty:(idx:number,q:number)=>void;onRemove:(idx:number)=>void;onCheckout:(method:string,type:string,note:string)=>void;selectedBranch:Branch|null;setSelectedBranch:(b:Branch|null)=>void}) {
  const [payMethod,setPayMethod]=useState('CASH');
  const [fulfillType,setFulfillType]=useState('PICKUP');
  const [note,setNote]=useState('');
  const [promo,setPromo]=useState('');
  const [showCheckout,setShowCheckout]=useState(false);
  const [isProcessing,setIsProcessing]=useState(false);
  const [branches,setBranches]=useState<Branch[]>([]);

  useEffect(()=>{fetch(`${API}/branches`).then(r=>r.json()).then(setBranches);},[]);

  const subtotal=cart.reduce((s,i)=>s+i.unitTotal,0);
  const discount=promo==='COFFEE10'?Math.round(subtotal*0.1):0;
  const total=subtotal-discount;

  const handleCheckout=async()=>{
    if(!selectedBranch){alert('กรุณาเลือกสาขา');return;}
    setIsProcessing(true);
    await new Promise(r=>setTimeout(r,800));
    onCheckout(payMethod,fulfillType,note);
    setIsProcessing(false);
    setShowCheckout(false);
  };

  if(cart.length===0)return(
    <div className="flex-1 flex flex-col items-center justify-center" style={{background:C.bg}}>
      <ShoppingBag size={56} className="mb-4" style={{color:C.accent,opacity:0.4}}/>
      <p className="font-bold text-lg" style={{color:C.dark}}>ตะกร้าว่างอยู่</p>
      <p className="text-sm mt-1" style={{color:C.muted}}>เพิ่มเมนูที่ชอบได้เลยครับ</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{background:C.bg}}>
      <PageHeader title={`ตะกร้าของฉัน (${cart.reduce((s,i)=>s+i.quantity,0)})`}/>
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar pb-32">
        {cart.map((item,idx)=>(
          <motion.div key={idx} layout className="bg-white rounded-2xl p-4 border shadow-sm" style={{borderColor:C.border}}>
            <div className="flex gap-3">
              <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0" style={{background:C.light}}>
                {item.menuItem.imageUrl?<img src={item.menuItem.imageUrl} alt="" className="w-full h-full object-cover"/>:<Coffee size={24} className="m-auto mt-4" style={{color:C.accent}}/>}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between">
                  <p className="font-bold text-sm truncate" style={{color:C.dark}}>{item.menuItem.name}</p>
                  <button onClick={()=>onRemove(idx)} className="shrink-0 ml-2"><X size={14} style={{color:C.muted}}/></button>
                </div>
                {Object.entries(item.selectedOptions).map(([gid,opts])=>opts.length>0&&(
                  <p key={gid} className="text-[10px] mt-0.5" style={{color:C.muted}}>{opts.map(o=>o.label).join(', ')}</p>
                ))}
                {item.note&&<p className="text-[10px] mt-0.5 italic" style={{color:C.muted}}>"{item.note}"</p>}
              </div>
            </div>
            <div className="flex items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <button onClick={()=>onUpdateQty(idx,item.quantity-1)} className="w-7 h-7 rounded-full border flex items-center justify-center" style={{borderColor:C.accent,color:C.accent}}><Minus size={12}/></button>
                <span className="font-bold text-sm w-5 text-center" style={{color:C.dark}}>{item.quantity}</span>
                <button onClick={()=>onUpdateQty(idx,item.quantity+1)} className="w-7 h-7 rounded-full flex items-center justify-center text-white" style={{background:C.accent}}><Plus size={12}/></button>
              </div>
              <span className="font-bold text-sm" style={{color:C.accent}}>฿{item.unitTotal}</span>
            </div>
          </motion.div>
        ))}

        {/* Branch selector */}
        <div className="bg-white rounded-2xl p-4 border shadow-sm" style={{borderColor:C.border}}>
          <p className="font-bold text-sm mb-2" style={{color:C.dark}}>เลือกสาขา</p>
          <select value={selectedBranch?.id||''} onChange={e=>{const b=branches.find(x=>x.id===e.target.value)||null;setSelectedBranch(b);}} className="w-full border rounded-xl py-2.5 px-4 text-sm focus:outline-none" style={{borderColor:C.border,color:C.dark}}>
            <option value="">-- เลือกสาขา --</option>
            {branches.filter(b=>b.isOpen).map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        {/* Promo */}
        <div className="bg-white rounded-2xl p-4 border shadow-sm" style={{borderColor:C.border}}>
          <p className="font-bold text-sm mb-2 flex items-center gap-1.5" style={{color:C.dark}}><Gift size={14} style={{color:C.accent}}/>คูปองส่วนลด</p>
          <div className="flex gap-2">
            <input value={promo} onChange={e=>setPromo(e.target.value.toUpperCase())} placeholder="กรอกโค้ด เช่น COFFEE10" className="flex-1 border rounded-xl py-2.5 px-4 text-sm focus:outline-none uppercase" style={{borderColor:C.border}}/>
            <button className="px-4 rounded-xl text-white text-sm font-bold" style={{background:C.accent}}>ใช้</button>
          </div>
          {discount>0&&<p className="text-xs text-emerald-600 font-bold mt-2">✅ ลด ฿{discount}</p>}
        </div>

        {/* Summary */}
        <div className="bg-white rounded-2xl p-4 border shadow-sm" style={{borderColor:C.border}}>
          <p className="font-bold text-sm mb-3" style={{color:C.dark}}>สรุปราคา</p>
          <div className="space-y-1.5 text-sm">
            <div className="flex justify-between"><span style={{color:C.muted}}>ราคารวม</span><span style={{color:C.dark}}>฿{subtotal}</span></div>
            {discount>0&&<div className="flex justify-between"><span className="text-emerald-600">ส่วนลด</span><span className="text-emerald-600">-฿{discount}</span></div>}
            <div className="flex justify-between border-t pt-2 font-bold text-base" style={{borderColor:C.border}}><span style={{color:C.dark}}>ยอดสุทธิ</span><span style={{color:C.accent}}>฿{total}</span></div>
          </div>
        </div>
      </div>

      {/* Checkout button */}
      <div className="fixed bottom-16 left-0 right-0 px-4 pb-4 bg-white border-t" style={{borderColor:C.border}}>
        <motion.button whileTap={{scale:0.97}} onClick={()=>setShowCheckout(true)}
          className="w-full py-4 rounded-2xl text-white font-bold text-base shadow-lg" style={{background:C.accent}}>
          ดำเนินการชำระเงิน · ฿{total}
        </motion.button>
      </div>

      {/* Checkout Sheet */}
      <AnimatePresence>{showCheckout&&(
        <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex flex-col justify-end">
          <div className="absolute inset-0 bg-black/50" onClick={()=>setShowCheckout(false)}/>
          <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring',damping:30,stiffness:350}} className="relative bg-white rounded-t-3xl p-5 pb-8 space-y-5">
            <h2 className="font-bold text-lg" style={{color:C.dark}}>เลือกวิธีชำระเงิน</h2>
            <div className="grid grid-cols-3 gap-2">
              {[{id:'CASH',label:'เงินสด',icon:Banknote},{id:'QR',label:'QR Code',icon:QrCode},{id:'TRANSFER',label:'โอน',icon:CreditCard}].map(m=>{
                const Icon=m.icon;return(
                  <button key={m.id} onClick={()=>setPayMethod(m.id)} className={`flex flex-col items-center gap-2 p-3 rounded-xl border-2 transition-all ${payMethod===m.id?'border-amber-600':'border-gray-200'}`} style={payMethod===m.id?{background:C.light}:{}}>
                    <Icon size={22} style={{color:payMethod===m.id?C.accent:'#999'}}/>
                    <span className="text-xs font-bold" style={{color:payMethod===m.id?C.accent:'#999'}}>{m.label}</span>
                  </button>);})}
            </div>
            <div>
              <p className="font-bold text-sm mb-2" style={{color:C.dark}}>วิธีรับสินค้า</p>
              <div className="grid grid-cols-2 gap-2">
                {[{id:'PICKUP',label:'รับที่ร้าน',icon:StoreIcon},{id:'DELIVERY',label:'จัดส่ง',icon:Truck}].map(t=>{
                  const Icon=t.icon;return(
                    <button key={t.id} onClick={()=>setFulfillType(t.id)} className={`flex items-center gap-2 p-3 rounded-xl border-2 transition-all ${fulfillType===t.id?'border-amber-600':'border-gray-200'}`} style={fulfillType===t.id?{background:C.light}:{}}>
                      <Icon size={18} style={{color:fulfillType===t.id?C.accent:'#999'}}/>
                      <span className="text-sm font-bold" style={{color:fulfillType===t.id?C.accent:'#999'}}>{t.label}</span>
                    </button>);})}
              </div>
            </div>
            <div><p className="font-bold text-sm mb-1.5" style={{color:C.dark}}>หมายเหตุเพิ่มเติม</p>
              <input value={note} onChange={e=>setNote(e.target.value)} placeholder="หมายเหตุถึงร้าน..." className="w-full border rounded-xl py-2.5 px-4 text-sm focus:outline-none" style={{borderColor:C.border}}/>
            </div>
            <div className="flex justify-between text-lg font-bold border-t pt-3" style={{borderColor:C.border}}>
              <span style={{color:C.dark}}>ยอดสุทธิ</span><span style={{color:C.accent}}>฿{total}</span>
            </div>
            <motion.button whileTap={{scale:0.97}} disabled={isProcessing} onClick={handleCheckout}
              className="w-full py-4 rounded-2xl text-white font-bold text-base disabled:opacity-60 flex items-center justify-center gap-2" style={{background:C.accent}}>
              {isProcessing?<><Loader2 size={18} className="animate-spin"/>กำลังสั่งซื้อ...</>:<><Check size={18}/>ยืนยันคำสั่งซื้อ</>}
            </motion.button>
          </motion.div>
        </motion.div>
      )}</AnimatePresence>
    </div>
  );
}

// ─── ORDERS PAGE ────────────────────────────────────────────────────────────
function OrdersPage({customerUid}:{customerUid:string}) {
  const [orders,setOrders]=useState<Order[]>([]);
  const [loading,setLoading]=useState(true);
  const [selected,setSelected]=useState<Order|null>(null);

  const fetchOrders=useCallback(()=>{
    fetch(`${API}/orders/customer/${customerUid}`).then(r=>r.json()).then(d=>{setOrders(d);}).finally(()=>setLoading(false));
  },[customerUid]);

  useEffect(()=>{fetchOrders();const t=setInterval(fetchOrders,10000);return()=>clearInterval(t);},[fetchOrders]);

  if(loading)return<div className="flex-1 flex items-center justify-center"><Loader2 size={28} className="animate-spin" style={{color:C.accent}}/></div>;

  if(selected)return(
    <div className="flex-1 flex flex-col overflow-hidden" style={{background:C.bg}}>
      <PageHeader title="รายละเอียดออเดอร์" onBack={()=>setSelected(null)}/>
      <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar pb-24">
        {/* Status */}
        <div className="bg-white rounded-2xl p-5 border shadow-sm" style={{borderColor:C.border}}>
          <div className="flex items-center justify-between mb-4">
            <div><p className="text-xs" style={{color:C.muted}}>{selected.orderNo}</p><p className="font-bold text-lg" style={{color:C.dark}}>฿{selected.totalAmount}</p></div>
            <span className={`px-3 py-1.5 rounded-xl text-xs font-bold ${STATUS_CFG[selected.status]?.bg||'bg-gray-50'} ${STATUS_CFG[selected.status]?.color||'text-gray-600'}`}>{STATUS_CFG[selected.status]?.label||selected.status}</span>
          </div>
          {/* Progress bar */}
          {selected.status!=='CANCELLED'&&(
            <div className="flex gap-1 mt-2">
              {['PENDING','PAID','PREPARING','READY','COMPLETED'].map((s,i)=>{
                const isActive=(STATUS_CFG[selected.status]?.step||0)>=i;
                return <div key={s} className="flex-1"><div className={`h-1.5 rounded-full transition-all ${isActive?'bg-amber-500':'bg-gray-100'}`}/></div>;
              })}
            </div>
          )}
          {(selected.status==='READY')&&<p className="text-sm font-bold text-emerald-600 mt-3 text-center animate-pulse">🔔 กาแฟคุณพร้อมแล้ว! รับได้เลยครับ</p>}
        </div>
        {/* Items */}
        <div className="bg-white rounded-2xl p-4 border shadow-sm" style={{borderColor:C.border}}>
          <p className="font-bold text-sm mb-3" style={{color:C.dark}}>รายการ ({selected.items?.length||0})</p>
          <div className="space-y-2">{selected.items?.map((it:any,i:number)=>(
            <div key={i} className="flex justify-between items-center text-sm">
              <span style={{color:C.dark}}>{it.productName||it.product?.name} ×{it.quantity}</span>
              <span className="font-bold" style={{color:C.accent}}>฿{it.price}</span>
            </div>
          ))}</div>
        </div>
        {/* Payment */}
        {selected.payment&&<div className="bg-white rounded-2xl p-4 border shadow-sm" style={{borderColor:C.border}}>
          <p className="font-bold text-sm mb-2" style={{color:C.dark}}>การชำระเงิน</p>
          <div className="flex justify-between text-sm">
            <span style={{color:C.muted}}>วิธีชำระ</span><span style={{color:C.dark}}>{selected.payment.method==='CASH'?'เงินสด':selected.payment.method==='QR'?'QR Code':'โอนเงิน'}</span>
          </div>
          <div className="flex justify-between text-sm mt-1">
            <span style={{color:C.muted}}>สถานะ</span><span className={selected.payment.status==='PAID'?'text-emerald-600 font-bold':'text-amber-600 font-bold'}>{selected.payment.status==='PAID'?'ชำระแล้ว':'รอชำระ'}</span>
          </div>
        </div>}
        <p className="text-center text-xs" style={{color:C.muted}}>{new Date(selected.createdAt).toLocaleString('th-TH')}</p>
      </div>
    </div>
  );

  return(
    <div className="flex-1 flex flex-col overflow-hidden" style={{background:C.bg}}>
      <PageHeader title="คำสั่งซื้อของฉัน" right={<button onClick={fetchOrders}><RefreshCw size={18} style={{color:C.accent}}/></button>}/>
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar pb-24">
        {orders.length===0?(
          <div className="flex flex-col items-center justify-center py-16"><ClipboardList size={48} className="mb-3" style={{color:C.accent,opacity:0.4}}/><p className="font-bold" style={{color:C.dark}}>ยังไม่มีคำสั่งซื้อ</p><p className="text-sm mt-1" style={{color:C.muted}}>สั่งเมนูแรกได้เลยครับ!</p></div>
        ):(
          <div className="space-y-3">{orders.map(o=>{
            const cfg=STATUS_CFG[o.status];
            return(
              <motion.div key={o.id} whileTap={{scale:0.97}} onClick={()=>setSelected(o)} className="bg-white rounded-2xl p-4 border shadow-sm" style={{borderColor:C.border}}>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-mono font-bold" style={{color:C.muted}}>{o.orderNo}</span>
                  <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold ${cfg?.bg||'bg-gray-50'} ${cfg?.color||'text-gray-600'}`}>{cfg?.label||o.status}</span>
                </div>
                <p className="font-bold text-sm mb-1" style={{color:C.dark}}>{o.items?.slice(0,2).map((i:any)=>i.productName||i.product?.name).join(', ')}{(o.items?.length||0)>2?` +${o.items.length-2} รายการ`:''}</p>
                <div className="flex justify-between items-center">
                  <span className="text-xs" style={{color:C.muted}}>{new Date(o.createdAt).toLocaleString('th-TH',{dateStyle:'short',timeStyle:'short'})}</span>
                  <span className="font-bold text-sm" style={{color:C.accent}}>฿{o.totalAmount}</span>
                </div>
                {o.status==='READY'&&<p className="text-xs font-bold text-emerald-600 mt-2 animate-pulse">🔔 พร้อมรับแล้ว!</p>}
              </motion.div>
            );
          })}</div>
        )}
      </div>
    </div>
  );
}

// ─── PROFILE PAGE ──────────────────────────────────────────────────────────
function ProfilePage({user}:{user:any}) {
  const menus=[{icon:Receipt,label:'ประวัติคำสั่งซื้อ'},{icon:Heart,label:'รายการโปรด'},{icon:Gift,label:'แต้มสะสม',sub:'120 แต้ม'},{icon:MapPin,label:'ที่อยู่ที่บันทึก'},{icon:Bell,label:'การแจ้งเตือน'},{icon:Settings,label:'ตั้งค่า'},{icon:Phone,label:'ติดต่อเรา'}];
  return(
    <div className="flex-1 overflow-y-auto no-scrollbar" style={{background:C.bg}}>
      <div className="px-5 pt-8 pb-6" style={{background:`linear-gradient(135deg, ${C.accent}, ${C.mid})`}}>
        <div className="flex items-center gap-4">
          {user?.pictureUrl?<img src={user.pictureUrl} alt="" className="w-16 h-16 rounded-full border-2 border-white/50 shadow-md"/>:<div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center"><User size={28} className="text-white"/></div>}
          <div>
            <h2 className="text-white font-bold text-lg">{user?.displayName||'ลูกค้า'}</h2>
            <p className="text-white/70 text-xs">{user?.userId?.slice(0,16)||'LINE User'}</p>
            <div className="flex items-center gap-1 mt-1"><span className="text-[10px] bg-white/20 text-white px-2 py-0.5 rounded-full">⭐ Member</span></div>
          </div>
        </div>
        {/* Point card */}
        <div className="mt-4 bg-white/20 rounded-2xl p-3 flex items-center justify-between">
          <div><p className="text-white/70 text-xs">แต้มสะสม</p><p className="text-white font-bold text-xl">120 <span className="text-sm font-normal">แต้ม</span></p></div>
          <div className="text-right"><p className="text-white/70 text-xs">อีก 80 แต้ม</p><p className="text-white/70 text-xs">= รับฟรี 1 แก้ว</p></div>
        </div>
      </div>
      <div className="p-4 pb-24 space-y-2">
        {menus.map((m,i)=>{const Icon=m.icon;return(
          <motion.button key={i} whileTap={{scale:0.97}} className="w-full bg-white rounded-2xl p-4 border flex items-center gap-3 shadow-sm text-left" style={{borderColor:C.border}}>
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{background:C.light}}><Icon size={18} style={{color:C.accent}}/></div>
            <div className="flex-1"><p className="font-bold text-sm" style={{color:C.dark}}>{m.label}</p>{m.sub&&<p className="text-xs" style={{color:C.muted}}>{m.sub}</p>}</div>
            <ChevronRight size={16} style={{color:C.muted}}/>
          </motion.button>
        );})}
        <div className="pt-2">
          <button className="w-full bg-rose-50 border border-rose-200 rounded-2xl p-4 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-rose-100 flex items-center justify-center"><LogOut size={18} className="text-rose-600"/></div>
            <span className="font-bold text-sm text-rose-600">ออกจากระบบ</span>
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function App() {
  const {user,isLiffLoading}=useLiff();
  const [tab,setTab]=useState<'home'|'menu'|'cart'|'orders'|'profile'>('home');
  const [cart,setCart]=useState<CartItem[]>([]);
  const [selectedBranch,setSelectedBranch]=useState<Branch|null>(null);
  const [justOrdered,setJustOrdered]=useState(false);

  const addToCart=(item:MenuItem,qty:number,opts:Record<string,MenuOption[]>,note:string)=>{
    const optionsPrice=Object.values(opts).flat().reduce((s,o)=>s+o.priceAddon,0);
    const unitTotal=(item.price+optionsPrice)*qty;
    setCart(prev=>{
      const existing=prev.findIndex(c=>c.menuItem.id===item.id&&JSON.stringify(c.selectedOptions)===JSON.stringify(opts)&&c.note===note);
      if(existing>=0){
        const updated=[...prev];
        updated[existing]={...updated[existing],quantity:updated[existing].quantity+qty,unitTotal:updated[existing].unitTotal+unitTotal};
        return updated;
      }
      return [...prev,{menuItem:item,quantity:qty,selectedOptions:opts,note,unitTotal}];
    });
  };

  const updateQty=(idx:number,q:number)=>{
    if(q<=0){setCart(prev=>prev.filter((_,i)=>i!==idx));return;}
    setCart(prev=>{const u=[...prev];const item=u[idx];const optPx=Object.values(item.selectedOptions).flat().reduce((s,o)=>s+o.priceAddon,0);u[idx]={...item,quantity:q,unitTotal:(item.menuItem.price+optPx)*q};return u;});
  };

  const handleCheckout=async(method:string,type:string,note:string)=>{
    if(!selectedBranch||cart.length===0)return;
    const total=cart.reduce((s,i)=>s+i.unitTotal,0);
    await fetch(`${API}/orders`,{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        branchId:selectedBranch.id,customerUid:user?.userId||'walk-in',customerName:user?.displayName,
        totalAmount:total,fulfillmentType:type,paymentMethod:method,note,
        items:cart.map(i=>({productId:i.menuItem.id,productName:i.menuItem.name,quantity:i.quantity,unitPrice:i.menuItem.price,optionsPrice:Object.values(i.selectedOptions).flat().reduce((s,o)=>s+o.priceAddon,0),price:i.unitTotal/i.quantity,selectedOptions:Object.values(i.selectedOptions).flat()})),
      }),
    });
    setCart([]);setJustOrdered(true);setTab('orders');
    setTimeout(()=>setJustOrdered(false),3000);
  };

  const cartCount=cart.reduce((s,i)=>s+i.quantity,0);
  const TABS=[{id:'home',icon:Home,label:'หน้าแรก'},{id:'menu',icon:Coffee,label:'เมนู'},{id:'cart',icon:ShoppingBag,label:'ตะกร้า',badge:cartCount},{id:'orders',icon:ClipboardList,label:'ออเดอร์'},{id:'profile',icon:User,label:'โปรไฟล์'}] as const;

  if(isLiffLoading)return(
    <div className="min-h-screen flex flex-col items-center justify-center" style={{background:C.bg}}>
      <Coffee size={48} className="mb-4" style={{color:C.accent}}/><Loader2 size={24} className="animate-spin" style={{color:C.accent}}/>
      <p className="mt-3 text-sm" style={{color:C.muted}}>กำลังโหลด...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative overflow-hidden" style={{background:C.bg}}>
      {/* Success toast */}
      <AnimatePresence>{justOrdered&&(
        <motion.div initial={{opacity:0,y:-50}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-50}} className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-emerald-600 text-white px-6 py-3 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-2">
          <Check size={16}/>สั่งซื้อสำเร็จ! กำลังทำให้คุณ ☕
        </motion.div>
      )}</AnimatePresence>

      {/* Page content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{opacity:0,x:10}} animate={{opacity:1,x:0}} exit={{opacity:0,x:-10}} transition={{duration:0.15}} className="flex-1 flex flex-col overflow-hidden">
            {tab==='home'&&<HomePage cart={cart} onNavigate={p=>setTab(p as any)} onSelectBranch={b=>{setSelectedBranch(b);setTab('menu');}} user={user}/>}
            {tab==='menu'&&<MenuPage onAddToCart={addToCart} cart={cart}/>}
            {tab==='cart'&&<CartPage cart={cart} onUpdateQty={updateQty} onRemove={idx=>setCart(p=>p.filter((_,i)=>i!==idx))} onCheckout={handleCheckout} selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch}/>}
            {tab==='orders'&&<OrdersPage customerUid={user?.userId||'walk-in'}/>}
            {tab==='profile'&&<ProfilePage user={user}/>}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white border-t z-40" style={{borderColor:C.border}}>
        <div className="flex">
          {TABS.map(t=>{
            const Icon=t.icon;const isActive=tab===t.id;
            return(
              <button key={t.id} onClick={()=>setTab(t.id)} className="flex-1 flex flex-col items-center justify-center py-2 pb-3 relative">
                <div className="relative">
                  <Icon size={22} style={{color:isActive?C.accent:'#aaa'}}/>
                  {'badge' in t&&t.badge>0&&<span className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">{t.badge}</span>}
                </div>
                <span className="text-[10px] mt-0.5 font-medium" style={{color:isActive?C.accent:'#aaa'}}>{t.label}</span>
                {isActive&&<motion.div layoutId="tab-indicator" className="absolute bottom-0 left-1/2 -translate-x-1/2 w-6 h-0.5 rounded-full" style={{background:C.accent}}/>}
              </button>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
