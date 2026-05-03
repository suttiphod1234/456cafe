import { useState, useEffect } from 'react';
import { 
  BarChart3, 
  Users, 
  Coffee, 
  ShoppingBag, 
  Store, 
  TrendingUp, 
  Bell, 
  Search,
  Settings,
  LogOut,
  PieChart as PieChartIcon,
  Sun,
  Moon,
  Banknote,
  ClipboardList,
  DollarSign
} from 'lucide-react';
import { io } from 'socket.io-client';
import BranchesPage from './pages/BranchesPage';
import ProductsPage from './pages/ProductsPage';
import OrdersPage from './pages/OrdersPage';
import CustomersPage from './pages/CustomersPage';
import InventoryLedger from './pages/InventoryLedger';
import CostManagement from './pages/CostManagement';
import FinanceLedger from './pages/FinanceLedger';

export default function App() {
  const [activePage, setActivePage] = useState<'overview' | 'branches' | 'products' | 'orders' | 'customers' | 'inventory' | 'cost' | 'finance'>('overview');
  const [stats, setStats] = useState({ revenue: 0, totalOrders: 0, customers: 0, branches: 0 });
  const [orders, setOrders] = useState<any[]>([]);
  
  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(
    (localStorage.getItem('theme') as 'light' | 'dark') || 'dark'
  );

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const statsRes = await fetch('http://localhost:5001/api/stats/global');
        const statsData = await statsRes.json();
        setStats(statsData);

        const ordersRes = await fetch('http://localhost:5001/api/orders/recent');
        const ordersData = await ordersRes.json();
        setOrders(ordersData);
      } catch (e) {
        console.error('Fetch error:', e);
      }
    };

    fetchData();

    const socket = io('http://localhost:5001');
    socket.on('new-order', (order) => {
      setStats(prev => ({
        ...prev,
        totalOrders: prev.totalOrders + 1,
        revenue: prev.revenue + order.totalAmount
      }));
      const newOrder = {
        ...order,
        branch: { name: 'สาขาใหม่' }
      };
      setOrders(prev => [newOrder, ...prev].slice(0, 10));
    });

    return () => { socket.close(); };
  }, []);

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: 'var(--bg-main)', color: 'var(--text-main)' }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col p-6 shrink-0" style={{ background: 'var(--bg-card)', borderRight: '1px solid var(--border-color)' }}>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'var(--accent)' }}>
            <Coffee size={20} className="text-white" />
          </div>
          <span className="font-extrabold text-2xl tracking-tight" style={{ color: 'var(--text-main)' }}>456 HQ</span>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem icon={<BarChart3 size={20} />} label="ภาพรวม" active={activePage === 'overview'} onClick={() => setActivePage('overview')} />
          <NavItem icon={<Store size={20} />} label="สาขา" active={activePage === 'branches'} onClick={() => setActivePage('branches')} />
          <NavItem icon={<Coffee size={20} />} label="เมนูสินค้า" active={activePage === 'products'} onClick={() => setActivePage('products')} />
          <NavItem icon={<ShoppingBag size={20} />} label="ออเดอร์" active={activePage === 'orders'} onClick={() => setActivePage('orders')} />
          <NavItem icon={<Users size={20} />} label="ลูกค้า" active={activePage === 'customers'} onClick={() => setActivePage('customers')} />
          <NavItem icon={<ClipboardList size={20} />} label="คลังวัตถุดิบ" active={activePage === 'inventory'} onClick={() => setActivePage('inventory')} />
          <NavItem icon={<DollarSign size={20} />} label="ต้นทุนและกำไร" active={activePage === 'cost'} onClick={() => setActivePage('cost')} />
          <NavItem icon={<Banknote size={20} />} label="รายรับ-รายจ่าย" active={activePage === 'finance'} onClick={() => setActivePage('finance')} />
          <NavItem icon={<PieChartIcon size={20} />} label="รายงานสรุป" />
        </nav>

        <div className="pt-6 space-y-1 mt-auto" style={{ borderTop: '1px solid var(--border-color)' }}>
          <NavItem icon={<Settings size={20} />} label="ตั้งค่า" />
          <NavItem icon={<LogOut size={20} />} label="ออกจากระบบ" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {activePage === 'branches' ? (
          <BranchesPage />
        ) : activePage === 'products' ? (
          <ProductsPage />
        ) : activePage === 'orders' ? (
          <OrdersPage />
        ) : activePage === 'customers' ? (
          <CustomersPage />
        ) : activePage === 'inventory' ? (
          <InventoryLedger />
        ) : activePage === 'cost' ? (
          <CostManagement />
        ) : activePage === 'finance' ? (
          <FinanceLedger />
        ) : (
          <>
            {/* Top Header */}
            <header className="h-20 flex items-center justify-between px-10 shrink-0" style={{ borderBottom: '1px solid var(--border-color)', background: 'var(--bg-main)' }}>
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: 'var(--text-muted)' }} />
                <input
                  type="text"
                  placeholder="ค้นหาข้อมูล, รายงาน, ออเดอร์..."
                  className="w-full rounded-xl py-2.5 pl-10 pr-4 text-[1rem] focus:outline-none focus:ring-1 transition-all"
                  style={{ background: 'var(--bg-card)', border: '1px solid var(--border-color)', color: 'var(--text-main)' }}
                />
              </div>
              <div className="flex items-center gap-6">
                <button onClick={toggleTheme} className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors hover:opacity-80" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-color)' }}>
                  {theme === 'dark' ? <Sun size={20} style={{ color: 'var(--text-muted)' }} /> : <Moon size={20} style={{ color: 'var(--text-muted)' }} />}
                </button>
                <button className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors hover:opacity-80" style={{ background: 'var(--bg-hover)', border: '1px solid var(--border-color)' }}>
                  <Bell size={20} style={{ color: 'var(--text-muted)' }} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-transparent" />
                </button>
                <div className="flex items-center gap-3 pl-6" style={{ borderLeft: '1px solid var(--border-color)' }}>
                  <div className="text-right">
                    <p className="text-[1rem] font-bold" style={{ color: 'var(--text-main)' }}>แอดมินสำนักงานใหญ่</p>
                    <p className="text-xs font-bold uppercase tracking-widest" style={{ color: 'var(--text-muted)' }}>Super Admin</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl" style={{ background: 'var(--accent)' }} />
                </div>
              </div>
            </header>

            {/* Dashboard Grid */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
              <div className="flex flex-col mb-10">
                <h2 className="text-3xl font-black tracking-tight italic uppercase" style={{ color: 'var(--text-main)' }}>แดชบอร์ดภาพรวม</h2>
                <p className="font-bold text-xs mt-1" style={{ color: 'var(--text-muted)' }}>สรุปข้อมูลการขายและสถิติของทุกสาขาในระบบ</p>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-6 mb-10">
                <StatCard icon={<TrendingUp size={24} className="text-emerald-500" />} label="รายได้รวมวันนี้" value={`${stats.revenue.toLocaleString()} ฿`} delta="+12.5%" />
                <StatCard icon={<ShoppingBag size={24} style={{ color: 'var(--accent)' }} />} label="ออเดอร์ทั้งหมด" value={stats.totalOrders.toLocaleString()} delta="+8.2%" />
                <StatCard icon={<Users size={24} className="text-purple-400" />} label="ลูกค้าใหม่" value={stats.customers.toLocaleString()} delta="+24.1%" />
                <StatCard icon={<Store size={24} style={{ color: 'var(--text-muted)' }} />} label="สาขาที่เปิด" value={stats.branches.toString()} delta="คงที่" />
              </div>

              {/* Recent Orders & Top Products */}
              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 admin-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                      <ShoppingBag size={20} style={{ color: 'var(--accent)' }} /> รายการสั่งซื้อล่าสุด
                    </h3>
                    <button onClick={() => setActivePage('orders')} className="text-sm font-bold hover:underline" style={{ color: 'var(--accent)' }}>ดูทั้งหมด</button>
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-xs uppercase font-bold tracking-widest" style={{ color: 'var(--text-muted)', borderBottom: '1px solid var(--border-color)' }}>
                        <th className="pb-4">รหัสสั่งซื้อ</th>
                        <th className="pb-4">สาขา</th>
                        <th className="pb-4">ลูกค้า</th>
                        <th className="pb-4">วันที่</th>
                        <th className="pb-4 text-right">ยอดเงิน</th>
                      </tr>
                    </thead>
                    <tbody className="text-[1rem]">
                      {orders.length === 0 ? (
                        <tr><td colSpan={5} className="py-8 text-center" style={{ color: 'var(--text-muted)' }}>ยังไม่มีรายการสั่งซื้อเร็วๆ นี้</td></tr>
                      ) : orders.map((o: any) => (
                        <OrderRow
                          key={o.id}
                          id={`#${o.id.substring(0, 4)}`}
                          branch={o.branch?.name || "ไม่ระบุสาขา"}
                          customer={o.customerUid ? `LINE-${o.customerUid.substring(0,4)}` : 'ลูกค้าหน้าร้าน'}
                          date={new Date(o.createdAt).toLocaleString('th-TH', { hour: '2-digit', minute: '2-digit', day: 'numeric', month: 'short' })}
                          amount={`฿${o.totalAmount}`}
                        />
                      ))}
                    </tbody>
                  </table>
                </div>

                <div className="admin-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold text-lg flex items-center gap-2" style={{ color: 'var(--text-main)' }}>
                      <Coffee size={20} style={{ color: 'var(--accent)' }} /> สินค้าขายดี
                    </h3>
                  </div>
                  <div className="space-y-5">
                    <TopProduct name="Dirty Coffee" sales="458" trend="+12%" />
                    <TopProduct name="Iced Americano" sales="382" trend="+5%" />
                    <TopProduct name="Caramel Macchiato" sales="291" trend="+2%" />
                    <TopProduct name="Cold Brew" sales="154" trend="-3%" />
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}


function NavItem({ icon, label, active, onClick }: { icon: React.ReactNode, label: string, active?: boolean, onClick?: () => void }) {
  return (
    <button onClick={onClick} className={`sidebar-item w-full ${active ? 'active' : ''}`}>
      {icon}
      <span className="text-sm">{label}</span>
    </button>
  );
}

function StatCard({ icon, label, value, delta }: { icon: React.ReactNode, label: string, value: string, delta: string }) {
  return (
    <div className="admin-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg-hover)' }}>{icon}</div>
        <span className={`text-sm font-bold ${delta.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{delta}</span>
      </div>
      <p className="text-sm font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--text-muted)' }}>{label}</p>
      <h4 className="text-3xl font-extrabold tracking-tight" style={{ color: 'var(--text-main)' }}>{value}</h4>
    </div>
  );
}

function OrderRow({ id, branch, customer, date, amount }: { id: string, branch: string, customer: string, date: string, amount: string }) {
  return (
    <tr className="hover:bg-[var(--bg-hover)] transition-colors cursor-pointer group" style={{ borderBottom: '1px solid var(--border-color)' }}>
      <td className="py-5 font-mono" style={{ color: 'var(--text-muted)' }}>{id}</td>
      <td className="py-5 font-bold" style={{ color: 'var(--text-main)' }}>{branch}</td>
      <td className="py-5" style={{ color: 'var(--text-main)' }}>{customer}</td>
      <td className="py-5 text-sm" style={{ color: 'var(--text-muted)' }}>{date}</td>
      <td className="py-5 text-right font-extrabold" style={{ color: 'var(--accent)' }}>{amount}</td>
    </tr>
  );
}

function TopProduct({ name, sales, trend }: { name: string, sales: string, trend: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-xl flex items-center justify-center" style={{ background: 'var(--bg-hover)' }}>
          <Coffee size={18} style={{ color: 'var(--text-muted)' }} />
        </div>
        <div>
          <p className="text-[1rem] font-bold" style={{ color: 'var(--text-main)' }}>{name}</p>
          <p className="text-xs" style={{ color: 'var(--text-muted)' }}>ขายได้ {sales} แก้ว</p>
        </div>
      </div>
      <span className={`text-sm font-bold ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{trend}</span>
    </div>
  );
}
