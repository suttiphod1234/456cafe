import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Phone, Mail, MessageCircle, ArrowRight, Loader2, CheckCircle2 } from 'lucide-react';

const API = 'http://localhost:5001/api';

export default function AuthModal({ isOpen, onClose, onLoginSuccess }: any) {
  const [step, setStep] = useState<'methods' | 'phone' | 'otp' | 'success'>('methods');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSendOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/auth/otp/send`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone })
      });
      if (res.ok) setStep('otp');
      else setError('ไม่สามารถส่ง OTP ได้ กรุณาลองใหม่');
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API}/auth/otp/verify`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ phone, code: otp })
      });
      if (res.ok) {
        const user = await res.json();
        setStep('success');
        setTimeout(() => {
           onLoginSuccess(user);
           onClose();
        }, 1500);
      } else {
        setError('รหัส OTP ไม่ถูกต้อง');
      }
    } catch (err) {
      setError('เกิดข้อผิดพลาดในการเชื่อมต่อ');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
      
      <motion.div initial={{ scale: 0.9, opacity: 0, y: 20 }} animate={{ scale: 1, opacity: 1, y: 0 }} className="relative bg-[#fdf8f0] w-full max-w-sm rounded-[2.5rem] overflow-hidden shadow-2xl">
        {/* Header */}
        <div className="p-6 pb-0 flex justify-end">
           <button onClick={onClose} className="p-2 rounded-full bg-white/50 text-[#3d2d1a]"><X size={20}/></button>
        </div>

        <div className="p-8 pt-2">
           <AnimatePresence mode="wait">
              {step === 'methods' && (
                 <motion.div key="methods" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }}>
                    <div className="text-center mb-8">
                       <h2 className="text-2xl font-black text-[#3d2d1a] tracking-tight">เข้าร่วมสมาชิก ☕</h2>
                       <p className="text-sm text-[#9c7a50] mt-2">เพื่อสะสมแต้มและรับสิทธิพิเศษมากมาย</p>
                    </div>

                    <div className="space-y-3">
                       <button onClick={() => setStep('phone')} className="w-full flex items-center gap-4 bg-white p-4 rounded-2xl border border-[#e8d5c0] shadow-sm hover:border-[#b8956a] transition-all group">
                          <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center text-amber-600 group-hover:bg-amber-600 group-hover:text-white transition-colors"><Phone size={20}/></div>
                          <span className="font-bold text-[#3d2d1a]">ใช้งานด้วยเบอร์โทรศัพท์</span>
                       </button>

                       <button className="w-full flex items-center gap-4 bg-white p-4 rounded-2xl border border-[#e8d5c0] shadow-sm hover:border-[#4285F4] transition-all group">
                          <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600 group-hover:bg-[#4285F4] group-hover:text-white transition-colors"><Mail size={20}/></div>
                          <span className="font-bold text-[#3d2d1a]">เข้าสู่ระบบด้วย Google</span>
                       </button>

                       <button className="w-full flex items-center gap-4 bg-[#00b900] p-4 rounded-2xl shadow-md hover:bg-[#00a300] transition-all text-white">
                          <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center"><MessageCircle size={20}/></div>
                          <span className="font-bold">เข้าสู่ระบบด้วย LINE</span>
                       </button>
                    </div>

                    <p className="text-[10px] text-center text-[#9c7a50] mt-8 px-4">การเข้าใช้งานถือว่าคุณยอมรับเงื่อนไขการให้บริการและนโยบายความเป็นส่วนตัว</p>
                 </motion.div>
              )}

              {step === 'phone' && (
                 <motion.div key="phone" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }}>
                    <button onClick={() => setStep('methods')} className="text-xs font-bold text-[#b8956a] mb-6 flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">ย้อนกลับ</button>
                    <h3 className="text-xl font-black text-[#3d2d1a] mb-2">ระบุเบอร์โทรศัพท์</h3>
                    <p className="text-sm text-[#9c7a50] mb-6">เราจะส่งรหัส 6 หลักไปให้คุณทาง SMS</p>
                    
                    <div className="relative mb-6">
                       <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-[#3d2d1a] border-r pr-3 border-[#e8d5c0]">🇹🇭 +66</span>
                       <input autoFocus type="tel" value={phone} onChange={e => setPhone(e.target.value)} placeholder="08x-xxx-xxxx" className="w-full bg-white border border-[#e8d5c0] rounded-2xl py-4 pl-24 pr-4 font-bold text-lg focus:outline-none focus:ring-2 focus:ring-[#b8956a]/20" />
                    </div>

                    {error && <p className="text-rose-500 text-xs font-bold mb-4 px-2">{error}</p>}

                    <button disabled={loading || phone.length < 9} onClick={handleSendOtp} className="w-full bg-[#b8956a] text-white py-4 rounded-2xl font-black shadow-lg shadow-[#b8956a]/20 flex items-center justify-center gap-2">
                       {loading ? <Loader2 className="animate-spin"/> : <>รับรหัส OTP <ArrowRight size={18}/></>}
                    </button>
                 </motion.div>
              )}

              {step === 'otp' && (
                 <motion.div key="otp" initial={{ x: 10, opacity: 0 }} animate={{ x: 0, opacity: 1 }} exit={{ x: -10, opacity: 0 }}>
                    <button onClick={() => setStep('phone')} className="text-xs font-bold text-[#b8956a] mb-6 flex items-center gap-1 opacity-60 hover:opacity-100 transition-opacity">เปลี่ยนเบอร์โทรศัพท์</button>
                    <h3 className="text-xl font-black text-[#3d2d1a] mb-2">ยืนยันรหัส OTP</h3>
                    <p className="text-sm text-[#9c7a50] mb-4">รหัสส่งไปที่ {phone}</p>
                    <p className="text-[10px] bg-amber-50 text-amber-600 p-2 rounded-lg mb-6 font-bold">Mock OTP ใน Console คือ: 123456</p>
                    
                    <input autoFocus type="number" value={otp} onChange={e => setOtp(e.target.value)} placeholder="รหัส 6 หลัก" className="w-full bg-white border border-[#e8d5c0] rounded-2xl py-4 px-6 font-black text-center text-3xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-[#b8956a]/20" />

                    {error && <p className="text-rose-500 text-xs font-bold mt-4 px-2">{error}</p>}

                    <button disabled={loading || otp.length !== 6} onClick={handleVerifyOtp} className="w-full bg-[#b8956a] text-white py-4 rounded-2xl font-black shadow-lg shadow-[#b8956a]/20 mt-8 flex items-center justify-center gap-2">
                       {loading ? <Loader2 className="animate-spin"/> : <>ยืนยัน <CheckCircle2 size={18}/></>}
                    </button>
                 </motion.div>
              )}

              {step === 'success' && (
                 <motion.div key="success" initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="py-12 flex flex-col items-center text-center">
                    <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 shadow-inner">
                       <CheckCircle2 size={48} />
                    </div>
                    <h3 className="text-2xl font-black text-[#3d2d1a]">ยินดีต้อนรับ!</h3>
                    <p className="text-[#9c7a50] mt-2">เข้าสู่ระบบสำเร็จแล้ว</p>
                 </motion.div>
              )}
           </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}
