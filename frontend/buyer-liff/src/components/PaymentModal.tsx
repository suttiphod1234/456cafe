import { motion } from 'framer-motion';
import { CheckCircle2, ChevronLeft, Upload } from 'lucide-react';
import { useState } from 'react';

interface PaymentModalProps {
  totalAmount: number;
  onClose: () => void;
  onSuccess: () => void;
}

export default function PaymentModal({ totalAmount, onClose, onSuccess }: PaymentModalProps) {
  const [isUploading, setIsUploading] = useState(false);
  const [isDone, setIsDone] = useState(false);

  const handleUpload = () => {
    setIsUploading(true);
    // Simulate upload delay and success
    setTimeout(() => {
      setIsUploading(false);
      setIsDone(true);
      setTimeout(() => {
        onSuccess();
      }, 1500);
    }, 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-xl flex items-end sm:items-center justify-center p-0 sm:p-6"
    >
      <motion.div
        initial={{ y: '100%' }}
        animate={{ y: 0 }}
        exit={{ y: '100%' }}
        className="w-full sm:max-w-sm bg-[#1c1c1c] sm:bg-[#1c1c1c]/90 border-t sm:border border-white/10 rounded-t-[40px] sm:rounded-3xl p-6 pb-12 sm:pb-6 shadow-2xl relative"
      >
        {!isDone ? (
          <>
            <button 
              onClick={onClose}
              className="absolute top-6 left-6 text-gray-400 hover:text-white transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="text-center mt-2 mb-6">
              <h3 className="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                ชำระเงิน
              </h3>
              <p className="text-gray-500 text-sm mt-1">สแกน QR Code เพื่อชำระค่ากาแฟ</p>
            </div>

            <div className="bg-white p-4 rounded-3xl flex flex-col items-center mb-8 max-w-[220px] mx-auto shadow-[0_0_30px_rgba(255,255,255,0.1)]">
              <img 
                src="https://upload.wikimedia.org/wikipedia/commons/d/d0/QR_code_for_mobile_English_Wikipedia.svg" 
                alt="PromptPay QR" 
                className="w-full aspect-square opacity-90"
              />
              <p className="text-[#121212] font-bold mt-4 text-2xl">฿{totalAmount.toFixed(2)}</p>
            </div>

            <button
              onClick={handleUpload}
              disabled={isUploading}
              className="w-full py-4 rounded-2xl coffee-gradient shadow-lg shadow-primary-900/40 font-bold flex justify-center items-center gap-2 transition-all"
            >
              {isUploading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span className="text-white">กำลังตรวจสอบสลิป...</span>
                </>
              ) : (
                <>
                  <Upload size={18} className="text-white drop-shadow-md" />
                  <span className="text-white text-lg">อัปโหลดสลิป (จำลอง)</span>
                </>
              )}
            </button>
          </>
        ) : (
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="flex flex-col items-center justify-center py-12"
          >
            <CheckCircle2 size={80} className="text-primary-400 mb-6 drop-shadow-[0_0_15px_rgba(212,163,115,0.4)]" />
            <h3 className="text-2xl font-bold text-white mb-2">ชำระเงินสำเร็จ</h3>
            <p className="text-gray-400 text-sm text-center">กำลังส่งออเดอร์ไปยังบาริสต้าสาขา...</p>
          </motion.div>
        )}
      </motion.div>
    </motion.div>
  );
}
