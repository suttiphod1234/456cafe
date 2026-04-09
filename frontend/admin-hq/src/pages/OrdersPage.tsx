import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShoppingBag, Search, Filter, X, Check, Loader2, AlertTriangle,
  Clock, DollarSign, Coffee, ChevronRight, User, MapPin,
  CreditCard, Banknote, QrCode, Truck, Store, Eye, Ban,
  TrendingUp, Package, CalendarDays, Receipt, ArrowRight
} from 'lucide-react';

const API = 'http://localhost:5001/api';
const C = { 50:'#fdf8f0',100:'#f5ebe0',200:'#e8d5c0',300:'#d4b896',400:'#b8956a',500:'#9c7a50',600:'#7a5c3a',700:'#5c4428',800:'#3d2d1a' };

interface OrderItem { id:string; productId:string; product?:any; quantity:number; unitPrice:number; optionsPrice:number; price:number; productName?:string; customization?:any; selectedOptions?:any; }
interface Payment { id:string; amount:number; status:string; method:string; transactionId?:string; paidAt?:string; }
interface Order { id:string; orderNo:string; branchId:string; branch?:any; customerUid:string; customerName?:string; totalAmount:number; status:string; fulfillmentType:string; note?:string; scheduledAt?:string; items:OrderItem[]; payment?:Payment; createdAt:string; }
interface Branch { id:string; name:string; }
interface Stats { total:number; todayCount:number; todayRevenue:number; totalRevenue:number; byStatus:Record<string,number>; }

const STATUS_FLOW = ['PENDING','PAID','PREPARING','READY','COMPLETED','PICKED_UP','CANCELLED'] as const;
const STATUS_CFG:Record<string,{label:string;color:string;bg:string;icon:typeof Clock}> = {
  PENDING:    {label:'รอชำระ',     color:'text-amber-700',   bg:'bg-amber-50 border-amber-200',   icon:Clock},
  PAID:       {label:'ชำระแล้ว',   color:'text-blue-700',    bg:'bg-blue-50 border-blue-200',     icon:CreditCard},
  PREPARING:  {label:'กำลังทำ',    color:'text-indigo-700',  bg:'bg-indigo-50 border-indigo-200', icon:Coffee},
  READY:      {label:'พร้อมรับ',   color:'text-emerald-700', bg:'bg-emerald-50 border-emerald-200',icon:Check},
  COMPLETED:  {label:'เสร็จสิ้น', color:'text-green-700',   bg:'bg-green-50 border-green-200',   icon:Package},
  PICKED_UP:  {label:'รับแล้ว',   color:'text-gray-600',    bg:'bg-gray-50 border-gray-200',     icon:Truck},
  CANCELLED:  {label:'ยกเลิก',    color:'text-rose-700',    bg:'bg-rose-50 border-rose-200',     icon:Ban},
};

const PAY_METHOD:Record<string,{label:string;icon:typeof Banknote}> = {
  CASH:     {label:'เงินสด',   icon:Banknote},
  QR:       {label:'QR Code',  icon:QrCode},
  TRANSFER: {label:'โอนเงิน', icon:CreditCard},
  ONLINE:   {label:'Online',   icon:CreditCard},
};

function Toast({msg,type}:{msg:string;type:'success'|'error'}) {
  return <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} exit={{opacity:0,y:20}}
    className={`fixed bottom-8 left-1/2 -translate-x-1/2 px-6 py-3 rounded-2xl text-sm font-bold shadow-xl flex items-center gap-3 z-[100] text-white ${type==='success'?'bg-emerald-600':'bg-rose-600'}`}>
    {type==='success'?<Check size={16}/>:<AlertTriangle size={16}/>}{msg}</motion.div>;
}

function StatusBadge({status}:{status:string}) {
  const cfg=STATUS_CFG[status]||STATUS_CFG['PENDING'];
  const Icon=cfg.icon;
  return <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold border ${cfg.bg} ${cfg.color}`}><Icon size={10}/>{cfg.label}</span>;
}

// ─── Order Detail Panel ─────────────────────────────────────────────────

function OrderDetail({order,onStatusChange,onPayment,onCancel,showToast}:{order:Order;onStatusChange:(id:string,s:string)=>void;onPayment:(id:string,d:any)=>void;onCancel:(id:string)=>void;showToast:(m:string,t?:'success'|'error')=>void}) {
  const nextStatus=():string|null=>{
    const flow=['PENDING','PAID','PREPARING','READY','COMPLETED'];
    const idx=flow.indexOf(order.status);
    return idx>=0&&idx<flow.length-1?flow[idx+1]:null;
  };
  const next=nextStatus();

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="px-8 pt-8 pb-5 shrink-0" style={{borderBottom:`1px solid ${C[200]}`}}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="font-bold text-lg tracking-tight" style={{color:C[800]}}>{order.orderNo}</h3>
              <StatusBadge status={order.status}/>
            </div>
            <p className="text-xs" style={{color:C[500]}}>{new Date(order.createdAt).toLocaleString('th-TH')}</p>
          </div>
          <div className="flex gap-2">
            {next&&order.status!=='CANCELLED'&&(
              <motion.button whileTap={{scale:0.95}} onClick={()=>onStatusChange(order.id,next)}
                className="px-4 py-2 rounded-xl text-white text-xs font-bold flex items-center gap-1.5 shadow-md" style={{background:C[400]}}>
                <ArrowRight size={13}/>{STATUS_CFG[next]?.label||next}
              </motion.button>
            )}
            {!['COMPLETED','PICKED_UP','CANCELLED'].includes(order.status)&&(
              <button onClick={()=>onCancel(order.id)} className="px-3 py-2 rounded-xl text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200 hover:bg-rose-100 transition-all flex items-center gap-1"><Ban size={12}/>ยกเลิก</button>
            )}
          </div>
        </div>
        {/* Info chips */}
        <div className="flex gap-3 flex-wrap">
          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg" style={{background:C[100],color:C[600]}}><Store size={11}/>{order.branch?.name||'ไม่ระบุสาขา'}</span>
          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg" style={{background:C[100],color:C[600]}}><User size={11}/>{order.customerName||order.customerUid}</span>
          <span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg" style={{background:C[100],color:C[600]}}>{order.fulfillmentType==='DELIVERY'?<Truck size={11}/>:<MapPin size={11}/>}{order.fulfillmentType==='DELIVERY'?'จัดส่ง':'รับที่ร้าน'}</span>
          {order.scheduledAt&&<span className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg bg-purple-50 text-purple-700 border border-purple-200"><CalendarDays size={11}/>สั่งล่วงหน้า {new Date(order.scheduledAt).toLocaleString('th-TH',{hour:'2-digit',minute:'2-digit'})}</span>}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
        {/* Items */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{color:C[500]}}><Receipt size={10}/>รายการสั่งซื้อ ({order.items.length} รายการ)</p>
          <div className="space-y-2">
            {order.items.map(item=>(
              <div key={item.id} className="bg-white border rounded-xl px-4 py-3 flex items-center gap-3" style={{borderColor:C[200]}}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0" style={{background:C[100]}}><Coffee size={16} style={{color:C[400]}}/></div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-sm truncate" style={{color:C[800]}}>{item.productName||item.product?.name||'เมนู'}</p>
                  <div className="flex gap-2 text-[10px] mt-0.5" style={{color:C[500]}}>
                    <span>×{item.quantity}</span>
                    <span>฿{item.unitPrice}</span>
                    {item.optionsPrice>0&&<span>+฿{item.optionsPrice}</span>}
                  </div>
                  {item.selectedOptions&&(() => { try { const opts = typeof item.selectedOptions==='string'?JSON.parse(item.selectedOptions):item.selectedOptions; return Array.isArray(opts)&&opts.length>0?<div className="flex gap-1 mt-1 flex-wrap">{opts.map((o:any,i:number)=><span key={i} className="text-[9px] px-1.5 py-0.5 rounded" style={{background:C[100],color:C[600]}}>{o.group}: {o.label}{o.priceAddon>0?` +฿${o.priceAddon}`:''}</span>)}</div>:null; } catch { return null; } })()}
                </div>
                <p className="font-bold text-sm shrink-0" style={{color:C[400]}}>฿{item.price}</p>
              </div>
            ))}
          </div>
        </div>

        {order.note&&<div><p className="text-[10px] font-bold uppercase tracking-widest mb-2" style={{color:C[500]}}>หมายเหตุ</p><p className="text-sm bg-white border rounded-xl px-4 py-3" style={{borderColor:C[200],color:C[700]}}>{order.note}</p></div>}

        {/* Payment */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{color:C[500]}}><CreditCard size={10}/>การชำระเงิน</p>
          <div className="bg-white border rounded-xl p-4" style={{borderColor:C[200]}}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-sm" style={{color:C[600]}}>ยอดรวม</span>
              <span className="text-xl font-extrabold" style={{color:C[800]}}>฿{order.totalAmount.toLocaleString()}</span>
            </div>
            {order.payment&&(
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-lg font-bold border ${order.payment.status==='PAID'?'bg-emerald-50 text-emerald-700 border-emerald-200':order.payment.status==='REFUNDED'?'bg-rose-50 text-rose-700 border-rose-200':'bg-amber-50 text-amber-700 border-amber-200'}`}>{order.payment.status==='PAID'?'จ่ายแล้ว':order.payment.status==='REFUNDED'?'คืนเงิน':'ยังไม่จ่าย'}</span>
                  <span className="text-xs" style={{color:C[500]}}>{PAY_METHOD[order.payment.method]?.label||order.payment.method}</span>
                </div>
                {order.payment.status==='UNPAID'&&order.status!=='CANCELLED'&&(
                  <button onClick={()=>onPayment(order.id,{status:'PAID'})} className="px-3 py-1.5 rounded-lg bg-emerald-600 text-white text-[10px] font-bold flex items-center gap-1"><Check size={10}/>ยืนยันชำระ</button>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Status Timeline */}
        <div>
          <p className="text-[10px] font-bold uppercase tracking-widest mb-3 flex items-center gap-1.5" style={{color:C[500]}}><Clock size={10}/>สถานะ</p>
          <div className="flex gap-1">
            {['PENDING','PAID','PREPARING','READY','COMPLETED'].map((s,i)=>{
              const isActive=STATUS_FLOW.indexOf(order.status as any)>=STATUS_FLOW.indexOf(s as any);
              const isCancelled=order.status==='CANCELLED';
              return (
                <div key={s} className="flex-1">
                  <div className={`h-1.5 rounded-full transition-all ${isCancelled?'bg-rose-200':isActive?'bg-emerald-400':'bg-gray-200'}`}/>
                  <p className={`text-[9px] mt-1 text-center font-bold ${isCancelled?'text-rose-400':isActive?'text-emerald-600':'text-gray-400'}`}>{STATUS_CFG[s]?.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────

export default function OrdersPage() {
  const [orders,setOrders]=useState<Order[]>([]);
  const [branches,setBranches]=useState<Branch[]>([]);
  const [stats,setStats]=useState<Stats|null>(null);
  const [loading,setLoading]=useState(true);
  const [selectedId,setSelectedId]=useState<string|null>(null);
  const [statusFilter,setStatusFilter]=useState<string|null>(null);
  const [branchFilter,setBranchFilter]=useState<string>('');
  const [search,setSearch]=useState('');
  const [toast,setToast]=useState<{msg:string;type:'success'|'error'}|null>(null);
  const showToast=(msg:string,type:'success'|'error'='success')=>{setToast({msg,type});setTimeout(()=>setToast(null),3000);};

  const fetchAll=useCallback(async()=>{
    try{
      const params=new URLSearchParams();
      if(statusFilter)params.append('status',statusFilter);
      if(branchFilter)params.append('branchId',branchFilter);
      if(search)params.append('search',search);
      const [ordersRes,branchRes,statsRes]=await Promise.all([
        fetch(`${API}/orders?${params}`),
        fetch(`${API}/branches`),
        fetch(`${API}/orders/stats`),
      ]);
      const ordersData=await ordersRes.json();
      setOrders(ordersData);
      setBranches(await branchRes.json());
      setStats(await statsRes.json());
      if(ordersData.length>0&&!selectedId)setSelectedId(ordersData[0].id);
    }catch(e){console.error(e);}finally{setLoading(false);}
  },[statusFilter,branchFilter,search]);

  useEffect(()=>{fetchAll();},[fetchAll]);

  const selected=orders.find(o=>o.id===selectedId)||null;

  const handleStatusChange=async(id:string,status:string)=>{
    const res=await fetch(`${API}/orders/${id}/status`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({status})});
    if(res.ok){showToast(`สถานะ: ${STATUS_CFG[status]?.label||status}`);fetchAll();}else showToast('อัปเดตไม่สำเร็จ','error');
  };

  const handlePayment=async(id:string,data:any)=>{
    const res=await fetch(`${API}/orders/${id}/payment`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify(data)});
    if(res.ok){showToast('ยืนยันชำระเงินสำเร็จ');fetchAll();}else showToast('ชำระเงินไม่สำเร็จ','error');
  };

  const handleCancel=async(id:string)=>{
    const res=await fetch(`${API}/orders/${id}/cancel`,{method:'PATCH',headers:{'Content-Type':'application/json'},body:JSON.stringify({})});
    if(res.ok){showToast('ยกเลิกออเดอร์สำเร็จ');fetchAll();}else showToast('ยกเลิกไม่สำเร็จ','error');
  };

  if(loading)return <div className="flex-1 flex items-center justify-center"><Loader2 size={32} className="animate-spin" style={{color:C[400]}}/></div>;

  return (
    <div className="flex-1 flex overflow-hidden">
      {/* Order List (Left) */}
      <div className="w-[420px] shrink-0 flex flex-col overflow-hidden" style={{borderRight:`1px solid ${C[200]}`,background:'#ffffff'}}>
        {/* Stats Bar */}
        {stats&&(
          <div className="grid grid-cols-3 gap-2 px-5 pt-5 pb-3 shrink-0">
            {[{label:'วันนี้',value:stats.todayCount,sub:`฿${stats.todayRevenue.toLocaleString()}`,icon:TrendingUp,ic:'text-emerald-600'},
              {label:'ทั้งหมด',value:stats.total,sub:`฿${stats.totalRevenue.toLocaleString()}`,icon:Package,ic:'text-blue-600'},
              {label:'รอดำเนินการ',value:(stats.byStatus['PENDING']||0)+(stats.byStatus['PAID']||0)+(stats.byStatus['PREPARING']||0),sub:'needs action',icon:Clock,ic:'text-amber-600'}
            ].map(s=>{const Icon=s.icon;return(
              <div key={s.label} className="rounded-xl p-2.5 border" style={{borderColor:C[200]}}>
                <Icon size={14} className={`mb-1 ${s.ic}`}/>
                <p className="text-lg font-extrabold" style={{color:C[800]}}>{s.value}</p>
                <p className="text-[9px]" style={{color:C[500]}}>{s.label}</p>
              </div>
            );})}
          </div>
        )}

        {/* Filters */}
        <div className="px-5 pb-3 space-y-2 shrink-0">
          <div className="relative">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{color:C[400]}}/>
            <input value={search} onChange={e=>setSearch(e.target.value)} placeholder="ค้นหาเลขออเดอร์, ลูกค้า..." className="w-full border rounded-xl py-2 pl-9 pr-3 text-xs focus:outline-none focus:ring-1 focus:ring-[#b8956a]/40" style={{borderColor:C[200]}}/>
          </div>
          <div className="flex gap-1 flex-wrap">
            <button onClick={()=>setStatusFilter(null)} className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${!statusFilter?'text-white border-transparent':'border-gray-200'}`} style={!statusFilter?{background:C[400]}:{color:C[600]}}>ทั้งหมด</button>
            {['PENDING','PAID','PREPARING','READY','COMPLETED','CANCELLED'].map(s=>(
              <button key={s} onClick={()=>setStatusFilter(s)} className={`px-2 py-1 rounded-lg text-[10px] font-bold border transition-all ${statusFilter===s?STATUS_CFG[s].bg+' '+STATUS_CFG[s].color:'border-gray-200'}`} style={statusFilter!==s?{color:C[600]}:{}}>{STATUS_CFG[s].label}</button>
            ))}
          </div>
          <select value={branchFilter} onChange={e=>setBranchFilter(e.target.value)} className="w-full border rounded-xl py-1.5 px-3 text-xs focus:outline-none" style={{borderColor:C[200],color:C[600]}}>
            <option value="">ทุกสาขา</option>
            {branches.map(b=><option key={b.id} value={b.id}>{b.name}</option>)}
          </select>
        </div>

        {/* Order List */}
        <div className="flex-1 overflow-y-auto px-3 pb-4 no-scrollbar space-y-1.5">
          {orders.length===0?(
            <div className="flex flex-col items-center justify-center py-16"><ShoppingBag size={28} className="mb-3" style={{color:C[300]}}/><p className="text-sm" style={{color:C[500]}}>ไม่พบคำสั่งซื้อ</p></div>
          ):orders.map(order=>(
            <motion.div key={order.id} layout onClick={()=>setSelectedId(order.id)}
              className={`rounded-xl px-4 py-3 cursor-pointer border transition-all ${selectedId===order.id?'border-[#b8956a] shadow-sm':'border-transparent hover:border-[#e8d5c0]'}`}
              style={{background:selectedId===order.id?C[50]:'transparent'}}>
              <div className="flex items-center justify-between mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono font-bold" style={{color:C[400]}}>{order.orderNo}</span>
                  <StatusBadge status={order.status}/>
                </div>
                <span className="text-sm font-bold" style={{color:C[800]}}>฿{order.totalAmount}</span>
              </div>
              <div className="flex items-center gap-3 text-[10px]" style={{color:C[500]}}>
                <span className="flex items-center gap-0.5"><Store size={9}/>{order.branch?.name||'—'}</span>
                <span className="flex items-center gap-0.5"><User size={9}/>{order.customerName||order.customerUid.substring(0,8)}</span>
                <span className="ml-auto">{new Date(order.createdAt).toLocaleTimeString('th-TH',{hour:'2-digit',minute:'2-digit'})}</span>
              </div>
              <div className="flex gap-1 mt-1.5 flex-wrap">{order.items.slice(0,3).map(it=><span key={it.id} className="text-[9px] px-1.5 py-0.5 rounded" style={{background:C[100],color:C[600]}}>{it.productName||it.product?.name||'เมนู'} ×{it.quantity}</span>)}{order.items.length>3&&<span className="text-[9px] px-1.5 py-0.5 rounded" style={{background:C[100],color:C[400]}}>+{order.items.length-3}</span>}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Order Detail (Right) */}
      <div className="flex-1 overflow-hidden" style={{background:C[50]}}>
        {selected?(
          <OrderDetail key={selected.id} order={selected} onStatusChange={handleStatusChange} onPayment={handlePayment} onCancel={handleCancel} showToast={showToast}/>
        ):(
          <div className="flex flex-col items-center justify-center h-full"><ShoppingBag size={40} className="mb-4" style={{color:C[300]}}/><p className="font-bold" style={{color:C[600]}}>เลือกคำสั่งซื้อเพื่อดูรายละเอียด</p></div>
        )}
      </div>

      <AnimatePresence>{toast&&<Toast msg={toast.msg} type={toast.type}/>}</AnimatePresence>
    </div>
  );
}
