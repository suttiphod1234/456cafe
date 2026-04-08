import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Coffee, Search, ShoppingBag, Sparkles, User, ChevronRight, Loader2 } from 'lucide-react';
import { useLiff } from './hooks/useLiff';
import PaymentModal from './components/PaymentModal';

const categories = ['ทั้งหมด', 'เมนูแนะนำ', 'กาแฟร้อน', 'กาแฟเย็น', 'Non-Coffee'];

const products = [
  {
    id: '1',
    name: 'เดอร์ตี้คอฟฟี่ (Dirty Coffee)',
    description: 'นมสดเย็นจัดท็อปด้วยเอสเพรสโซ่ช็อตเข้มข้น',
    price: 120,
    category: 'เมนูแนะนำ',
    image: 'https://images.unsplash.com/photo-1541167760496-162955ed8a9f?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '2',
    name: 'อเมริกาโน่เย็น (Iced Americano)',
    description: 'เอสเพรสโซ่ช็อตผสมน้ำเย็นและน้ำแข็ง',
    price: 90,
    category: 'กาแฟเย็น',
    image: 'https://images.unsplash.com/photo-1551046710-23b0d9c3fa08?auto=format&fit=crop&q=80&w=400',
  },
  {
    id: '3',
    name: 'คาราเมล มัคคิอาโต้ (Caramel Macchiato)',
    description: 'นมวานิลลาหอมหวานท็อปด้วยเอสเพรสโซ่และซอสคาราเมล',
    price: 135,
    category: 'เมนูแนะนำ',
    image: 'https://images.unsplash.com/photo-1485182708500-e8f1f318ba72?auto=format&fit=crop&q=80&w=400',
  }
];

export default function App() {
  const [activeCategory, setActiveCategory] = useState('ทั้งหมด');
  const [showAI, setShowAI] = useState(false);
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);

  const { user, isLiffLoading } = useLiff();
  const [showPayment, setShowPayment] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);

  const handleAiRecommendation = async () => {
    if (!aiPrompt.trim()) return;
    setIsAiLoading(true);
    setAiResponse('');
    try {
      const res = await fetch(`http://localhost:5001/api/ai/recommend?prompt=${encodeURIComponent(aiPrompt)}`);
      const data = await res.text();
      setAiResponse(data);
    } catch (error) {
      console.error('Failed to get AI recommendation:', error);
      setAiResponse('ขออภัยครับ ไม่สามารถเชื่อมต่อกับ AI ได้ในขณะนี้');
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24 text-white">
      {/* Header */}
      <header className="px-6 pt-12 pb-6">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-gray-400 text-sm font-medium">สวัสดี คนรักกาแฟ!</h2>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
              456 Coffee Ecosystem
            </h1>
          </div>
          <div className="flex items-center gap-3 bg-white/5 pr-4 pl-1.5 py-1.5 rounded-full border border-white/10">
            {isLiffLoading ? (
              <Loader2 size={24} className="text-primary-500 animate-spin m-1" />
            ) : user ? (
              <>
                <img src={user.pictureUrl} alt="Profile" className="w-8 h-8 rounded-full border-2 border-primary-500" />
                <span className="text-sm font-medium pr-1">{user.displayName}</span>
              </>
            ) : (
              <div className="w-8 h-8 rounded-full glass-morphism flex items-center justify-center">
                <User size={16} className="text-gray-300" />
              </div>
            )}
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8">
          <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
            <Search size={18} className="text-gray-500" />
          </div>
          <input
            type="text"
            className="w-full bg-white/5 border border-white/10 rounded-2xl py-4 pl-12 pr-4 focus:outline-none focus:ring-2 focus:ring-primary-500 transition-all placeholder:text-gray-600"
            placeholder="ค้นหากาแฟที่คุณชอบ..."
          />
        </div>

        {/* AI Recommendation Banner */}
        <motion.div 
          whileTap={{ scale: 0.98 }}
          onClick={() => setShowAI(true)}
          className="relative overflow-hidden coffee-gradient rounded-3xl p-6 mb-8 cursor-pointer shadow-lg shadow-primary-900/20"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-2 mb-2">
              <Sparkles size={16} className="text-white/80" />
              <span className="text-xs font-bold tracking-widest uppercase text-white/80">AI แนะนำ</span>
            </div>
            <h3 className="text-xl font-bold mb-1">เลือกตามอารมณ์ของคุณไหม?</h3>
            <p className="text-white/70 text-sm mb-4">ให้ Gemini ช่วยค้นหาเครื่องดื่มที่ใช่สำหรับคุณ</p>
            <div className="bg-white/20 backdrop-blur-sm w-fit px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-2">
              ค้นหาเลย <ChevronRight size={14} />
            </div>
          </div>
          <div className="absolute right-[-20px] bottom-[-20px] opacity-20">
            <Coffee size={180} />
          </div>
        </motion.div>

        {/* Categories */}
        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`whitespace-nowrap px-6 py-2.5 rounded-2xl text-sm font-medium transition-all ${
                activeCategory === cat
                  ? 'coffee-gradient shadow-md'
                  : 'glass-morphism text-gray-400'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      {/* Product Grid */}
      <main className="px-6 grid grid-cols-2 gap-4">
        {products.map((product) => (
          <motion.div
            key={product.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-morphism rounded-3xl p-3"
          >
            <div className="relative aspect-square rounded-2xl overflow-hidden mb-3">
              <img 
                src={product.image} 
                className="w-full h-full object-cover transition-transform hover:scale-110" 
                alt={product.name} 
              />
              <div className="absolute top-2 right-2 bg-black/40 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] items-center gap-1 inline-flex">
                ★ 4.8
              </div>
            </div>
            <div className="px-1">
              <h4 className="font-bold text-sm mb-1 truncate">{product.name}</h4>
              <p className="text-[10px] text-gray-500 mb-3 truncate">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="font-bold text-primary-400">฿{product.price}</span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => {
                    setSelectedProduct(product);
                    setShowPayment(true);
                  }}
                  className="w-8 h-8 rounded-xl coffee-gradient flex items-center justify-center text-white shadow-sm"
                >
                  <ShoppingBag size={14} />
                </motion.button>
              </div>
            </div>
          </motion.div>
        ))}
      </main>

      {/* Bottom Nav */}
      <nav className="fixed bottom-0 left-0 right-0 h-20 glass-morphism border-t-0 rounded-t-3xl px-8 flex items-center justify-between z-50">
        <HomeIcon active />
        <Coffee size={24} className="text-gray-500" />
        <div className="relative -mt-12 w-16 h-16 rounded-full coffee-gradient flex items-center justify-center shadow-xl shadow-primary-900/40 border-4 border-[#121212]">
          <ShoppingBag size={24} />
          <span className="absolute -top-1 -right-1 bg-white text-primary-900 w-5 h-5 rounded-full text-[10px] font-bold flex items-center justify-center">2</span>
        </div>
        <Sparkles size={24} className="text-gray-500" />
        <User size={24} className="text-gray-500" />
      </nav>

      {/* AI Modal Overlay */}
      <AnimatePresence>
        {showAI && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-xl flex items-end"
            onClick={() => setShowAI(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              className="w-full bg-[#1c1c1c] rounded-t-[40px] p-8 pb-12"
              onClick={e => e.stopPropagation()}
            >
              <div className="w-12 h-1.5 bg-gray-700 rounded-full mx-auto mb-8" />
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 rounded-2xl coffee-gradient flex items-center justify-center">
                  <Sparkles size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-bold">ระบบแนะนำโดย AI</h3>
                  <p className="text-gray-500 text-sm">ขับเคลื่อนโดย Gemini</p>
                </div>
              </div>
              <p className="text-gray-300 mb-8 leading-relaxed">
                บอกความรู้สึกของคุณวันนี้ แล้วผมจะแนะนำกาแฟที่เหมาะที่สุดจากเมนูของเรา
              </p>
              
              {!aiResponse ? (
                <>
                  <textarea 
                    className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 min-h-[120px] mb-8 focus:outline-none focus:ring-2 focus:ring-primary-500 placeholder:text-gray-600"
                    placeholder="เช่น 'ต้องการพลังงานสำหรับประชุมเช้า' หรือ 'อยากได้อะไรหวานๆ เย็นๆ...'"
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    disabled={isAiLoading}
                  />
                  <button 
                    className="w-full py-4 rounded-2xl coffee-gradient font-bold shadow-lg flex justify-center items-center gap-2"
                    onClick={handleAiRecommendation}
                    disabled={isAiLoading || !aiPrompt.trim()}
                  >
                    {isAiLoading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        กำลังคิด...
                      </>
                    ) : 'ขอคำแนะนำ'}
                  </button>
                </>
              ) : (
                <div className="animate-fade-in text-center">
                  <div className="bg-primary-900/40 border border-primary-500/30 p-6 rounded-2xl mb-8">
                    <p className="text-white/90 text-lg leading-relaxed">{aiResponse}</p>
                  </div>
                  <button 
                    className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 font-bold transition-colors"
                    onClick={() => {
                      setAiResponse('');
                      setAiPrompt('');
                      setShowAI(false);
                    }}
                  >
                    ปิดหน้าต่าง
                  </button>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Payment Modal */}
      <AnimatePresence>
        {showPayment && selectedProduct && (
          <PaymentModal 
            totalAmount={selectedProduct.price}
            onClose={() => setShowPayment(false)}
            onSuccess={async () => {
              try {
                const orderData = {
                  branchId: 'branch-1',
                  customerUid: user?.userId || 'U1234567890',
                  totalAmount: selectedProduct.price,
                  items: [
                    {
                      productId: selectedProduct.id,
                      quantity: 1,
                      price: selectedProduct.price,
                      customization: { sweetness: '50%' }
                    }
                  ]
                };

                await fetch('http://localhost:5001/api/orders', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify(orderData)
                });
                
                alert('ส่งออเดอร์ให้สาขาเรียบร้อยแล้ว!');
              } catch (e) {
                console.error('Failed to place order:', e);
                alert('ไม่สามารถส่งออเดอร์ได้ กรุณาลองใหม่');
              } finally {
                setShowPayment(false);
                setSelectedProduct(null);
              }
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function HomeIcon({ active }: { active?: boolean }) {
  return (
    <div className={`relative flex flex-col items-center ${active ? 'text-primary-400' : 'text-gray-500'}`}>
      <Coffee size={24} />
      {active && <motion.div layoutId="active" className="absolute -bottom-2 w-1 h-1 rounded-full bg-primary-400" />}
    </div>
  );
}
