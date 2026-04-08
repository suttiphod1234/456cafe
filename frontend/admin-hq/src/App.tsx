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

export default function App() {
  return (
    <div className="flex h-screen overflow-hidden bg-[#0b0e14]">
      {/* Sidebar */}
      <aside className="w-64 border-r border-white/5 flex flex-col p-6 shrink-0 bg-[#0d1117]">
        <div className="flex items-center gap-3 mb-12 px-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-500 flex items-center justify-center">
            <Coffee size={18} className="text-white" />
          </div>
          <span className="font-bold text-xl tracking-tight">456 HQ</span>
        </div>

        <nav className="flex-1 space-y-2">
          <NavItem icon={<BarChart3 size={20} />} label="Overview" active />
          <NavItem icon={<Store size={20} />} label="Branches" />
          <NavItem icon={<Coffee size={20} />} label="Products" />
          <NavItem icon={<ShoppingBag size={20} />} label="Orders" />
          <NavItem icon={<Users size={20} />} label="Customers" />
          <NavItem icon={<PieChartIcon size={20} />} label="Reports" />
        </nav>

        <div className="pt-6 border-t border-white/5 space-y-2">
          <NavItem icon={<Settings size={20} />} label="Settings" />
          <NavItem icon={<LogOut size={20} />} label="Sign Out" />
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-20 flex items-center justify-between px-10 border-b border-white/5 shrink-0">
          <div className="relative w-96">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
            <input 
              type="text" 
              placeholder="Search data, reports, orders..." 
              className="w-full bg-white/5 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500/50 placeholder:text-gray-600"
            />
          </div>
          <div className="flex items-center gap-6">
            <button className="relative w-10 h-10 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center hover:bg-white/10 transition-colors">
              <Bell size={20} className="text-gray-400" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-rose-500 rounded-full border-2 border-[#0b0e14]" />
            </button>
            <div className="flex items-center gap-3 pl-6 border-l border-white/5">
              <div className="text-right">
                <p className="text-sm font-bold">Admin HQ</p>
                <p className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Super Admin</p>
              </div>
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600" />
            </div>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="flex-1 overflow-y-auto p-10 space-y-8 no-scrollbar">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Global Overview</h2>
            <div className="flex gap-3">
              <button className="px-4 py-2 bg-indigo-600 rounded-xl text-sm font-bold shadow-lg shadow-indigo-600/20 active:scale-95 transition-all">Download Report</button>
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-4 gap-6">
            <StatCard icon={<TrendingUp size={24} className="text-emerald-500" />} label="Total Revenue" value="฿222.6K" delta="+12.5%" />
            <StatCard icon={<ShoppingBag size={24} className="text-blue-500" />} label="Total Orders" value="3,456" delta="+8.2%" />
            <StatCard icon={<Users size={24} className="text-purple-500" />} label="Total Customers" value="1,280" delta="+24.1%" />
            <StatCard icon={<Store size={24} className="text-amber-500" />} label="Active Branches" value="12" delta="0%" />
          </div>

          {/* Recent Orders & Inventory */}
          <div className="grid grid-cols-3 gap-8">
            <div className="col-span-2 admin-card p-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold flex items-center gap-2">
                  <ShoppingBag size={18} className="text-indigo-400" /> Recent Global Orders
                </h3>
                <button className="text-xs text-indigo-400 hover:underline">View All</button>
              </div>
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[10px] uppercase font-bold tracking-widest text-gray-500 border-b border-white/5">
                    <th className="pb-4">Order ID</th>
                    <th className="pb-4">Branch</th>
                    <th className="pb-4">Customer</th>
                    <th className="pb-4">Date</th>
                    <th className="pb-4 text-right">Amount</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <OrderRow id="#3491" branch="Siam Square" customer="Winai S." date="8 Apr, 08:12" amount="฿120.00" />
                  <OrderRow id="#3490" branch="Ari Center" customer="Somsak K." date="8 Apr, 07:58" amount="฿95.00" />
                  <OrderRow id="#3489" branch="Thong Lo" customer="Prisana L." date="8 Apr, 07:45" amount="฿240.00" />
                  <OrderRow id="#3488" branch="Siam Square" customer="Anon P." date="7 Apr, 22:30" amount="฿135.00" />
                </tbody>
              </table>
            </div>

            <div className="admin-card p-6">
              <div className="flex items-center justify-between mb-8">
                <h3 className="font-bold flex items-center gap-2">
                  <Coffee size={18} className="text-amber-400" /> Top Products
                </h3>
              </div>
              <div className="space-y-6">
                <TopProduct name="Dirty Coffee" sales="458" trend="+12%" />
                <TopProduct name="Iced Americano" sales="382" trend="+5%" />
                <TopProduct name="Caramel Macchiato" sales="291" trend="+2%" />
                <TopProduct name="Cold Brew" sales="154" trend="-3%" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function NavItem({ icon, label, active }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <button className={`sidebar-item w-full ${active ? 'active' : ''}`}>
      {icon}
      <span className="text-sm font-medium">{label}</span>
    </button>
  );
}

function StatCard({ icon, label, value, delta }: { icon: React.ReactNode, label: string, value: string, delta: string }) {
  return (
    <div className="admin-card p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center">{icon}</div>
        <span className={`text-xs font-bold ${delta.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{delta}</span>
      </div>
      <p className="text-gray-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</p>
      <h4 className="text-2xl font-bold tracking-tight">{value}</h4>
    </div>
  );
}

function OrderRow({ id, branch, customer, date, amount }: { id: string, branch: string, customer: string, date: string, amount: string }) {
  return (
    <tr className="border-b border-white/5 hover:bg-white/[0.02] transition-colors cursor-pointer group">
      <td className="py-4 font-mono text-gray-400">{id}</td>
      <td className="py-4 font-medium">{branch}</td>
      <td className="py-4 text-gray-300">{customer}</td>
      <td className="py-4 text-gray-500 text-xs">{date}</td>
      <td className="py-4 text-right font-bold text-indigo-400">{amount}</td>
    </tr>
  );
}

function TopProduct({ name, sales, trend }: { name: string, sales: string, trend: string }) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-gray-500 underline underline-offset-4 cursor-pointer">Img</div>
        <div>
          <p className="text-sm font-bold">{name}</p>
          <p className="text-[10px] text-gray-500">{sales} sold</p>
        </div>
      </div>
      <span className={`text-[10px] font-bold ${trend.startsWith('+') ? 'text-emerald-500' : 'text-rose-500'}`}>{trend}</span>
    </div>
  );
}
