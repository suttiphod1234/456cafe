import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Coffee,
    Truck,
    Search,
    Plus,
    Printer,
    CreditCard,
    User,
    ShoppingBag,
    X,
    ChevronRight,
    Check,
} from 'lucide-react';

const API_BASE = `${import.meta.env.VITE_API_URL || 'http://localhost:5001/api'}`;

export default function POSView({ branch, orders, updateStatus }: any) {    const [activeTab, setActiveTab] = useState<'feed' | 'menu'>('feed');
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

  useEffect(() => {
        fetchCategories();
  }, []);

  useEffect(() => {
        if (selectedCategory) {
                fetchProducts(selectedCategory);
        }
  }, [selectedCategory]);

  const fetchCategories = async () => {
        try {
                const res = await fetch(`${API_BASE}/products/categories`);
                const data = await res.json();
                setCategories(data);
                if (data.length > 0 && !selectedCategory) setSelectedCategory(data[0].id);
        } catch (err) {
                console.error('Failed to fetch categories', err);
        }
  };

  const fetchProducts = async (catId: string) => {
        try {
                const res = await fetch(`${API_BASE}/products?categoryId=${catId}`);
                const data = await res.json();
                setProducts(data);
        } catch (err) {
                console.error('Failed to fetch products', err);
        }
  };

  const searchMember = async () => {
        if (!memberSearch) return;
        setSearchingMember(true);
        setFoundMember(null);
        try {
                const res = await fetch(`${API_BASE}/users?search=${memberSearch}`);
                const data = await res.json();
                if (data && data.length > 0) {
                          setFoundMember(data[0]);
                } else {
                          alert('
