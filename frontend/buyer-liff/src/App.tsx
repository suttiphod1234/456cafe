import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart3, Users, Coffee, ShoppingBag, Store, TrendingUp, Bell, Search, 
  MapPin, Heart, Clock, User, ChevronRight, X, Minus, Plus, ShoppingCart, 
  CreditCard, Truck, MessageSquare, Star, Gift, Settings, LogOut, 
  RefreshCw, Receipt, ChevronDown, CheckCircle2, History, Home, Briefcase,
  Phone, ClipboardList, ArrowLeft, QrCode, Banknote, Sparkles, Loader2, Store as StoreIcon
} from 'lucide-react';
import { useLiff } from './hooks/useLiff';
import AuthModal from './components/AuthModal';

const API = 'http://localhost:5001/api';
const C = { bg:'#fdf8f0', card:'#ffffff', border:'#e8d5c0', accent:'#b8956a', dark:'#3d2d1a', mid:'#7a5c3a', light:'#f5ebe0', muted:'#9c7a50' };

// ─── Types ─────────────────────────────────────────────────────────────────
interface Category { id:string; name:string; icon?:string; _count:{products:number}; }
interface MenuOption { id:string; label:string; priceAddon:number; isDefault:boolean; }
interface OptionGroup { id:string; name:string; isRequired:boolean; maxSelect:number; options:MenuOption[]; }
interface MenuItem { id:string; name:string; description?:string; price:number; imageUrl?:string; status:string; tags:string; category?:Category; optionGroups:OptionGroup[]; }
interface Branch { id:string; name:string; address?:string; latitude?:number; longitude?:number; isOpen:boolean; openTime?:string; closeTime?:string; _count:{orders:number}; }
interface CartItem { menuItem:MenuItem; quantity:number; selectedOptions:Record<string,MenuOption[]>; note:string; unitTotal:number; }
interface Order { id:string; orderNo:string; queueNo?:number; status:string; totalAmount:number; items:any[]; payment?:any; createdAt:string; branch?:Branch; }

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
        className="relative bg-white rounded-t-3xl max-h-[90vh] flex flex-col overflow-hidden shadow-2xl">
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
  const [loading,setLoading]=setLoading(true);
  const [search,setSearch]=useState('');

  useEffect(()=>{
    Promise.all([fetch(`${API}/branches`).then(r=>r.json()),fetch(`${API}/menu`).then(r=>r.json())])
      .then(([b,m])=>{setBranches(b);setFeatured(m.slice(0,6));})
      .finally(()=>setLoading(false));
  },[]);

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
            {user?.pictureUrl?<img src={user.pictureUrl} alt="" className="w-9 h-9 rounded-full border-2 border-white/50 shadow-md"/>:<div className="w-9 h-9 rounded-full bg-white/20 flex items-center justify-center"><User size={18} className="text-white"/></div>}
          </div>
        </div>
        {/* Search bar */}
        <div className="relative">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{color:C.muted}}/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาเมนู..." className="w-full bg-white rounded-2xl py-3 pl-10 pr-4 text-sm focus:outline-none shadow-inner" style={{color:C.dark}}/>
        </div>
      </div>

      {loading?<div className="flex justify-center py-16"><Loader2 size={28} className="animate-spin" style={{color:C.accent}}/></div>:(
        <div className="space-y-6 pb-24">
          {/* Banner */}
          <div className="mx-5 mt-5 rounded-3xl overflow-hidden h-36 relative shadow-lg" style={{background:`linear-gradient(135deg, #5c4428, #9c7a50)`}}>
            <div className="absolute inset-0 p-5 flex flex-col justify-end">
              <span className="text-white/80 text-xs font-bold tracking-wider mb-1">PROMOTION</span>
              <h2 className="text-white font-black text-2xl">สั่งครบ ฿199</h2>
              <p className="text-white/80 text-sm font-medium">รับฟรี เครื่องดื่ม Signature 1 แก้ว!</p>
            </div>
            <Coffee size={100} className="absolute -right-4 -top-4 text-white/10 rotate-12"/>
          </div>

          {/* Featured Menu */}
          <div>
            <div className="flex items-center justify-between px-5 mb-3">
              <h2 className="font-black text-[#3d2d1a] text-base flex items-center gap-2">เมนูแนะนำ <Sparkles size={16} className="text-amber-500 animate-pulse"/></h2>
              <button onClick={()=>onNavigate('menu')} className="text-xs font-bold text-[#b8956a]">ดูทั้งหมด</button>
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
              <h2 className="font-black text-[#3d2d1a] text-base">ร้านใกล้ฉัน 📍</h2>
            </div>
            <div className="space-y-3 px-5">
              {branches.filter(b=>b.isOpen).map(b=>(
                <motion.div key={b.id} whileTap={{scale:0.98}} onClick={()=>onSelectBranch(b)} className="bg-white rounded-2xl p-4 border border-[#f5ebe0] flex items-center gap-3 shadow-sm active:shadow-inner transition-all">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0 bg-amber-50 text-[#b8956a] shadow-inner"><Coffee size={22}/></div>
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate text-[#3d2d1a]">{b.name}</p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-gray-400 font-medium">
                      <MapPin size={10}/> <span className="truncate">{b.address || 'Location details'}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className={`text-[9px] px-2 py-0.5 rounded-full font-black ${b.isOpen?'bg-emerald-50 text-emerald-600 border border-emerald-100':'bg-gray-100 text-gray-500'}`}>{b.isOpen?'OPEN':'CLOSED'}</span>
                      {b.openTime&&<span className="text-[9px] font-bold text-gray-400">{b.openTime}–{b.closeTime}</span>}
                    </div>
                  </div>
                  <ChevronRight size={18} className="text-[#e8d5c0]"/>
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
      <div className="px-4 pt-5 pb-3 bg-white border-b border-[#f5ebe0] shadow-sm">
        <h1 className="font-black text-xl text-[#3d2d1a] mb-4 flex items-center gap-2 italic">OUR MENU ☕</h1>
        <div className="relative mb-4">
          <Search size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"/>
          <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาเครื่องดื่มที่คุณต้องการ..." className="w-full bg-gray-50 border border-gray-100 rounded-2xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-200/50 shadow-inner" />
        </div>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          <motion.button whileTap={{scale:0.95}} onClick={()=>setActiveCat(null)} className={`shrink-0 px-5 py-2 rounded-full text-xs font-bold border transition-all ${!activeCat?'bg-[#b8956a] text-white border-transparent shadow-md shadow-amber-900/20':'bg-white border-[#f5ebe0] text-[#7a5c3a]'}`}>ทั้งหมด</motion.button>
          {categories.map(cat=>(
            <motion.button key={cat.id} whileTap={{scale:0.95}} onClick={()=>setActiveCat(cat.id)} className={`shrink-0 px-5 py-2 rounded-full text-xs font-bold border transition-all ${activeCat===cat.id?'bg-[#b8956a] text-white border-transparent shadow-md shadow-amber-900/20':'bg-white border-[#f5ebe0] text-[#7a5c3a]'}`}>
              {cat.icon} {cat.name}
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 no-scrollbar">
        {loading?<div className="flex justify-center py-20"><Loader2 size={32} className="animate-spin text-[#b8956a]"/></div>
        :filtered.length===0?<div className="flex flex-col items-center justify-center py-20 opacity-30"><Coffee size={64} className="mb-4 text-[#b8956a]"/><p className="font-black">ไม่พบเมนูที่ค้นหา</p></div>
        :<div className="grid grid-cols-2 gap-4 pb-32">{filtered.map(m=><MenuCard key={m.id} item={m} onSelect={()=>setSelectedItem(m)} onAddQuick={()=>setSelectedItem(m)}/>)}</div>}
      </div>

      <AnimatePresence>{selectedItem&&<MenuDetailSheet item={selectedItem} onClose={()=>setSelectedItem(null)} onAddToCart={onAddToCart}/>}</AnimatePresence>
    </div>
  );
}

// ─── CART PAGE ──────────────────────────────────────────────────────────────
function CartPage({cart,onUpdateQty,onRemove,onCheckout,selectedBranch,setSelectedBranch,setIsAuthModalOpen,setTempCheckoutData,member,setIsAddressFormOpen}:{cart:CartItem[],onUpdateQty:(i:number,q:number)=>void,onRemove:(i:number)=>void,onCheckout:(m:string,t:string,n:string,addr?:string)=>void,selectedBranch:Branch|null,setSelectedBranch:(b:Branch|null)=>void,setIsAuthModalOpen:(o:boolean)=>void,setTempCheckoutData:(d:any)=>void,member:any,setIsAddressFormOpen:(o:boolean)=>void}){
  const [payMethod,setPayMethod]=useState('QR');
  const [fulfillType,setFulfillType]=useState('PICKUP');
  const [note,setNote]=useState('');
  const [showBranches,setShowBranches]=useState(false);
  const [showCheckout,setShowCheckout]=useState(false);
  const [isProcessing,setIsProcessing]=useState(false);
  const [branches,setBranches]=useState<Branch[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<any>(member?.addresses?.find((a:any)=>a.isDefault) || null);
  const [showAddressPicker, setShowAddressPicker] = useState(false);

  useEffect(()=>{fetch(`${API}/branches`).then(r=>r.json()).then(setBranches);},[]);
  const total=cart.reduce((s,i)=>s+i.unitTotal,0);

  const handleCheckout=async()=>{
    if(!selectedBranch){alert('กรุณาเลือกสาขา');return;}
    if(fulfillType==='DELIVERY' && !selectedAddress) { alert('กรุณาระบุที่อยู่จัดส่ง'); return; }
    
    if (!localStorage.getItem('memberId')) {
       setIsAuthModalOpen(true);
       setTempCheckoutData({ payMethod, fulfillType, note });
       return;
    }

    setIsProcessing(true);
    await new Promise(r=>setTimeout(r,800));
    onCheckout(payMethod,fulfillType,note, selectedAddress?.address);
    setIsProcessing(false);
    setShowCheckout(false);
  };

  if(cart.length===0)return(
    <div className="flex-1 flex flex-col items-center justify-center -mt-20" style={{background:C.bg}}>
      <div className="w-24 h-24 rounded-[2rem] bg-amber-50 flex items-center justify-center mb-6">
         <ShoppingBag size={48} className="text-[#b8956a] opacity-40"/>
      </div>
      <p className="font-black text-xl text-[#3d2d1a]">ตะกร้าว่างอยู่</p>
      <p className="text-sm mt-1 text-gray-400">มาเติมคาเฟอีนกันครับ!</p>
    </div>
  );

  return (
    <div className="flex-1 flex flex-col overflow-hidden" style={{background:C.bg}}>
      {/* List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar">
        <h2 className="px-1 text-[10px] font-bold text-[#b8956a] uppercase tracking-widest mb-1">รายการสินค้าของคุณ</h2>
        {cart.map((item,idx)=>(
          <motion.div key={idx} layout className="bg-white rounded-[2rem] p-4 border border-[#f5ebe0] shadow-sm relative overflow-hidden">
            <div className="flex gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden shrink-0 bg-amber-50">
                {item.menuItem.imageUrl?<img src={item.menuItem.imageUrl} alt="" className="w-full h-full object-cover"/>:<Coffee size={24} className="m-auto mt-7 text-[#b8956a]"/>}
              </div>
              <div className="flex-1 min-w-0 py-1">
                <div className="flex items-start justify-between">
                  <h3 className="font-bold text-[#3d2d1a] truncate text-sm">{item.menuItem.name}</h3>
                  <button onClick={()=>onRemove(idx)} className="text-gray-300 hover:text-rose-500"><X size={16}/></button>
                </div>
                <p className="text-[10px] text-gray-400 mt-1 line-clamp-1">
                  {Object.entries(item.selectedOptions).map(([g,o])=>`${g}: ${o.map(x=>x.label).join(', ')}`).join(' | ')}
                </p>
                <div className="flex items-center justify-between mt-3">
                  <span className="font-black text-sm text-[#b8956a]">฿{item.unitTotal}</span>
                  <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-1 px-3 border border-gray-100 shadow-inner">
                    <button onClick={()=>onUpdateQty(idx,Math.max(1,item.quantity-1))} className="text-gray-400 hover:text-[#b8956a] p-1"><Minus size={12} strokeWidth={3}/></button>
                    <span className="font-black text-xs w-4 text-center">{item.quantity}</span>
                    <button onClick={()=>onUpdateQty(idx,item.quantity+1)} className="text-gray-400 hover:text-[#b8956a] p-1"><Plus size={12} strokeWidth={3}/></button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Summary Footer */}
      <div className="p-6 pb-8 bg-white border-t rounded-t-[3rem] shadow-2xl space-y-4">
        <button onClick={()=>setShowBranches(true)} className="flex items-center justify-between w-full p-4 rounded-2xl border-2 border-amber-50 bg-amber-50/20 group hover:border-[#b8956a]/30 transition-all">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-xl bg-white border border-[#e8d5c0] flex items-center justify-center text-[#b8956a] group-hover:scale-105 transition-transform"><StoreIcon size={20}/></div>
             <div className="text-left"><p className="text-[10px] font-bold text-[#b8956a] uppercase">สาขาที่รับ</p><p className="font-bold text-sm text-[#3d2d1a]">{selectedBranch?.name || 'เลือกสาขา...'}</p></div>
          </div>
          <ChevronRight size={18} className="text-[#b8956a]"/>
        </button>

        <div className="flex items-center justify-between px-2">
           <div><p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider mb-0.5">ยอดรวมทั้งหมด</p><p className="text-2xl font-black text-[#3d2d1a]">฿{total}</p></div>
           <button onClick={()=>setShowCheckout(true)} className="bg-[#b8956a] text-white px-10 h-14 rounded-2xl font-black shadow-lg shadow-[#b8956a]/30 active:scale-95 transition-all flex items-center gap-3">ดำเนินการต่อ <ChevronRight size={20}/></button>
        </div>
      </div>

      {/* Checkout Sheet */}
      <AnimatePresence>
        {showCheckout && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-end justify-center">
            <motion.div onClick={()=>setShowCheckout(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
            <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring',damping:25,stiffness:200}} className="relative bg-[#fdf8f0] w-full rounded-t-[3rem] p-8 pb-10 max-h-[90vh] overflow-y-auto no-scrollbar shadow-2xl">
              <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
              
              <div className="space-y-8">
                <section>
                  <label className="text-[10px] font-bold text-[#9c7a50] uppercase tracking-wider mb-4 block mx-1">การรับสินค้า</label>
                  <div className="space-y-3">
                    <button onClick={()=>setFulfillType('PICKUP')} className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${fulfillType==='PICKUP'?'border-[#b8956a] bg-amber-50':'border-[#f5ebe0] bg-white'}`}>
                      <div className="flex items-center gap-3"><Clock className={fulfillType==='PICKUP'?'text-[#b8956a]':'text-gray-400'}/><div className="text-left"><p className="font-bold text-sm text-[#3d2d1a]">รับที่สาขา</p><p className="text-[10px] text-gray-500">Pick up at store</p></div></div>
                      {fulfillType==='PICKUP'&&<CheckCircle2 size={20} className="text-[#b8956a]"/>}
                    </button>
                    <button onClick={()=>setFulfillType('DELIVERY')} className={`w-full p-4 rounded-2xl border-2 flex items-center justify-between transition-all ${fulfillType==='DELIVERY'?'border-[#b8956a] bg-amber-50':'border-[#f5ebe0] bg-white'}`}>
                      <div className="flex items-center gap-3"><Truck className={fulfillType==='DELIVERY'?'text-[#b8956a]':'text-gray-400'}/><div className="text-left"><p className="font-bold text-sm text-[#3d2d1a]">จัดส่งถึงที่</p><p className="text-[10px] text-gray-500">Delivery to you (+฿20)</p></div></div>
                      {fulfillType==='DELIVERY'&&<CheckCircle2 size={20} className="text-[#b8956a]"/>}
                    </button>
                  </div>

                  {fulfillType==='DELIVERY'&&(
                    <div className="mt-4 animate-in fade-in slide-in-from-top-2 duration-300">
                       <label className="text-[10px] font-bold text-[#9c7a50] uppercase tracking-wider mb-2 block mx-1">ที่อยู่จัดส่ง</label>
                       {selectedAddress ? (
                          <div className="p-4 rounded-2xl bg-white border border-[#e8d5c0] flex items-center justify-between group shadow-sm">
                             <div className="flex items-center gap-3">
                                <div className="p-2.5 rounded-xl bg-amber-50 text-[#b8956a]">{selectedAddress.label==='Home'?<Home size={18}/>:selectedAddress.label==='Office'?<Briefcase size={18}/>:<MapPin size={18}/>}</div>
                                <div><p className="font-bold text-sm text-[#3d2d1a]">{selectedAddress.label}</p><p className="text-[10px] text-gray-500 truncate w-48">{selectedAddress.address}</p></div>
                             </div>
                             <button onClick={()=>setShowAddressPicker(true)} className="px-3 py-1 rounded-lg bg-amber-50 text-[10px] font-bold text-[#b8956a] uppercase">เปลี่ยน</button>
                          </div>
                       ) : (
                          <button onClick={()=>setShowAddressPicker(true)} className="w-full p-4 rounded-2xl border-2 border-dashed border-[#e8d5c0] bg-white/50 text-sm font-bold text-[#9c7a50] flex items-center justify-center gap-2">
                             <Plus size={16}/> เพิ่มที่อยู่จัดส่ง
                          </button>
                       )}
                    </div>
                  )}
                </section>

                <section>
                  <label className="text-[10px] font-bold text-[#9c7a50] uppercase tracking-wider mb-4 block mx-1">วิธีการชำระเงิน</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={()=>setPayMethod('QR')} className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all shadow-sm ${payMethod==='QR'?'border-[#b8956a] bg-amber-50 text-[#b8956a]':'border-[#f5ebe0] bg-white text-gray-400'}`}>
                      <QrCode size={28}/><span className="text-xs font-black">QR Scan</span>
                    </button>
                    <button onClick={()=>setPayMethod('CASH')} className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all shadow-sm ${payMethod==='CASH'?'border-[#b8956a] bg-amber-50 text-[#b8956a]':'border-[#f5ebe0] bg-white text-gray-400'}`}>
                      <Banknote size={28}/><span className="text-xs font-black">Cash/POS</span>
                    </button>
                  </div>
                </section>

                <section>
                  <label className="text-[10px] font-bold text-[#9c7a50] uppercase tracking-wider mb-2 block mx-1">หมายเหตุ (Optional)</label>
                  <textarea value={note} onChange={e=>setNote(e.target.value)} placeholder="เช่น ไม่ใส่น้ำตาล, แพ้ถั่ว..." className="w-full p-4 rounded-2xl border-2 border-[#f5ebe0] bg-white text-sm focus:border-[#b8956a] outline-none transition-all resize-none h-24 no-scrollbar shadow-inner" />
                </section>

                <div className="space-y-4 pt-6 border-t border-[#e8d5c0]">
                  <div className="flex justify-between text-gray-500 px-1 text-sm font-bold"><span>ราคาสินค้า (Subtotal)</span><span>฿{total}</span></div>
                  <div className="flex justify-between text-gray-500 px-1 text-sm font-bold"><span>ค่าจัดส่ง (Delivery)</span><span>{fulfillType==='DELIVERY' ? '฿20' : '฿0'}</span></div>
                  <div className="flex justify-between text-2xl font-black pt-2 px-1 text-[#3d2d1a]"><span>ยอดรวมสุทธิ</span><span>฿{fulfillType==='DELIVERY' ? total+20 : total}</span></div>
                  <button disabled={isProcessing} onClick={handleCheckout} className="w-full h-16 bg-[#b8956a] text-white rounded-2xl font-black shadow-xl shadow-[#b8956a]/30 flex items-center justify-center gap-3 mt-6 active:scale-95 transition-all text-lg relative overflow-hidden">
                    {isProcessing ? <RefreshCw className="animate-spin" size={24}/> : <><CheckCircle2 size={24}/> ยืนยันชำระเงิน</>}
                    {!isProcessing && <div className="absolute right-6 bg-white/20 px-3 py-1 rounded-full text-[10px] uppercase font-bold text-white">pts +{Math.floor(total/10)}</div>}
                  </button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Branch Selector */}
      <AnimatePresence>
        {showBranches && (
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <div onClick={()=>setShowBranches(false)} className="absolute inset-0 bg-[#3d2d1a]/60 backdrop-blur-sm" />
            <motion.div initial={{scale:0.9,opacity:0}} animate={{scale:1,opacity:1}} exit={{scale:0.9,opacity:0}} className="relative bg-[#fdf8f0] w-full max-w-sm rounded-[3rem] p-8 max-h-[80vh] flex flex-col shadow-2xl">
              <div className="flex justify-between items-center mb-6"><h3 className="text-xl font-black italic text-[#b8956a]">SELECT BRANCH</h3><button onClick={()=>setShowBranches(false)} className="p-2 border rounded-full bg-white"><X size={20}/></button></div>
              <div className="flex-1 overflow-y-auto space-y-3 no-scrollbar pb-4">
                {branches.map(b=>(
                  <button key={b.id} onClick={()=>{setSelectedBranch(b);setShowBranches(false);}} className={`w-full p-4 rounded-2xl border-2 text-left transition-all ${selectedBranch?.id===b.id?'border-[#b8956a] bg-amber-50 shadow-sm':'border-[#f5ebe0] bg-white group hover:border-[#b8956a]/30'}`}>
                    <p className="font-black text-sm text-[#3d2d1a]">{b.name}</p>
                    <p className="text-[10px] text-gray-400 mt-1 line-clamp-1 font-bold">{b.address}</p>
                  </button>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Address Picker Sheet */}
      <AnimatePresence>
         {showAddressPicker && (
            <div className="fixed inset-0 z-[120] flex items-end justify-center">
               <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowAddressPicker(false)} className="absolute inset-0 bg-black/40 backdrop-blur-sm" />
               <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring',damping:25,stiffness:200}} className="relative bg-white w-full rounded-t-[3rem] p-8 pb-10 max-h-[70vh] overflow-y-auto no-scrollbar shadow-2xl">
                  <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
                  <h3 className="text-2xl font-black mb-6 text-[#3d2d1a]">ที่อยู่จัดส่งของคุณ</h3>
                  <div className="space-y-3">
                     {member?.addresses?.map((addr:any)=>(
                        <button key={addr.id} onClick={()=>{setSelectedAddress(addr); setShowAddressPicker(false);}} className={`w-full p-5 rounded-3xl border-2 flex items-center gap-5 text-left transition-all ${selectedAddress?.id===addr.id?'border-[#b8956a] bg-amber-50 shadow-sm':'border-[#f5ebe0] bg-white'}`}>
                           <div className={`p-3 rounded-2xl shadow-sm ${selectedAddress?.id===addr.id?'bg-[#b8956a] text-white':'bg-amber-50 text-[#b8956a]'}`}>
                              {addr.label==='Home'?<Home size={22}/>:addr.label==='Office'?<Briefcase size={22}/>:<MapPin size={22}/>}
                           </div>
                           <div className="flex-1 min-w-0">
                              <p className="font-black text-sm text-[#3d2d1a]">{addr.label}</p>
                              <p className="text-xs text-gray-400 truncate mt-0.5">{addr.address}</p>
                           </div>
                           {selectedAddress?.id===addr.id && <CheckCircle2 size={24} className="text-[#b8956a]"/>}
                        </button>
                     ))}
                     <button onClick={()=>setIsAddressFormOpen(true)} className="w-full p-5 rounded-3xl border-2 border-dashed border-[#e8d5c0] text-sm font-black text-[#b8956a] flex items-center justify-center gap-3 bg-amber-50/20 active:scale-95 transition-all">
                        <Plus size={20} strokeWidth={3}/> เพิ่มที่อยู่จัดส่งใหม่
                     </button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
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
        <div className="bg-white rounded-[2rem] p-6 border border-[#f5ebe0] shadow-sm">
          <div className="flex items-center justify-between mb-5">
            <div>
               <p className="text-[10px] font-bold text-gray-400 tracking-widest uppercase mb-1">{selected.orderNo}</p>
               <div className="flex items-center gap-3">
                  <span className="text-5xl font-black italic text-[#b8956a]">#{selected.queueNo || '---'}</span>
                  <div className="h-10 w-px bg-gray-100 mx-1"/>
                  <span className="font-black text-xl text-[#3d2d1a]">฿{selected.totalAmount}</span>
               </div>
            </div>
            <span className={`px-4 py-2 rounded-2xl text-[10px] font-black uppercase tracking-wider ${STATUS_CFG[selected.status]?.bg||'bg-gray-50'} ${STATUS_CFG[selected.status]?.color||'text-gray-600'}`}>{STATUS_CFG[selected.status]?.label||selected.status}</span>
          </div>
          {/* Progress bar */}
          {selected.status!=='CANCELLED'&&(
            <div className="flex gap-2.5 mt-2">
              {['PENDING','PAID','PREPARING','READY','COMPLETED'].map((s,i)=>{
                const isActive=(STATUS_CFG[selected.status]?.step||0)>=i;
                return <div key={s} className="flex-1"><div className={`h-2 rounded-full transition-all duration-500 shadow-inner ${isActive?'bg-[#b8956a] scale-y-110':'bg-gray-100'}`}/></div>;
              })}
            </div>
          )}
          {(selected.status==='READY')&&<div className="mt-5 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center gap-3 animate-pulse"><CheckCircle2 className="text-emerald-600" size={20}/><p className="text-xs font-black text-emerald-700 uppercase tracking-wider">Your coffee is ready!</p></div>}
        </div>
        {/* Items */}
        <div className="bg-white rounded-[2rem] p-6 border border-[#f5ebe0] shadow-sm">
          <p className="font-black text-sm text-[#3d2d1a] mb-4 uppercase tracking-wider border-b border-gray-50 pb-2">Order Summary ({selected.items?.length||0})</p>
          <div className="space-y-4">{selected.items?.map((it:any,i:number)=>(
            <div key={i} className="flex justify-between items-start text-sm group">
              <div className="flex-1">
                <p className="font-bold text-[#3d2d1a]">{it.productName||it.product?.name} <span className="text-[#b8956a]">×{it.quantity}</span></p>
                {it.selectedOptions && <p className="text-[10px] text-gray-400 mt-1">{JSON.parse(it.selectedOptions || '[]').map((o:any)=>o.label).join(', ')}</p>}
              </div>
              <span className="font-black text-[#b8956a] ml-4">฿{it.price}</span>
            </div>
          ))}</div>
          <div className="mt-6 pt-4 border-t border-dashed border-gray-100 flex justify-between items-center text-[#3d2d1a] font-black text-lg">
             <span>TOTAL</span>
             <span>฿{selected.totalAmount}</span>
          </div>
        </div>
        
        <p className="text-center text-[10px] font-bold text-gray-300 uppercase tracking-[0.2em]">{new Date(selected.createdAt).toLocaleString('th-TH')}</p>
      </div>
    </div>
  );

  return(
    <div className="flex-1 flex flex-col overflow-hidden" style={{background:C.bg}}>
      <PageHeader title="คำสั่งซื้อของฉัน" right={<button onClick={fetchOrders} className="p-2 rounded-xl active:bg-gray-50 transition-colors"><RefreshCw size={18} style={{color:C.accent}}/></button>}/>
      <div className="flex-1 overflow-y-auto p-4 no-scrollbar pb-32">
        {orders.length===0?(
          <div className="flex flex-col items-center justify-center py-24 opacity-30"><ClipboardList size={64} className="mb-4 text-[#b8956a]"/><p className="font-black text-lg">ยังไม่มีคำสั่งซื้อ</p></div>
        ):(
          <div className="space-y-4">{orders.map(o=>{
            const cfg=STATUS_CFG[o.status];
            return(
              <motion.div key={o.id} whileTap={{scale:0.98}} onClick={()=>setSelected(o)} className="bg-white rounded-[2rem] p-5 border border-[#f5ebe0] shadow-sm active:shadow-inner transition-all">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-3xl font-black italic text-[#b8956a]">#{o.queueNo || '---'}</span>
                  <span className={`text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-wider ${cfg?.bg||'bg-gray-50'} ${cfg?.color||'text-gray-600'}`}>{cfg?.label||o.status}</span>
                </div>
                <p className="font-bold text-sm mb-2 text-[#3d2d1a] truncate">{o.items?.slice(0,2).map((i:any)=>i.productName||i.product?.name).join(', ')}{(o.items?.length||0)>2?` +${o.items.length-2} more`:''}</p>
                <div className="flex justify-between items-center border-t border-gray-50 pt-3">
                  <span className="text-[10px] font-bold text-gray-400">{new Date(o.createdAt).toLocaleString('th-TH',{dateStyle:'short',timeStyle:'short'})}</span>
                  <span className="font-black text-base text-[#3d2d1a]">฿{o.totalAmount}</span>
                </div>
              </motion.div>
            );
          })}</div>
        )}
      </div>
    </div>
  );
}

// ─── ADDRESS MANAGEMENT ─────────────────────────────────────────────────────
function AddressFormSheet({isOpen, onClose, onSave, initialData}: {isOpen:boolean, onClose:()=>void, onSave:(data:any)=>void, initialData?:any}) {
  const [label, setLabel] = useState(initialData?.label || 'Home');
  const [address, setAddress] = useState(initialData?.address || '');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setLabel(initialData?.label || 'Home');
      setAddress(initialData?.address || '');
    }
  }, [isOpen, initialData]);

  const handleSave = async () => {
    if (!address) return;
    setLoading(true);
    const memberId = localStorage.getItem('memberId');
    const method = initialData?.id ? 'PATCH' : 'POST';
    const url = initialData?.id ? `${API}/addresses/${initialData.id}` : `${API}/addresses`;
    
    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: memberId, label, address })
      });
      if (res.ok) {
        onSave(await res.json());
        onClose();
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center">
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring',damping:25,stiffness:200}} className="relative bg-[#fdf8f0] w-full rounded-t-[3rem] p-8 pb-12 shadow-2xl border-t-4 border-white">
            <div className="w-12 h-1.5 bg-gray-200 rounded-full mx-auto mb-8" />
            <h3 className="text-2xl font-black mb-6 text-[#3d2d1a] italic uppercase tracking-tight">{initialData ? 'แก้ไขที่อยู่' : 'เพิ่มที่อยู่ใหม่'}</h3>
            
            <div className="space-y-6">
               <section>
                  <label className="text-[10px] font-bold text-[#b8956a] uppercase tracking-widest mb-3 block ml-1">ประเภทที่อยู่</label>
                  <div className="flex gap-2">
                     {['Home', 'Office', 'Other'].map(l => (
                        <button key={l} onClick={()=>setLabel(l)} className={`flex-1 py-3 rounded-2xl font-black text-xs transition-all border-2 ${label===l ? 'bg-[#b8956a] text-white border-transparent shadow-lg' : 'bg-white text-gray-400 border-gray-100'}`}>{l}</button>
                     ))}
                  </div>
               </section>

               <section>
                  <label className="text-[10px] font-bold text-[#b8956a] uppercase tracking-widest mb-3 block ml-1">รายละเอียดที่อยู่</label>
                  <textarea value={address} onChange={e=>setAddress(e.target.value)} placeholder="บ้านเลขที่, ถนน, แขวง/ตำบล..." className="w-full p-5 rounded-3xl bg-white border-2 border-gray-50 text-sm focus:border-[#b8956a] outline-none transition-all resize-none h-32 no-scrollbar shadow-inner" />
               </section>

               <button disabled={loading || !address} onClick={handleSave} className="w-full h-16 bg-[#b8956a] text-white rounded-2xl font-black shadow-xl shadow-[#b8956a]/30 flex items-center justify-center gap-3 mt-4 active:scale-95 transition-all text-lg">
                  {loading ? <Loader2 className="animate-spin"/> : <><CheckCircle2 size={24}/> บันทึกข้อมูล</>}
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function AddressManagementSheet({isOpen, onClose, member, onRefresh, onAdd, onEdit}: {isOpen:boolean, onClose:()=>void, member:any, onRefresh:()=>void, onAdd:()=>void, onEdit:(a:any)=>void}) {
  const handleDelete = async (id: string) => {
    if (!confirm('ยืนยันการลบที่อยู่นี้?')) return;
    try {
      const res = await fetch(`${API}/addresses/${id}`, { method: 'DELETE' });
      if (res.ok) onRefresh();
    } catch (e) { console.error(e); }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[180] flex items-end justify-center">
          <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <motion.div initial={{y:'100%'}} animate={{y:0}} exit={{y:'100%'}} transition={{type:'spring',damping:25,stiffness:200}} className="relative bg-white w-full rounded-t-[3rem] max-h-[85vh] overflow-hidden flex flex-col shadow-2xl">
            <div className="p-8 pb-4 flex justify-between items-center shrink-0">
               <h3 className="text-2xl font-black text-[#3d2d1a] italic uppercase tracking-tight">SAVED ADDRESSES</h3>
               <button onClick={onClose} className="p-2 border rounded-full bg-gray-50"><X size={20}/></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 space-y-4 no-scrollbar pb-32">
               {member?.addresses?.map((addr: any) => (
                  <div key={addr.id} className="bg-white p-5 rounded-3xl border-2 border-gray-50 shadow-sm flex items-center gap-4 group">
                     <div className="w-12 h-12 rounded-2xl bg-amber-50 text-[#b8956a] flex items-center justify-center shrink-0 shadow-inner">
                        {addr.label==='Home' ? <Home size={22}/> : addr.label==='Office' ? <Briefcase size={22}/> : <MapPin size={22}/>}
                     </div>
                     <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-0.5">
                           <p className="font-black text-sm text-[#3d2d1a] uppercase">{addr.label}</p>
                           {addr.isDefault && <span className="text-[8px] bg-[#b8956a] text-white px-2 py-0.5 rounded-full font-black italic">DEFAULT</span>}
                        </div>
                        <p className="text-xs text-gray-400 truncate">{addr.address}</p>
                     </div>
                     <div className="flex items-center gap-1">
                        <button onClick={()=>onEdit(addr)} className="p-2 text-gray-300 hover:text-[#b8956a] transition-colors"><Settings size={18}/></button>
                        <button onClick={()=>handleDelete(addr.id)} className="p-2 text-gray-300 hover:text-rose-500 transition-colors"><X size={18}/></button>
                     </div>
                  </div>
               ))}
               {(!member?.addresses || member.addresses.length === 0) && (
                  <div className="text-center py-20 opacity-20">
                     <MapPin size={64} className="mx-auto mb-4"/>
                     <p className="font-black">YOU HAVE NO SAVED ADDRESSES</p>
                  </div>
               )}
            </div>
            
            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-white via-white to-transparent pt-10">
               <button onClick={onAdd} className="w-full h-16 bg-[#b8956a] text-white rounded-2xl font-black shadow-xl shadow-[#b8956a]/30 flex items-center justify-center gap-3 active:scale-95 transition-all text-lg border-4 border-white">
                  <Plus size={24} strokeWidth={3}/> เพิ่มที่อยู่ใหม่
               </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

// ─── PROFILE PAGE ──────────────────────────────────────────────────────────
function ProfilePage({member, setShowManage, setShowHistory}:{member:any; setShowManage:(o:boolean)=>void; setShowHistory:(o:boolean)=>void}) {
  const [showHistory, setShowHistory] = useState(false);
  const menus=[
    {icon:Receipt,label:'ประวัติคำสั่งซื้อ', action:()=>setShowHistory(true)},
    {icon:MapPin,label:'ที่อยู่ที่บันทึก', action:()=>setShowManage(true)},
    {icon:Gift,label:'แต้มสะสม',sub:`${member?.points||0} แต้ม`},
    {icon:History,label:'ประวัติการรับแต้ม'},
    {icon:Heart,label:'รายการโปรด'},
    {icon:Bell,label:'การแจ้งเตือน'},
    {icon:Settings,label:'ตั้งค่า'},
    {icon:Phone,label:'ติดต่อเรา'}
  ];
  return(
    <div className="flex-1 overflow-y-auto no-scrollbar" style={{background:C.bg}}>
      <div className="px-5 pt-8 pb-6 shadow-sm" style={{background:`linear-gradient(135deg, ${C.accent}, ${C.mid})`}}>
        <div className="flex items-center gap-4">
          {member?.pictureUrl?<img src={member.pictureUrl} alt="" className="w-16 h-16 rounded-[1.5rem] border-2 border-white/50 shadow-lg"/>:<div className="w-16 h-16 rounded-[1.5rem] bg-white/20 flex items-center justify-center"><User size={28} className="text-white"/></div>}
          <div>
            <h2 className="text-white font-bold text-lg">{member?.name || member?.displayName||'ลูกค้า'}</h2>
            <p className="text-white/70 text-[10px] bg-black/10 px-2 py-0.5 rounded-full inline-block mt-1">⭐ {member?.id?.slice(0,12).toUpperCase()}</p>
          </div>
        </div>
        {/* Point card */}
        <div className="mt-6 bg-white/10 backdrop-blur-md rounded-3xl p-5 flex items-center justify-between border border-white/20 shadow-xl">
          <div>
            <p className="text-white/70 text-[10px] font-bold uppercase tracking-wider mb-1">สะสมแต้ม</p>
            <p className="text-white font-black text-3xl flex items-baseline gap-1">{member?.points||0} <span className="text-sm font-bold opacity-70">pts</span></p>
          </div>
          <motion.button whileTap={{scale:0.95}} className="bg-white text-[#b8956a] px-6 py-2.5 rounded-2xl text-[10px] font-black shadow-xl uppercase tracking-wider">Redeem</motion.button>
        </div>
      </div>
      
      {/* Saved Addresses Summary */}
      <div className="px-4 mt-6">
         <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-[#f5ebe0]">
            <div className="flex items-center justify-between mb-4">
               <h3 className="font-black text-[11px] text-[#3d2d1a] uppercase tracking-widest flex items-center gap-2">ที่อยู่ของฉัน</h3>
               <button onClick={()=>setShowManage(true)} className="text-[10px] font-bold text-[#b8956a] underline">จัดการ</button>
            </div>
            <div className="space-y-4">
               {member?.addresses?.length > 0 ? member.addresses.map((addr:any)=>(
                  <div key={addr.id} className="flex items-start gap-3">
                     <div className="bg-amber-50 p-1.5 rounded-lg text-[#b8956a]">{addr.label==='Home'?<Home size={12}/> : addr.label==='Office'?<Briefcase size={12}/> : <MapPin size={12}/>}</div>
                     <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-black text-[#3d2d1a] uppercase mb-0.5">{addr.label}</p>
                        <p className="text-xs text-gray-400 truncate">{addr.address}</p>
                     </div>
                  </div>
               )) : <p className="text-[10px] text-gray-300 font-bold py-2 italic text-center">ยังไม่มีข้อมูลที่อยู่</p>}
            </div>
         </div>
      </div>

      <div className="p-4 pb-32 space-y-2.5 mt-2">
        {menus.map((m,i)=>{const Icon=m.icon;return(
          <motion.button key={i} whileTap={{scale:0.98}} onClick={m.action} className="w-full bg-white rounded-2xl p-4 border border-[#f5ebe0] flex items-center gap-4 shadow-sm text-left group transition-all">
            <div className="w-11 h-11 rounded-xl flex items-center justify-center bg-gray-50 text-[#b8956a] group-active:bg-amber-50 transition-colors shadow-inner"><Icon size={20}/></div>
            <div className="flex-1">
               <p className="font-bold text-sm text-[#3d2d1a]">{m.label}</p>
               {m.sub&&<p className="text-[10px] font-bold text-[#b8956a] uppercase tracking-wider">{m.sub}</p>}
            </div>
            <ChevronRight size={18} className="text-[#e8d5c0]"/>
          </motion.button>
        );})}
        <div className="pt-4 px-2">
          <motion.button whileTap={{scale:0.95}} className="w-full bg-rose-50 border border-rose-100 rounded-2xl p-4 flex items-center gap-4 shadow-sm">
            <div className="w-11 h-11 rounded-xl bg-rose-100 flex items-center justify-center shadow-inner"><LogOut size={20} className="text-rose-600"/></div>
            <span className="font-black text-sm text-rose-600 uppercase tracking-wider">Log Out</span>
          </motion.button>
        </div>
      </div>

      {/* Popups */}
      <AnimatePresence>
         {showHistory && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
               <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} onClick={()=>setShowHistory(false)} className="absolute inset-0 bg-black/60 backdrop-blur-md" />
               <motion.div initial={{scale:0.9, opacity:0}} animate={{scale:1, opacity:1}} exit={{scale:0.9, opacity:0}} className="relative bg-[#fdf8f0] w-full max-w-sm rounded-[3rem] overflow-hidden max-h-[80vh] flex flex-col shadow-2xl border-4 border-white">
                  <div className="p-6 border-b border-[#e8d5c0] flex items-center justify-between shrink-0 bg-white">
                     <h3 className="font-black text-lg italic text-[#b8956a]">POINT HISTORY</h3>
                     <button onClick={()=>setShowHistory(false)} className="p-2 rounded-full hover:bg-gray-100 transition-colors"><X size={20}/></button>
                  </div>
                  <div className="flex-1 overflow-y-auto p-4 space-y-3 no-scrollbar pb-8">
                     {member?.pointHistory?.map((h:any)=>(
                        <motion.div initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} key={h.id} className="bg-white p-4 rounded-2xl border border-[#f5ebe0] flex items-center justify-between shadow-sm">
                           <div className="flex items-center gap-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${h.delta>0?'bg-emerald-50 text-emerald-600':'bg-rose-50 text-rose-600'}`}>{h.delta > 0 ? <Plus size={14}/> : <Minus size={14}/>}</div>
                              <div>
                                 <p className="text-xs font-black text-[#3d2d1a] uppercase">{h.reason}</p>
                                 <p className="text-[9px] font-bold text-gray-400 mt-0.5">{new Date(h.createdAt).toLocaleDateString('th-TH',{day:'numeric',month:'short',year:'2-digit'})}</p>
                              </div>
                           </div>
                           <p className={`font-black text-lg ${h.delta>0?'text-emerald-600':'text-rose-600'}`}>{h.delta > 0 ? `+${h.delta}` : h.delta}</p>
                        </motion.div>
                     ))}
                     {(!member?.pointHistory || member.pointHistory.length === 0) && (
                        <div className="text-center py-24 opacity-20">
                           <History size={64} className="mx-auto mb-4"/>
                           <p className="font-black">NO RECORDS YET</p>
                        </div>
                     )}
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}

// ─── MAIN APP ──────────────────────────────────────────────────────────────
export default function App() {
  const {user,isLiffLoading} = useLiff();
  const [tab,setTab]=useState<'home'|'menu'|'cart'|'orders'|'profile'>('home');
  const [cart,setCart]=useState<CartItem[]>([]);
  const [selectedBranch,setSelectedBranch]=useState<Branch|null>(null);
  const [justOrdered,setJustOrdered]=useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [member, setMember] = useState<any>(null);
  const [tempCheckoutData, setTempCheckoutData] = useState<any>(null);
  const [isAddressFormOpen, setIsAddressFormOpen] = useState(false);
  const [isAddressManageOpen, setIsAddressManageOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<any>(null);

  const refreshMember = useCallback(() => {
     const memberId = localStorage.getItem('memberId');
     if (memberId) {
        fetch(`${API}/auth/me?userId=${memberId}`)
           .then(r => r.json())
           .then(setMember);
     }
  }, []);

  // Sync Member state with local storage/backend
  useEffect(() => {
     refreshMember();
  }, [refreshMember]);

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

  const handleCheckout=async(method:string,type:string,note:string, addr?:string)=>{
    if(!selectedBranch||cart.length===0)return;
    const total=cart.reduce((s,i)=>s+i.unitTotal,0);
    const userId = member?.id || localStorage.getItem('memberId');

    const res = await fetch(`${API}/orders`,{
      method:'POST',headers:{'Content-Type':'application/json'},
      body:JSON.stringify({
        branchId:selectedBranch.id,
        userId,
        customerUid:user?.userId || member?.id || 'walk-in',
        customerName:user?.displayName || member?.name,
        totalAmount:total,fulfillmentType:type,paymentMethod:method,note,
        address: addr,
        items:cart.map(i=>({productId:i.menuItem.id,productName:i.menuItem.name,quantity:i.quantity,unitPrice:i.menuItem.price,optionsPrice:Object.values(i.selectedOptions).flat().reduce((s,o)=>s+o.priceAddon,0),price:i.unitTotal/i.quantity,selectedOptions:Object.values(i.selectedOptions).flat()})),
      }),
    });
    
    setCart([]);setJustOrdered(true);setTab('orders');
    setTimeout(()=>setJustOrdered(false),3000);

    // Refresh member data to see new points
    if (userId) {
       setTimeout(() => {
          fetch(`${API}/auth/me?userId=${userId}`).then(r=>r.json()).then(setMember);
       }, 2000);
    }
  };

  const cartCount=cart.reduce((s,i)=>s+i.quantity,0);
  const TABS=[{id:'home',icon:Home,label:'หน้าแรก'},{id:'menu',icon:Coffee,label:'เมนู'},{id:'cart',icon:ShoppingBag,label:'ตะกร้า',badge:cartCount},{id:'orders',icon:ClipboardList,label:'ออเดอร์'},{id:'profile',icon:User,label:'โปรไฟล์'}] as const;

  if(isLiffLoading)return(
    <div className="min-h-screen flex flex-col items-center justify-center" style={{background:C.bg}}>
      <Coffee size={48} className="mb-4 text-[#b8956a]"/><Loader2 size={24} className="animate-spin text-[#b8956a]"/>
      <p className="mt-4 font-black uppercase tracking-widest text-[#b8956a] text-xs">Loading Experience...</p>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col max-w-md mx-auto relative overflow-hidden shadow-2xl" style={{background:C.bg}}>
      {/* Success toast */}
      <AnimatePresence>{justOrdered&&(
        <motion.div initial={{opacity:0,y:-50, scale:0.8}} animate={{opacity:1,y:0, scale:1}} exit={{opacity:0,y:-50}} className="fixed top-6 left-4 right-4 z-[150] bg-emerald-600 text-white p-5 rounded-3xl shadow-2xl flex items-center justify-between border-2 border-white/20">
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center shrink-0"><Check size={20} strokeWidth={4}/></div>
             <div><p className="font-black text-sm uppercase tracking-wider">Order Complete!</p><p className="text-[10px] font-bold opacity-80">Brewing your coffee now...</p></div>
          </div>
          <div className="bg-black/20 px-4 py-2 rounded-2xl text-[10px] font-black italic">PTS +{Math.floor(cart.reduce((s,i)=>s+i.unitTotal,0)/10)}</div>
        </motion.div>
      )}</AnimatePresence>

      {/* Page content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        <AnimatePresence mode="wait">
          <motion.div key={tab} initial={{opacity:0,y:5}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-5}} transition={{duration:0.2}} className="flex-1 flex flex-col overflow-hidden">
            {tab==='home'&&<HomePage cart={cart} onNavigate={setTab as any} onSelectBranch={b=>{setSelectedBranch(b);setTab('menu');}} user={user || member}/>}
            {tab==='menu'&&<MenuPage onAddToCart={addToCart} cart={cart}/>}
            {tab==='cart'&&<CartPage cart={cart} onUpdateQty={updateQty} onRemove={idx=>setCart(p=>p.filter((_,i)=>i!==idx))} onCheckout={handleCheckout} selectedBranch={selectedBranch} setSelectedBranch={setSelectedBranch} setIsAuthModalOpen={setIsAuthModalOpen} setTempCheckoutData={setTempCheckoutData} member={member} setIsAddressFormOpen={setIsAddressFormOpen}/>}
            {tab==='orders'&&<OrdersPage customerUid={user?.userId||member?.id||'walk-in'}/>}
            {tab==='profile'&&<ProfilePage member={member} setShowManage={setIsAddressManageOpen} setShowHistory={()=>{}}/>}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Bottom navigation */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-md bg-white/80 backdrop-blur-md border-t border-[#f5ebe0] z-40 pb-safe shadow-[0_-10px_40px_rgba(0,0,0,0.03)]">
        <div className="flex h-20 items-center">
          {TABS.map(t=>{
            const Icon=t.icon;const isActive=tab===t.id;
            return(
              <button key={t.id} onClick={()=>setTab(t.id)} className="flex-1 flex flex-col items-center justify-center relative transition-all active:scale-90">
                <div className={`p-2 rounded-2xl transition-all duration-300 ${isActive?'bg-amber-50 text-[#b8956a] scale-110 shadow-inner':'text-gray-300'}`}>
                  {'badge' in t&&t.badge>0&&<span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-black flex items-center justify-center border-2 border-white shadow-md">{t.badge}</span>}
                  <Icon size={24} strokeWidth={isActive?2.5:2}/>
                </div>
                <span className={`text-[9px] mt-1 font-black uppercase tracking-widest transition-opacity duration-300 ${isActive?'opacity-100 text-[#b8956a]':'opacity-0'}`}>{t.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      <AuthModal 
         isOpen={isAuthModalOpen} 
         onClose={() => setIsAuthModalOpen(false)} 
         onLoginSuccess={(m: any) => {
            setMember(m);
            localStorage.setItem('memberId', m.id);
         }} 
      />

      <AddressManagementSheet 
          isOpen={isAddressManageOpen} 
          onClose={()=>setIsAddressManageOpen(false)} 
          member={member} 
          onRefresh={refreshMember}
          onAdd={()=>{setEditingAddress(null); setIsAddressFormOpen(true);}}
          onEdit={(a)=>{setEditingAddress(a); setIsAddressFormOpen(true);}}
      />

      <AddressFormSheet 
          isOpen={isAddressFormOpen} 
          onClose={()=>{setIsAddressFormOpen(false); setEditingAddress(null);}} 
          onSave={refreshMember}
          initialData={editingAddress}
      />
    </div>
  );
}
