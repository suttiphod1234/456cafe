import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Store, Coffee, CheckSquare, Truck, Package, 
  MapPin, Clock, Info, AlertCircle, Search, 
  Plus, Printer, CreditCard, User, Phone, Globe,
  ShoppingBag, X, ChevronRight, Check
} from 'lucide-react';

const API_BASE = 'http://localhost:5001/api';

export default function POSView({ branch, orders, updateStatus }: any) {
  const [activeTab, setActiveTab] = useState<'feed' | 'menu'>('feed');
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  
  // Ordering State
  const [cart, setCart] = useState<any[]>([]);
  const [configuringProduct, setConfiguringProduct] = useState<any>(null);
  const [selectedOptions, setSelectedOptions] = useState<any>({}); // groupId -> optionId
  const [showCheckout, setShowCheckout] = useState(false);
  const [checkoutData, setCheckoutData] = useState({
    customerName: '',
    paymentMethod: 'CASH',
    note: ''
  });

  // 1. Fetch Menu Data
  useEffect(() => {
    if (activeTab === 'menu') {
      Promise.all([
        fetch(`${API_BASE}/categories`).then(res => res.json()),
        fetch(`${API_BASE}/menu`).then(res => res.json())
      ]).then(([cats, prods]) => {
        setCategories(cats);
        setProducts(prods);
        if (cats.length > 0 && !selectedCategory) setSelectedCategory(cats[0].id);
      });
    }
  }, [activeTab]);

  const filteredProducts = products.filter(p => !selectedCategory || p.categoryId === selectedCategory);

  const addToCart = () => {
    if (!configuringProduct) return;
    
    // Calculate total item price
    let optionsPrice = 0;
    const selection: any[] = [];
    
    // Find selected options details
    Object.keys(selectedOptions).forEach(groupId => {
      const group = configuringProduct.optionGroups.find((g: any) => g.id === groupId);
      const option = group.options.find((o: any) => o.id === selectedOptions[groupId]);
      if (option) {
        optionsPrice += option.priceAddon;
        selection.push({ groupId, groupName: group.name, optionId: option.id, label: option.label, priceAddon: option.priceAddon });
      }
    });

    const cartItem = {
      productId: configuringProduct.id,
      productName: configuringProduct.name,
      basePrice: configuringProduct.price,
      optionsPrice,
      totalPrice: configuringProduct.price + optionsPrice,
      quantity: 1,
      selectedOptions: selection
    };

    setCart([...cart, cartItem]);
    setConfiguringProduct(null);
    setSelectedOptions({});
  };

  const removeFromCart = (index: number) => {
    setCart(cart.filter((_, i) => i !== index));
  };

  const cartTotal = cart.reduce((sum, item) => sum + item.totalPrice * item.quantity, 0);

  const handleCheckout = async () => {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchId: branch.id,
          platform: 'STORE',
          customerName: checkoutData.customerName || 'Walk-in',
          note: checkoutData.note,
          totalAmount: cartTotal,
          items: cart.map(item => ({
            productId: item.productId,
            name: item.productName,
            quantity: item.quantity,
            price: item.basePrice,
            optionsPrice: item.optionsPrice,
            selectedOptions: item.selectedOptions
          })),
          paymentMethod: checkoutData.paymentMethod,
        })
      });

      if (res.ok) {
        setCart([]);
        setShowCheckout(false);
        setActiveTab('feed');
        setCheckoutData({ customerName: '', paymentMethod: 'CASH', note: '' });
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#f8f5f1]">
      {/* Tab Switcher */}
      <div className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shadow-sm">
        <div className="flex bg-gray-100 p-1 rounded-2xl">
           <button 
             onClick={() => setActiveTab('feed')}
             className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'feed' ? 'bg-white text-[#7c543c] shadow-sm' : 'text-gray-400'}`}
           >
              Active Orders
           </button>
           <button 
             onClick={() => setActiveTab('menu')}
             className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'menu' ? 'bg-white text-[#7c543c] shadow-sm' : 'text-gray-400'}`}
           >
              Order Menu
           </button>
        </div>
        
        {activeTab === 'feed' && (
           <div className="relative w-96">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input type="text" placeholder="Search orders..." className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7c543c]/20 text-sm" />
           </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden flex">
        {activeTab === 'feed' ? (
          /* --- FEED VIEW --- */
          <div className="flex-1 flex p-6 gap-6">
            <div className="w-64 flex flex-col gap-2">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-2">Sources</h3>
               <div className="space-y-1">
                 {['All', 'Store', 'Grab', 'LINE'].map(s => (
                   <button key={s} className="w-full text-left p-4 rounded-2xl hover:bg-white font-bold text-sm text-gray-500 hover:text-[#7c543c] transition-all">
                      {s} Orders
                   </button>
                 ))}
               </div>
            </div>
            <div className="flex-1 overflow-y-auto pr-2 space-y-4 no-scrollbar">
               {orders.map((order: any) => (
                 <motion.div key={order.id} className="bg-white p-6 rounded-3xl shadow-sm border border-transparent hover:border-[#7c543c]/10 flex items-center justify-between group">
                    <div className="flex items-center gap-6">
                       <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-xl ${order.platform === 'GRAB' ? 'bg-[#00b14f]' : order.platform === 'LINE' ? 'bg-[#00c300]' : 'bg-[#7c543c]'}`}>
                          {order.queueNo || order.platform.charAt(0)}
                       </div>
                       <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-black text-blue-500 uppercase">Q#{order.queueNo}</span>
                            <span className="px-2 py-0.5 rounded-full bg-gray-100 text-[10px] font-bold text-gray-400">{order.status}</span>
                          </div>
                          <h4 className="font-black text-slate-800">{order.customerName || 'Walk-in'}</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">{order.items?.length} items • {new Date(order.createdAt).toLocaleTimeString()}</p>
                       </div>
                    </div>
                    <div className="flex items-center gap-3">
                       <button className="p-3 text-gray-300 opacity-0 group-hover:opacity-100"><Printer size={18} /></button>
                       {order.status === 'PAID' && (
                         <button onClick={() => updateStatus(order.id, 'PREPARING')} className="bg-[#7c543c] text-white px-6 py-3 rounded-2xl font-black text-xs shadow-md">
                            PREPARE
                         </button>
                       )}
                    </div>
                 </motion.div>
               ))}
            </div>
          </div>
        ) : (
          /* --- MENU VIEW --- */
          <div className="flex-1 flex overflow-hidden">
             {/* Categories */}
             <div className="w-24 bg-white border-r border-gray-100 flex flex-col items-center py-6 gap-6">
                {categories.map(cat => (
                  <button 
                    key={cat.id} 
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`w-16 h-16 rounded-2xl flex flex-col items-center justify-center transition-all ${selectedCategory === cat.id ? 'bg-[#7c543c] text-white shadow-xl' : 'text-gray-400 hover:bg-gray-50'}`}
                  >
                     <span className="text-2xl">{cat.icon || '☕'}</span>
                     <span className="text-[8px] font-black uppercase mt-1 text-center px-1">{cat.name}</span>
                  </button>
                ))}
             </div>

             {/* Products Grid */}
             <div className="flex-1 p-8 overflow-y-auto no-scrollbar">
                <div className="grid grid-cols-4 gap-6">
                   {filteredProducts.map(p => (
                     <motion.button
                       key={p.id}
                       whileHover={{ y: -5 }}
                       whileTap={{ scale: 0.95 }}
                       onClick={() => {
                          setConfiguringProduct(p);
                          // Default options
                          const defaults: any = {};
                          p.optionGroups?.forEach((g: any) => {
                             const def = g.options.find((o: any) => o.isDefault);
                             if (def) defaults[g.id] = def.id;
                          });
                          setSelectedOptions(defaults);
                       }}
                       className="bg-white p-4 rounded-[2rem] shadow-sm border border-transparent hover:border-[#7c543c]/20 text-left group flex flex-col items-center"
                     >
                        <div className="w-full aspect-square rounded-2xl overflow-hidden mb-4 bg-gray-50">
                           <img src={p.imageUrl || 'https://via.placeholder.com/150'} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt={p.name} />
                        </div>
                        <h4 className="font-black text-slate-800 text-sm mb-1 text-center w-full truncate px-2">{p.name}</h4>
                        <p className="text-amber-600 font-black text-xs">{p.price} ฿</p>
                     </motion.button>
                   ))}
                </div>
             </div>

             {/* Cart Sidebar */}
             <div className="w-96 bg-white border-l border-gray-100 flex flex-col shadow-2xl">
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                   <h3 className="font-black text-lg text-slate-800 flex items-center gap-2">
                      <ShoppingBag size={20} className="text-[#7c543c]" /> Cart
                   </h3>
                   <span className="bg-[#7c543c]/10 text-[#7c543c] px-3 py-1 rounded-full text-[10px] font-black">{cart.length} ITEMS</span>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-4">
                   {cart.map((item, idx) => (
                     <div key={idx} className="flex justify-between items-start group">
                        <div className="flex-1">
                           <p className="font-bold text-slate-800 text-sm">{item.productName}</p>
                           <p className="text-[10px] text-gray-400 italic">
                             {item.selectedOptions.map((o: any) => o.label).join(', ')}
                           </p>
                        </div>
                        <div className="text-right flex items-center gap-4">
                           <p className="font-black text-slate-800 text-sm">{item.totalPrice} ฿</p>
                           <button onClick={() => removeFromCart(idx)} className="text-gray-300 hover:text-rose-500 transition-colors"><X size={14} /></button>
                        </div>
                     </div>
                   ))}
                   {cart.length === 0 && (
                      <div className="h-full flex flex-col items-center justify-center opacity-20 py-20">
                         <ShoppingBag size={48} />
                         <p className="mt-4 font-black">Cart is empty</p>
                      </div>
                   )}
                </div>

                <div className="p-8 border-t border-gray-100 bg-gray-50/50">
                   <div className="flex justify-between items-center mb-6">
                      <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Total</span>
                      <span className="text-3xl font-black text-slate-800 tracking-tighter">{cartTotal} ฿</span>
                   </div>
                   <button 
                     disabled={cart.length === 0}
                     onClick={() => setShowCheckout(true)}
                     className="w-full py-4 rounded-2xl bg-[#7c543c] text-white font-black uppercase tracking-widest shadow-xl shadow-[#7c543c]/30 disabled:opacity-50 disabled:grayscale transition-all"
                   >
                      Checkout Order
                   </button>
                </div>
             </div>
          </div>
        )}
      </div>

      {/* --- Modals --- */}
      <AnimatePresence>
         {configuringProduct && (
           <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
              <motion.div initial={{ y: 50, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 50, opacity: 0 }} className="bg-white w-full max-w-2xl rounded-[3rem] overflow-hidden shadow-2xl border border-white/20">
                 <div className="h-48 relative">
                    <img src={configuringProduct.imageUrl} className="w-full h-full object-cover" alt="" />
                    <button onClick={() => setConfiguringProduct(null)} className="absolute top-6 right-6 w-10 h-10 rounded-full bg-black/50 text-white flex items-center justify-center backdrop-blur-md"><X size={20} /></button>
                 </div>
                 <div className="p-10">
                    <h2 className="text-3xl font-black italic mb-6 text-slate-800">{configuringProduct.name}</h2>
                    
                    <div className="space-y-8 max-h-96 overflow-y-auto pr-2 no-scrollbar">
                       {configuringProduct.optionGroups?.map((group: any) => (
                         <div key={group.id}>
                            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                               {group.name} {group.isRequired && <span className="text-rose-500">* Required</span>}
                            </p>
                            <div className="grid grid-cols-3 gap-3">
                               {group.options.map((opt: any) => (
                                 <button 
                                   key={opt.id} 
                                   onClick={() => setSelectedOptions({...selectedOptions, [group.id]: opt.id})}
                                   className={`p-4 rounded-2xl border-2 transition-all text-left group ${selectedOptions[group.id] === opt.id ? 'bg-[#7c543c] border-[#7c543c] text-white' : 'bg-gray-50 border-transparent text-slate-600 hover:border-gray-200'}`}
                                 >
                                    <div className="flex justify-between items-start">
                                       <span className="font-bold text-sm">{opt.label}</span>
                                       {selectedOptions[group.id] === opt.id && <Check size={14} />}
                                    </div>
                                    {opt.priceAddon > 0 && <p className={`text-[10px] font-black mt-1 ${selectedOptions[group.id] === opt.id ? 'text-white/60' : 'text-amber-600'}`}>+{opt.priceAddon} ฿</p>}
                                 </button>
                               ))}
                            </div>
                         </div>
                       ))}
                    </div>

                    <div className="mt-12 flex items-center gap-6 border-t border-gray-100 pt-8">
                       <div className="flex-1">
                          <p className="text-[10px] font-bold text-gray-400 uppercase">Total Item Price</p>
                          <p className="text-3xl font-black text-slate-800">{configuringProduct.price + Object.keys(selectedOptions).reduce((s, gid) => {
                             const opt = configuringProduct.optionGroups.find((g:any)=>g.id===gid).options.find((o:any)=>o.id===selectedOptions[gid]);
                             return s + (opt?.priceAddon || 0);
                          }, 0)} ฿</p>
                       </div>
                       <button onClick={addToCart} className="bg-[#7c543c] text-white px-12 py-5 rounded-2xl font-black uppercase tracking-widest shadow-xl shadow-[#7c543c]/20">
                          Add to Cart
                       </button>
                    </div>
                 </div>
              </motion.div>
           </div>
         )}

         {showCheckout && (
            <div className="fixed inset-0 bg-[#7c543c]/10 backdrop-blur-xl z-[100] flex items-center justify-center">
               <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="bg-white w-full max-w-md rounded-[3rem] p-10 shadow-3xl text-center">
                  <div className="w-20 h-20 rounded-3xl bg-[#7c543c] text-white flex items-center justify-center mx-auto mb-6 shadow-xl">
                     <CreditCard size={40} />
                  </div>
                  <h2 className="text-2xl font-black mb-8 text-slate-800 tracking-tight">Complete Store Order</h2>
                  
                  <div className="space-y-4 text-left mb-10">
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Customer Name</label>
                        <input type="text" value={checkoutData.customerName} onChange={e=>setCheckoutData({...checkoutData, customerName: e.target.value})} className="w-full mt-1 p-4 bg-gray-50 rounded-2xl border-none font-bold text-slate-800" placeholder="Walk-in Guest" />
                     </div>
                     <div>
                        <label className="text-[10px] font-black text-gray-400 uppercase ml-2">Payment Method</label>
                        <div className="grid grid-cols-2 gap-3 mt-1">
                           {['CASH', 'QR'].map(m => (
                             <button key={m} onClick={()=>setCheckoutData({...checkoutData, paymentMethod:m})} className={`py-4 rounded-xl border-2 font-black text-xs transition-all ${checkoutData.paymentMethod === m ? 'bg-[#7c543c] border-[#7c543c] text-white' : 'bg-white border-gray-100 text-gray-400'}`}>
                                {m}
                             </button>
                           ))}
                        </div>
                     </div>
                  </div>

                  <div className="flex gap-4">
                     <button onClick={()=>setShowCheckout(false)} className="flex-1 py-4 font-black text-gray-400 uppercase tracking-widest text-xs">Correction</button>
                     <button onClick={handleCheckout} className="flex-1 py-4 bg-[#7c543c] text-white rounded-[1.5rem] font-black uppercase tracking-[0.2em] shadow-xl text-xs">Charge {cartTotal} ฿</button>
                  </div>
               </motion.div>
            </div>
         )}
      </AnimatePresence>
    </div>
  );
}
