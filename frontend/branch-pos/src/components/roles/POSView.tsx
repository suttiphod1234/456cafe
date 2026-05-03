import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Coffee, Truck, Search, 
  Plus, Printer, CreditCard, User, 
  ShoppingBag, X, ChevronRight, Check
} from 'lucide-react';

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5001'}/api`;

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
  const [viewingReceipt, setViewingReceipt] = useState<any>(null);
  
  // Member Search State
  const [memberSearch, setMemberSearch] = useState('');
  const [searchingMember, setSearchingMember] = useState(false);
  const [foundMember, setFoundMember] = useState<any>(null);
  const [selectedMember, setSelectedMember] = useState<any>(null);

  // Print function
  const handlePrint = () => {
    window.print();
  };

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

  const handleSearchMember = async () => {
    if (!memberSearch.trim()) return;
    setSearchingMember(true);
    setFoundMember(null);
    try {
      const res = await fetch(`${API_BASE}/users?search=${memberSearch}`);
      const data = await res.json();
      if (data && data.length > 0) {
        setFoundMember(data[0]); // Take the first match
      } else {
        alert("ไม่พบสมาชิกในระบบ");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSearchingMember(false);
    }
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
          userId: selectedMember?.id,
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
        const createdOrder = await res.json();
        setCart([]);
        setShowCheckout(false);
        setActiveTab('feed');
        setCheckoutData({ customerName: '', paymentMethod: 'CASH', note: '' });
        setViewingReceipt(createdOrder);
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
              รายการออเดอร์
           </button>
           <button 
             onClick={() => setActiveTab('menu')}
             className={`px-8 py-2.5 rounded-xl font-black text-xs uppercase tracking-widest transition-all ${activeTab === 'menu' ? 'bg-white text-[#7c543c] shadow-sm' : 'text-gray-400'}`}
           >
              สั่งอาหาร/เครื่องดื่ม
           </button>
        </div>
        
        {activeTab === 'feed' && (
           <div className="relative w-96">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
             <input type="text" placeholder="ค้นหาเลขออเดอร์..." className="w-full pl-12 pr-4 py-3 bg-gray-50 rounded-2xl border-none focus:ring-2 focus:ring-[#7c543c]/20 text-sm" />
           </div>
        )}
      </div>

      <div className="flex-1 overflow-hidden flex">
        {activeTab === 'feed' ? (
          /* --- FEED VIEW --- */
          <div className="flex-1 flex p-6 gap-6">
            <div className="w-64 flex flex-col gap-2">
               <h3 className="text-xs font-black text-gray-400 uppercase tracking-widest mb-2 px-2">ที่มาของออเดอร์</h3>
               <div className="space-y-1">
                 {['ทั้งหมด', 'หน้าร้าน', 'Grab', 'LINE'].map(s => (
                   <button key={s} className="w-full text-left p-4 rounded-2xl hover:bg-white font-bold text-sm text-gray-500 hover:text-[#7c543c] transition-all">
                      ออเดอร์ {s}
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
                            <span className="text-[10px] font-black text-blue-500 uppercase">Q#${order.queueNo}</span>
