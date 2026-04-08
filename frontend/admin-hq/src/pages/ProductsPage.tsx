import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Coffee, Plus, Edit2, Trash2, X, Check, Loader2, AlertTriangle,
  Tag, Settings2, ChevronRight, Eye, EyeOff, Package,
  Star, Sparkles, Clock, DollarSign, ToggleLeft, ToggleRight,
  GripVertical, Layers, Search, Filter
} from 'lucide-react';

const API = 'http://localhost:5001/api';
const C = { 50:'#fdf8f0',100:'#f5ebe0',200:'#e8d5c0',300:'#d4b896',400:'#b8956a',500:'#9c7a50',600:'#7a5c3a',700:'#5c4428',800:'#3d2d1a' };

interface Category { id:string; name:string; description?:string; icon?:string; imageUrl?:string; sortOrder:number; isVisible:boolean; _count:{products:number}; }
interface MenuOption { id:string; groupId:string; label:string; priceAddon:number; isDefault:boolean; sortOrder:number; }
interface OptionGroup { id:string; productId:string; name:string; isRequired:boolean; maxSelect:number; sortOrder:number; options:MenuOption[]; }
interface MenuItem { id:string; name:string; description?:string; price:number; categoryId?:string; category?:Category; imageUrl?:string; status:string; tags:string; sortOrder:number; optionGroups:OptionGroup[]; recipes:any[]; _count:{orderItems:number}; }

const STATUS_CFG:Record<string,{label:string;color:string;icon:typeof Eye}> = {
  AVAILABLE:    {label:'พร้อมขาย',     color:'text-emerald-700 bg-emerald-50 border-emerald-200', icon:Eye},
  OUT_OF_STOCK: {label:'หมดชั่วคราว', color:'text-amber-700 bg-amber-50 border-amber-200',     icon:Clock},
  HIDDEN:       {label:'ซ่อน',         color:'text-gray-500 bg-gray-50 border-gray-200',        icon:EyeOff},
};

const TAG_OPTIONS = ['Bestseller','Recommended','New','Seasonal','Signature'];
const TAG_COLORS:Record<string,string> = { Bestseller:'bg-amber-100 text-amber-800', Recommended:'bg-blue-100 text-blue-800', New:'bg-emerald-100 text-emerald-800', Seasonal:'bg-purple-100 text-purple-800', Signature:'bg-rose-100 text-rose-800' };

function Toast({ msg, type }:{msg:string;type:'success'|'error'}) {
  return <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}}
    className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-3 z-[100] text-white ${type==='success'?'bg-emerald-600':'bg-rose-600'}`}>
    {type==='success'?<Check size={16}/>:<AlertTriangle size={16}/>}{msg}</motion.div>;
}

// ─── Category Form Modal ──────────────────────────────────────────────────

function CategoryModal({ cat, onClose, onSave }:{ cat?:Category|null; onClose:()=>void; onSave:(d:any)=>Promise<void> }) {
  const [form,setForm]=useState({name:cat?.name||'',icon:cat?.icon||'☕',description:cat?.description||''});
  const [saving,setSaving]=useState(false);
  const up=(k:string,v:string)=>setForm(p=>({...p,[k]:v}));
  const icons=['☕','🧃','🥐','🍰','🧁','🍵','🥤','🍩','🌿','⭐'];
  const submit=async(e:React.FormEvent)=>{e.preventDefault();if(!form.name.trim())return;setSaving(true);try{await onSave(form);onClose();}finally{setSaving(false);}};
  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}/>
      <motion.div initial={{opacity:0,scale:0.92,y:20}} animate={{opacity:1,scale:1,y:0}} className="relative w-full max-w-sm bg-white border rounded-3xl shadow-2xl overflow-hidden" style={{borderColor:C[200]}}>
        <div className="p-5 flex items-center justify-between" style={{borderBottom:`1px solid ${C[200]}`}}>
          <h2 className="font-bold text-base" style={{color:C[800]}}>{cat?'แก้ไขหมวดหมู่':'เพิ่มหมวดหมู่'}</h2>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100" style={{color:C[500]}}><X size={15}/></button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4">
          <div><label className="text-xs font-bold uppercase tracking-widest" style={{color:C[500]}}>ไอคอน</label>
            <div className="flex gap-2 mt-2 flex-wrap">{icons.map(ic=><button key={ic} type="button" onClick={()=>up('icon',ic)} className={`w-9 h-9 rounded-xl text-lg flex items-center justify-center border transition-all ${form.icon===ic?'border-[#b8956a] bg-[#f5ebe0] scale-110':'border-gray-200 hover:border-gray-300'}`}>{ic}</button>)}</div>
          </div>
          <div><label className="text-xs font-bold uppercase tracking-widest" style={{color:C[500]}}>ชื่อหมวดหมู่ *</label>
            <input value={form.name} onChange={e=>up('name',e.target.value)} placeholder="เช่น Coffee, Bakery" className="w-full mt-1.5 bg-white border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8956a]/40" style={{borderColor:C[200]}}/>
          </div>
          <div><label className="text-xs font-bold uppercase tracking-widest" style={{color:C[500]}}>คำอธิบาย</label>
            <input value={form.description} onChange={e=>up('description',e.target.value)} placeholder="คำอธิบายหมวดหมู่" className="w-full mt-1.5 bg-white border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8956a]/40" style={{borderColor:C[200]}}/>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-bold" style={{background:C[100],color:C[600]}}>ยกเลิก</button>
            <button type="submit" disabled={saving||!form.name.trim()} className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50" style={{background:C[400]}}>
              {saving?<Loader2 size={14} className="animate-spin"/>:<Check size={14}/>}บันทึก</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Menu Item Form Modal ──────────────────────────────────────────────────

function MenuItemModal({ item, categories, onClose, onSave }:{ item?:MenuItem|null; categories:Category[]; onClose:()=>void; onSave:(d:any)=>Promise<void> }) {
  const [form,setForm]=useState({
    name:item?.name||'', description:item?.description||'', price:item?.price?.toString()||'',
    categoryId:item?.categoryId||'', imageUrl:item?.imageUrl||'', status:item?.status||'AVAILABLE',
    tags:item?JSON.parse(item.tags||'[]'):[] as string[],
  });
  const [saving,setSaving]=useState(false);
  const up=(k:string,v:any)=>setForm(p=>({...p,[k]:v}));
  const toggleTag=(t:string)=>setForm(p=>({...p,tags:p.tags.includes(t)?p.tags.filter((x:string)=>x!==t):[...p.tags,t]}));

  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();if(!form.name.trim()||!form.price)return;setSaving(true);
    try{await onSave({...form,price:parseFloat(form.price),tags:form.tags,categoryId:form.categoryId||null});onClose();}finally{setSaving(false);}
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex items-center justify-center p-6">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}/>
      <motion.div initial={{opacity:0,scale:0.92,y:20}} animate={{opacity:1,scale:1,y:0}} className="relative w-full max-w-lg bg-white border rounded-3xl shadow-2xl overflow-hidden" style={{borderColor:C[200]}}>
        <div className="p-5 flex items-center justify-between" style={{borderBottom:`1px solid ${C[200]}`}}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{background:C[100]}}><Coffee size={18} style={{color:C[600]}}/></div>
            <div><h2 className="font-bold text-base" style={{color:C[800]}}>{item?'แก้ไขเมนู':'เพิ่มเมนูใหม่'}</h2><p className="text-[11px]" style={{color:C[500]}}>{item?`แก้ไข "${item.name}"`:'กรอกรายละเอียดเมนู'}</p></div>
          </div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100" style={{color:C[500]}}><X size={15}/></button>
        </div>
        <form onSubmit={submit} className="p-5 space-y-4 max-h-[70vh] overflow-y-auto no-scrollbar">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2"><label className="text-xs font-bold uppercase tracking-widest" style={{color:C[500]}}>ชื่อเมนู *</label>
              <input value={form.name} onChange={e=>up('name',e.target.value)} placeholder="เช่น Latte, Americano" className="w-full mt-1.5 bg-white border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8956a]/40" style={{borderColor:C[200]}}/></div>
            <div><label className="text-xs font-bold uppercase tracking-widest flex items-center gap-1" style={{color:C[500]}}><DollarSign size={10}/>ราคา *</label>
              <input type="number" value={form.price} onChange={e=>up('price',e.target.value)} placeholder="฿0" className="w-full mt-1.5 bg-white border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8956a]/40" style={{borderColor:C[200]}}/></div>
          </div>
          <div><label className="text-xs font-bold uppercase tracking-widest" style={{color:C[500]}}>คำอธิบาย</label>
            <textarea value={form.description} onChange={e=>up('description',e.target.value)} rows={2} placeholder="คำอธิบายเมนู" className="w-full mt-1.5 bg-white border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8956a]/40 resize-none" style={{borderColor:C[200]}}/></div>
          <div><label className="text-xs font-bold uppercase tracking-widest" style={{color:C[500]}}>หมวดหมู่</label>
            <select value={form.categoryId} onChange={e=>up('categoryId',e.target.value)} className="w-full mt-1.5 bg-white border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8956a]/40" style={{borderColor:C[200]}}>
              <option value="">-- ไม่ระบุ --</option>
              {categories.map(c=><option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
            </select></div>
          <div><label className="text-xs font-bold uppercase tracking-widest" style={{color:C[500]}}>URL รูปภาพ</label>
            <input value={form.imageUrl} onChange={e=>up('imageUrl',e.target.value)} placeholder="https://..." className="w-full mt-1.5 bg-white border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8956a]/40" style={{borderColor:C[200]}}/></div>
          <div><label className="text-xs font-bold uppercase tracking-widest flex items-center gap-1" style={{color:C[500]}}><Tag size={10}/>แท็ก</label>
            <div className="flex gap-2 mt-2 flex-wrap">{TAG_OPTIONS.map(t=><button key={t} type="button" onClick={()=>toggleTag(t)} className={`px-3 py-1 rounded-lg text-xs font-bold border transition-all ${form.tags.includes(t)?TAG_COLORS[t]+' border-transparent':'bg-white border-gray-200 text-gray-400 hover:text-gray-600'}`}>{t}</button>)}</div></div>
          <div><label className="text-xs font-bold uppercase tracking-widest" style={{color:C[500]}}>สถานะ</label>
            <div className="grid grid-cols-3 gap-2 mt-2">{Object.entries(STATUS_CFG).map(([key,cfg])=>{const Icon=cfg.icon;return(
              <button key={key} type="button" onClick={()=>up('status',key)} className={`flex items-center justify-center gap-1.5 p-2 rounded-xl border text-xs font-bold transition-all ${form.status===key?cfg.color:'bg-white border-gray-200 text-gray-400'}`}><Icon size={12}/>{cfg.label}</button>
            );})}</div></div>
          <div className="flex gap-3 pt-1">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl text-sm font-bold" style={{background:C[100],color:C[600]}}>ยกเลิก</button>
            <button type="submit" disabled={saving||!form.name.trim()||!form.price} className="flex-1 py-2.5 rounded-xl text-white text-sm font-bold flex items-center justify-center gap-2 disabled:opacity-50" style={{background:C[400]}}>
              {saving?<Loader2 size={14} className="animate-spin"/>:<Check size={14}/>}บันทึก</button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

// ─── Option Group Manager (Drawer) ─────────────────────────────────────────

function OptionsDrawer({ item, onClose, onRefresh, showToast }:{ item:MenuItem; onClose:()=>void; onRefresh:()=>void; showToast:(m:string,t?:'success'|'error')=>void }) {
  const [groups,setGroups]=useState<OptionGroup[]>(item.optionGroups||[]);
  const [addGroup,setAddGroup]=useState(false);
  const [newGroup,setNewGroup]=useState({name:'',isRequired:false,maxSelect:1});
  const [addOption,setAddOption]=useState<string|null>(null);
  const [newOpt,setNewOpt]=useState({label:'',priceAddon:''});

  const createGroup=async()=>{
    if(!newGroup.name.trim())return;
    const res=await fetch(`${API}/menu/${item.id}/option-groups`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(newGroup)});
    if(res.ok){const g=await res.json();setGroups(prev=>[...prev,g]);setNewGroup({name:'',isRequired:false,maxSelect:1});setAddGroup(false);showToast('เพิ่มกลุ่มตัวเลือกสำเร็จ');onRefresh();}
  };

  const deleteGroup=async(gid:string)=>{
    await fetch(`${API}/menu/option-groups/${gid}`,{method:'DELETE'});
    setGroups(prev=>prev.filter(g=>g.id!==gid));showToast('ลบกลุ่มตัวเลือกสำเร็จ');onRefresh();
  };

  const createOption=async(gid:string)=>{
    if(!newOpt.label.trim())return;
    const res=await fetch(`${API}/menu/option-groups/${gid}/options`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({label:newOpt.label,priceAddon:newOpt.priceAddon?parseFloat(newOpt.priceAddon):0})});
    if(res.ok){const o=await res.json();setGroups(prev=>prev.map(g=>g.id===gid?{...g,options:[...g.options,o]}:g));setNewOpt({label:'',priceAddon:''});setAddOption(null);showToast('เพิ่มตัวเลือกสำเร็จ');onRefresh();}
  };

  const deleteOption=async(gid:string,oid:string)=>{
    await fetch(`${API}/menu/options/${oid}`,{method:'DELETE'});
    setGroups(prev=>prev.map(g=>g.id===gid?{...g,options:g.options.filter(o=>o.id!==oid)}:g));showToast('ลบตัวเลือกสำเร็จ');onRefresh();
  };

  return (
    <motion.div initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}} className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose}/>
      <motion.div initial={{x:'100%'}} animate={{x:0}} exit={{x:'100%'}} transition={{type:'spring',damping:25,stiffness:300}}
        className="relative w-full max-w-md bg-white shadow-2xl flex flex-col overflow-hidden" style={{borderLeft:`1px solid ${C[200]}`}}>
        <div className="p-5 flex items-center justify-between shrink-0" style={{borderBottom:`1px solid ${C[200]}`}}>
          <div><h2 className="font-bold text-base" style={{color:C[800]}}>ตัวเลือก: {item.name}</h2>
            <p className="text-[11px]" style={{color:C[500]}}>{groups.length} กลุ่มตัวเลือก</p></div>
          <button onClick={onClose} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100" style={{color:C[500]}}><X size={15}/></button>
        </div>

        <div className="flex-1 overflow-y-auto p-5 space-y-4 no-scrollbar">
          {groups.map(g=>(
            <div key={g.id} className="border rounded-xl overflow-hidden" style={{borderColor:C[200]}}>
              <div className="flex items-center justify-between px-4 py-3" style={{background:C[50]}}>
                <div className="flex items-center gap-2">
                  <Layers size={14} style={{color:C[400]}}/>
                  <span className="font-bold text-sm" style={{color:C[800]}}>{g.name}</span>
                  {g.isRequired&&<span className="text-[9px] px-1.5 py-0.5 rounded bg-rose-100 text-rose-700 font-bold">จำเป็น</span>}
                  <span className="text-[9px] px-1.5 py-0.5 rounded font-bold" style={{background:C[100],color:C[500]}}>เลือกได้ {g.maxSelect}</span>
                </div>
                <button onClick={()=>deleteGroup(g.id)} className="w-6 h-6 rounded flex items-center justify-center hover:bg-rose-50 text-gray-400 hover:text-rose-500"><Trash2 size={12}/></button>
              </div>
              <div className="px-4 py-2 space-y-1">
                {g.options.map(o=>(
                  <div key={o.id} className="flex items-center justify-between py-1.5 group">
                    <div className="flex items-center gap-2">
                      <GripVertical size={12} style={{color:C[300]}}/>
                      <span className="text-sm" style={{color:C[700]}}>{o.label}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {o.priceAddon>0&&<span className="text-xs font-bold" style={{color:C[400]}}>+฿{o.priceAddon}</span>}
                      <button onClick={()=>deleteOption(g.id,o.id)} className="w-5 h-5 rounded flex items-center justify-center opacity-0 group-hover:opacity-100 hover:bg-rose-50 text-gray-400 hover:text-rose-500 transition-all"><X size={10}/></button>
                    </div>
                  </div>
                ))}
                {addOption===g.id?(
                  <div className="flex gap-2 pt-2">
                    <input value={newOpt.label} onChange={e=>setNewOpt(p=>({...p,label:e.target.value}))} placeholder="ชื่อตัวเลือก" className="flex-1 bg-white border rounded-lg py-1.5 px-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#b8956a]/40" style={{borderColor:C[200]}}/>
                    <input type="number" value={newOpt.priceAddon} onChange={e=>setNewOpt(p=>({...p,priceAddon:e.target.value}))} placeholder="+฿" className="w-16 bg-white border rounded-lg py-1.5 px-2 text-xs focus:outline-none" style={{borderColor:C[200]}}/>
                    <button onClick={()=>createOption(g.id)} className="w-7 h-7 rounded-lg flex items-center justify-center text-white" style={{background:C[400]}}><Check size={12}/></button>
                    <button onClick={()=>{setAddOption(null);setNewOpt({label:'',priceAddon:''});}} className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-gray-100" style={{color:C[500]}}><X size={12}/></button>
                  </div>
                ):(
                  <button onClick={()=>setAddOption(g.id)} className="flex items-center gap-1 text-xs font-bold pt-1 transition-colors" style={{color:C[400]}}><Plus size={12}/>เพิ่มตัวเลือก</button>
                )}
              </div>
            </div>
          ))}

          {addGroup?(
            <div className="border rounded-xl p-4 space-y-3" style={{borderColor:C[200]}}>
              <input value={newGroup.name} onChange={e=>setNewGroup(p=>({...p,name:e.target.value}))} placeholder="ชื่อกลุ่มตัวเลือก เช่น เลือก Size" className="w-full bg-white border rounded-xl py-2.5 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8956a]/40" style={{borderColor:C[200]}}/>
              <div className="flex gap-3">
                <label className="flex items-center gap-2 text-xs cursor-pointer" style={{color:C[600]}}><input type="checkbox" checked={newGroup.isRequired} onChange={e=>setNewGroup(p=>({...p,isRequired:e.target.checked}))} className="rounded"/>บังคับเลือก</label>
                <div className="flex items-center gap-1 text-xs" style={{color:C[600]}}>เลือกได้ <input type="number" min={1} value={newGroup.maxSelect} onChange={e=>setNewGroup(p=>({...p,maxSelect:parseInt(e.target.value)||1}))} className="w-12 bg-white border rounded py-1 px-2 text-center text-xs" style={{borderColor:C[200]}}/> รายการ</div>
              </div>
              <div className="flex gap-2">
                <button onClick={createGroup} className="flex-1 py-2 rounded-xl text-white text-xs font-bold flex items-center justify-center gap-1" style={{background:C[400]}}><Check size={12}/>สร้าง</button>
                <button onClick={()=>setAddGroup(false)} className="flex-1 py-2 rounded-xl text-xs font-bold" style={{background:C[100],color:C[600]}}>ยกเลิก</button>
              </div>
            </div>
          ):(
            <button onClick={()=>setAddGroup(true)} className="w-full py-3 border-2 border-dashed rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-colors hover:bg-[#f5ebe0]" style={{borderColor:C[300],color:C[500]}}>
              <Plus size={16}/>เพิ่มกลุ่มตัวเลือก
            </button>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function ProductsPage() {
  const [categories,setCategories]=useState<Category[]>([]);
  const [items,setItems]=useState<MenuItem[]>([]);
  const [loading,setLoading]=useState(true);
  const [activeCat,setActiveCat]=useState<string|null>(null);
  const [search,setSearch]=useState('');
  const [statusFilter,setStatusFilter]=useState<string|null>(null);
  const [toast,setToast]=useState<{msg:string;type:'success'|'error'}|null>(null);
  const [catModal,setCatModal]=useState<{open:boolean;cat?:Category|null}>({open:false});
  const [itemModal,setItemModal]=useState<{open:boolean;item?:MenuItem|null}>({open:false});
  const [optDrawer,setOptDrawer]=useState<MenuItem|null>(null);

  const showToast=(msg:string,type:'success'|'error'='success')=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  const fetchAll=useCallback(async()=>{
    try{
      const [catRes,itemRes]=await Promise.all([fetch(`${API}/categories`),fetch(`${API}/menu`)]);
      setCategories(await catRes.json());
      setItems(await itemRes.json());
    }catch(e){console.error(e);}finally{setLoading(false);}
  },[]);

  useEffect(()=>{fetchAll();},[]);

  // Filtered items
  const filtered=items.filter(i=>{
    if(activeCat&&i.categoryId!==activeCat)return false;
    if(statusFilter&&i.status!==statusFilter)return false;
    if(search&&!i.name.toLowerCase().includes(search.toLowerCase()))return false;
    return true;
  });

  // Category CRUD
  const saveCategory=async(data:any)=>{
    if(catModal.cat){
      const res=await fetch(`${API}/categories/${catModal.cat.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      if(res.ok){showToast('อัปเดตหมวดหมู่สำเร็จ');fetchAll();}
    }else{
      const res=await fetch(`${API}/categories`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      if(res.ok){showToast('เพิ่มหมวดหมู่สำเร็จ');fetchAll();}
    }
  };

  const deleteCategory=async(id:string)=>{
    await fetch(`${API}/categories/${id}`,{method:'DELETE'});
    if(activeCat===id)setActiveCat(null);
    showToast('ลบหมวดหมู่สำเร็จ');fetchAll();
  };

  // Menu Item CRUD
  const saveMenuItem=async(data:any)=>{
    if(itemModal.item){
      const res=await fetch(`${API}/menu/${itemModal.item.id}`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      if(res.ok){showToast('อัปเดตเมนูสำเร็จ');fetchAll();}
    }else{
      const res=await fetch(`${API}/menu`,{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
      if(res.ok){showToast('เพิ่มเมนูสำเร็จ');fetchAll();}
    }
  };

  const deleteMenuItem=async(id:string)=>{
    await fetch(`${API}/menu/${id}`,{method:'DELETE'});
    showToast('ลบเมนูสำเร็จ');fetchAll();
  };

  const toggleStatus=async(item:MenuItem)=>{
    const next=item.status==='AVAILABLE'?'OUT_OF_STOCK':item.status==='OUT_OF_STOCK'?'HIDDEN':'AVAILABLE';
    const res=await fetch(`${API}/menu/${item.id}/status`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status:next})});
    if(res.ok){showToast(`สถานะ: ${STATUS_CFG[next].label}`);fetchAll();}
  };

  if(loading)return <div className="flex-1 flex items-center justify-center"><Loader2 size={32} className="animate-spin" style={{color:C[400]}}/></div>;

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Category Sidebar */}
      <div className="w-56 shrink-0 flex flex-col overflow-hidden" style={{borderRight:`1px solid ${C[200]}`,background:'#ffffff'}}>
        <div className="px-5 pt-7 pb-3 shrink-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-bold flex items-center gap-1.5" style={{color:C[800]}}><Layers size={14} style={{color:C[400]}}/>หมวดหมู่</h2>
            <button onClick={()=>setCatModal({open:true,cat:null})} className="w-6 h-6 rounded-lg flex items-center justify-center text-white" style={{background:C[400]}}><Plus size={13}/></button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto px-3 pb-4 no-scrollbar space-y-1">
          <button onClick={()=>setActiveCat(null)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${!activeCat?'text-white':'hover:bg-gray-50'}`} style={!activeCat?{background:C[400]}:{color:C[600]}}>
            <Coffee size={14}/>ทั้งหมด <span className="ml-auto text-xs opacity-70">{items.length}</span>
          </button>
          {categories.map(cat=>(
            <div key={cat.id} className="group">
              <button onClick={()=>setActiveCat(cat.id)} className={`w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-semibold transition-all ${activeCat===cat.id?'text-white':'hover:bg-gray-50'}`} style={activeCat===cat.id?{background:C[400]}:{color:C[600]}}>
                <span>{cat.icon||'📂'}</span>{cat.name}
                <span className="ml-auto text-xs opacity-70">{cat._count.products}</span>
                <div className="hidden group-hover:flex gap-0.5 ml-1">
                  <button onClick={e=>{e.stopPropagation();setCatModal({open:true,cat});}} className="w-5 h-5 rounded flex items-center justify-center hover:bg-white/30"><Edit2 size={9}/></button>
                  <button onClick={e=>{e.stopPropagation();deleteCategory(cat.id);}} className="w-5 h-5 rounded flex items-center justify-center hover:bg-rose-100 text-rose-500"><Trash2 size={9}/></button>
                </div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Menu Grid */}
      <div className="flex-1 flex flex-col overflow-hidden" style={{background:C[50]}}>
        {/* Toolbar */}
        <div className="px-8 py-5 flex items-center gap-4 shrink-0" style={{borderBottom:`1px solid ${C[200]}`,background:'#ffffff'}}>
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:C[400]}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาเมนู..." className="w-full bg-white border rounded-xl py-2 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#b8956a]/30" style={{borderColor:C[200]}}/>
          </div>
          <div className="flex gap-1">
            {[null,...Object.keys(STATUS_CFG)].map(s=>(
              <button key={s||'all'} onClick={()=>setStatusFilter(s)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${statusFilter===s?'text-white border-transparent':'border-gray-200 hover:border-gray-300'}`} style={statusFilter===s?{background:C[400]}:{color:C[600]}}>
                {s?STATUS_CFG[s].label:'ทั้งหมด'}
              </button>
            ))}
          </div>
          <motion.button whileHover={{scale:1.02}} whileTap={{scale:0.98}} onClick={()=>setItemModal({open:true,item:null})}
            className="px-4 py-2 rounded-xl text-white text-sm font-bold flex items-center gap-2 shadow-md ml-auto" style={{background:C[400]}}>
            <Plus size={16}/>เพิ่มเมนู
          </motion.button>
        </div>

        {/* Items Grid */}
        <div className="flex-1 overflow-y-auto p-8 no-scrollbar">
          {filtered.length===0?(
            <div className="flex flex-col items-center justify-center py-16"><Coffee size={40} className="mb-4" style={{color:C[300]}}/><p className="font-bold" style={{color:C[600]}}>ไม่พบเมนู</p><p className="text-xs mt-1" style={{color:C[400]}}>กด "+ เพิ่มเมนู" เพื่อสร้างเมนูใหม่</p></div>
          ):(
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
              <AnimatePresence>
                {filtered.map(item=>{
                  const tags:string[]=JSON.parse(item.tags||'[]');
                  const stCfg=STATUS_CFG[item.status]||STATUS_CFG['AVAILABLE'];
                  return (
                    <motion.div key={item.id} layout initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} exit={{opacity:0,scale:0.95}}
                      className="bg-white border rounded-2xl overflow-hidden group transition-shadow hover:shadow-lg" style={{borderColor:C[200]}}>
                      {/* Image */}
                      <div className="h-36 relative overflow-hidden" style={{background:`linear-gradient(135deg, ${C[100]}, ${C[50]})`}}>
                        {item.imageUrl?<img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover"/>
                        :<div className="w-full h-full flex items-center justify-center"><Coffee size={32} style={{color:C[300]}}/></div>}
                        {/* Status badge */}
                        <div className={`absolute top-2 left-2 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${stCfg.color}`}>{stCfg.label}</div>
                        {/* Tags */}
                        {tags.length>0&&<div className="absolute top-2 right-2 flex gap-1">{tags.map(t=><span key={t} className={`px-1.5 py-0.5 rounded text-[9px] font-bold ${TAG_COLORS[t]||'bg-gray-100 text-gray-600'}`}>{t}</span>)}</div>}
                        {/* Hover actions */}
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                          <button onClick={()=>setItemModal({open:true,item})} className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"><Edit2 size={14} style={{color:C[600]}}/></button>
                          <button onClick={()=>setOptDrawer(item)} className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"><Settings2 size={14} style={{color:C[600]}}/></button>
                          <button onClick={()=>toggleStatus(item)} className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform">{item.status==='AVAILABLE'?<EyeOff size={14} className="text-amber-600"/>:<Eye size={14} className="text-emerald-600"/>}</button>
                          <button onClick={()=>deleteMenuItem(item.id)} className="w-9 h-9 rounded-xl bg-white flex items-center justify-center shadow-md hover:scale-110 transition-transform"><Trash2 size={14} className="text-rose-500"/></button>
                        </div>
                      </div>
                      {/* Info */}
                      <div className="p-4">
                        <div className="flex items-start justify-between mb-1">
                          <h3 className="font-bold text-sm truncate" style={{color:C[800]}}>{item.name}</h3>
                          <span className="font-extrabold text-sm shrink-0 ml-2" style={{color:C[400]}}>฿{item.price}</span>
                        </div>
                        {item.description&&<p className="text-xs line-clamp-2 mb-2" style={{color:C[500]}}>{item.description}</p>}
                        <div className="flex items-center gap-2 text-[10px]" style={{color:C[400]}}>
                          {item.category&&<span className="flex items-center gap-0.5">{item.category.icon} {item.category.name}</span>}
                          {item.optionGroups.length>0&&<span className="flex items-center gap-0.5"><Settings2 size={9}/>{item.optionGroups.length} ตัวเลือก</span>}
                          <span className="flex items-center gap-0.5 ml-auto"><Package size={9}/>{item._count.orderItems} ขาย</span>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>

      {/* Modals */}
      <AnimatePresence>
        {catModal.open&&<CategoryModal cat={catModal.cat} onClose={()=>setCatModal({open:false})} onSave={saveCategory}/>}
        {itemModal.open&&<MenuItemModal item={itemModal.item} categories={categories} onClose={()=>setItemModal({open:false})} onSave={saveMenuItem}/>}
        {optDrawer&&<OptionsDrawer item={optDrawer} onClose={()=>setOptDrawer(null)} onRefresh={fetchAll} showToast={showToast}/>}
      </AnimatePresence>
      <AnimatePresence>{toast&&<Toast msg={toast.msg} type={toast.type}/>}</AnimatePresence>
    </div>
  );
}
