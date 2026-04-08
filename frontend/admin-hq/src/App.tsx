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
  PieChart as PieChartIcon
} from 'lucide-react';
import { io } from 'socket.io-client';
import BranchesPage from './pages/BranchesPage';
import ProductsPage from './pages/ProductsPage';

export default function App() {
  const [activePage, setActivePage] = useState<'overview' | 'branches' | 'products'>('overview');
  const [stats, setStats] = useState({ revenue: 0, totalOrders: 0, customers: 0, branches: 0 });
  const [orders, setOrders] = useState<any[]>([]);

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
    <div className="flex h-screen overflow-hidden" style={{ background: '#fdf8f0' }}>
      {/* Sidebar */}
      <aside className="w-64 flex flex-col p-6 shrink-0" style={{ background: '#ffffff', borderRight: '1px solid #e8d5c0' }}>
        <div className="flex items-center gap-3 mb-10 px-2">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: '#b8956a' }}>
            <Coffee size={18} className="text-white" />
          </div>
          <span className="font-extrabold text-xl tracking-tight" style={{ color: '#3d2d1a' }}>456 Coffee</span>
        </div>

        <nav className="flex-1 space-y-1">
          <NavItem icon={<BarChart3 size={20} />} label="ภาพรวม" active={activePage === 'overview'} onClick={() => setActivePage('overview')} />
          <NavItem icon={<Store size={20} />} label="สาขา" active={activePage === 'branches'} onClick={() => setActivePage('branches')} />
          <NavItem icon={<Coffee size={20} />} label="เมนู" active={activePage === 'products'} onClick={() => setActivePage('products')} />
          <NavItem icon={<ShoppingBag size={20} />} label="คำสั่งซื้อ" />
          <NavItem icon={<Users size={20} />} label="ลูกค้า" />
          <NavItem icon={<PieChartIcon size={20} />} label="รายงาน" />
        </nav>

        <div className="pt-6 space-y-1" style={{ borderTop: '1px solid #e8d5c0' }}>
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
        ) : (
          <>
            {/* Top Header */}
            <header className="h-20 flex items-center justify-between px-10 shrink-0" style={{ borderBottom: '1px solid #e8d5c0', background: '#ffffff' }}>
              <div className="relative w-96">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2" size={18} style={{ color: '#b8956a' }} />
                <input
                  type="text"
                  placeholder="ค้นหาข้อมูล, รายงาน, ออเดอร์..."
                  className="w-full rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 transition-all"
                  style={{ background: '#fdf8f0', border: '1px solid #e8d5c0', color: '#3d2d1a', focusRingColor: '#b8956a' }}
                />
              </div>
              <div className="flex items-center gap-6">
                <button className="relative w-10 h-10 rounded-xl flex items-center justify-center transition-colors hover:opacity-80" style={{ background: '#f5ebe0', border: '1px solid #e8d5c0' }}>
                  <Bell size={20} style={{ color: '#7a5c3a' }} />
                  <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-white" />
                </button>
                <div className="flex items-center gap-3 pl-6" style={{ borderLeft: '1px solid #e8d5c0' }}>
                  <div className="text-right">
                    <p className="text-sm font-bold" style={{ color: '#3d2d1a' }}>แอดมินสำนักงานใหญ่</p>
                    <p className="text-[10px] font-bold uppercase tracking-widest" style={{ color: '#b8956a' }}>Super Admin</p>
                  </div>
                  <div className="w-10 h-10 rounded-xl" style={{ background: 'linear-gradient(135deg, #b8956a, #7a5c3a)' }} />
                </div>
              </div>
            </header>

            {/* Dashboard Grid */}
            <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-extrabold" style={{ color: '#3d2d1a' }}>ภาพรวมระบบทั้งหมด</h2>
                <button className="px-5 py-2.5 rounded-xl text-sm font-bold text-white shadow-md active:scale-95 transition-all" style={{ background: '#b8956a', boxShadow: '0 4px 12px rgba(184,149,106,0.3)' }}>
                  ดาวน์โหลดรายงาน
                </button>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-6">
                <StatCard icon={<TrendingUp size={24} className="text-emerald-600" />} label="รายได้ทั้งหมด" value={`฿${stats.revenue.toLocaleString()}`} delta="+12.5%" />
                <StatCard icon={<ShoppingBag size={24} style={{ color: '#b8956a' }} />} label="ยอดสั่งซื้อทั้งหมด" value={stats.totalOrders.toLocaleString()} delta="+8.2%" />
                <StatCard icon={<Users size={24} className="text-purple-600" />} label="จำนวนลูกค้า" value={stats.customers.toLocaleString()} delta="+24.1%" />
                <StatCard icon={<Store size={24} style={{ color: '#7a5c3a' }} />} label="สาขาที่เปิดอยู่" value={stats.branches.toString()} delta="0%" />
              </div>

              {/* Recent Orders & Top Products */}
              <div className="grid grid-cols-3 gap-8">
                <div className="col-span-2 admin-card p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="font-bold flex items-center gap-2" style={{ color: '#3d2d1a' }}>
                      <ShoppingBag size={18} style={{ color: '#b8956a' }} /> รายการสั่งซื้อล่าสุด
                    </h3>
                    <button className="text-xs font-bold hover:underline" style={{ color: '#b8956a' }}>ดูทั้งหมด</button>
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] uppercase font-bold tracking-widest" style={{ color: '#9c7a50', borderBottom: '1px solid #e8d5c0' }}>
                        <th className="pb-4">รหัสสั่งซื้อ</th>
                        <th className="pb-4">สาขา</th>
                        <th className="pb-4">ลูกค้า</th>
                        <th className="pb-4">วันที่</th>
                        <th className="pb-4 text-right">ยอดเงิน</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm">
                      {orders.length === 0 ? (
                        <tr><td colSpan={5} className="py-8 text-center" style={{ color: '#9c7a50' }}>ยังไม่มีรายการสั่งซื้อ</td></tr>
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
                    <h3 className="font-bold flex items-center gap-2" style={{ color: '#3d2d1a' }}>
                      <Coffee size={18} style={{ color: '#b8956a' }} /> สินค้าขายดี
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
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#f5ebe0' }}>{icon}</div>
        <span className={`text-xs font-bold ${delta.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}`}>{delta}</span>
      </div>
      <p className="text-xs font-bold uppercase tracking-widest mb-1" style={{ color: '#9c7a50' }}>{label}</p>
      <h4 className="text-2xl font-extrabold tracking-tight" style={{ color: '#3d2d1a' }}>{value}</h4>
    </div>
  );
}

function OrderRow({ id, branch, customer, date, amount }: { id: string, branch: string, customer: string, date: string, amount: string }) {
  return (
    <tr className="hover:bg-[#fdf8f0] transition-colors cursor-pointer group" style={{ borderBottom: '1px solid #f5ebe0' }}>
      <td className="py-4 font-mono" style={{ color: '#9c7a50' }}>{id}</td>
      <td className="py-4 font-semibold" style={{ color: '#3d2d1a' }}>{branch}</td>
      <td className="py-4" style={{ color: '#5c4428' }}>{customer}</td>
      <td className="py-4 text-xs" style={{ color: '#9c7a50' }}>{date}</td>
      <td className="py-4 text-right font-bold" style={{ color: '#b8956a' }}>{amount}</td>
    </tr>
  );
}

function TopProduct({ name, sales, trend }: { name: string, sales: string, trend: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#f5ebe0' }}>
          <Coffee size={16} style={{ color: '#b8956a' }} />
        </div>
        <div>
          <p className="text-sm font-bold" style={{ color: '#3d2d1a' }}>{name}</p>
          <p className="text-[11px]" style={{ color: '#9c7a50' }}>ขายได้ {sales} แก้ว</p>
        </div>
      </div>
      <span className={`text-[11px] font-bold ${trend.startsWith('+') ? 'text-emerald-600' : 'text-rose-500'}`}>{trend}</span>
    </div>
  );
}
