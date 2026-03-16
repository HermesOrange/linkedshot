'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LogOut,
  Eye,
  Upload,
  Send,
  RefreshCw,
  TrendingUp,
  Package,
  Clock,
  CheckCircle,
  DollarSign,
  Users,
  Search,
  Filter,
} from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';

const ADMIN_PASSWORD = 'admin123';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
  processing: { label: 'Processing', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  completed: { label: 'Completed', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  refunded: { label: 'Refunded', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
};

const DEMO_ORDERS: Order[] = [
  {
    id: 'LS-ABC123-XY',
    email: 'ahmad.faiz@gmail.com',
    package: 'basic',
    addons: { linkedinBanner: false, rushDelivery: false },
    total: 79,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    photoCount: 7,
    photos: [],
    resultPhotos: [],
  },
  {
    id: 'LS-DEF456-AB',
    email: 'priya.nair@company.com',
    package: 'pro',
    addons: { linkedinBanner: true, rushDelivery: false },
    total: 179,
    status: 'processing',
    createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    photoCount: 10,
    photos: [],
    resultPhotos: [],
  },
  {
    id: 'LS-GHI789-CD',
    email: 'weiliang.tan@startup.io',
    package: 'basic',
    addons: { linkedinBanner: false, rushDelivery: true },
    total: 99,
    status: 'pending',
    createdAt: new Date(Date.now() - 1000 * 60 * 2).toISOString(),
    photoCount: 5,
    photos: [],
    resultPhotos: [],
  },
  {
    id: 'LS-JKL012-EF',
    email: 'siti.rahimah@corporate.my',
    package: 'pro',
    addons: { linkedinBanner: true, rushDelivery: true },
    total: 199,
    status: 'completed',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    photoCount: 8,
    photos: [],
    resultPhotos: [],
  },
  {
    id: 'LS-MNO345-GH',
    email: 'raj.kumar@bank.com.my',
    package: 'basic',
    addons: { linkedinBanner: false, rushDelivery: false },
    total: 79,
    status: 'refunded',
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    photoCount: 6,
    photos: [],
    resultPhotos: [],
    notes: 'Customer requested refund - not satisfied with quality',
  },
];

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [orders, setOrders] = useState<Order[]>(DEMO_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [actionToast, setActionToast] = useState<string | null>(null);

  useEffect(() => {
    const session = sessionStorage.getItem('linkedshot_admin');
    if (session === 'true') setIsLoggedIn(true);

    // Try to fetch real orders
    fetch('/api/orders')
      .then((r) => r.json())
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setOrders([...data, ...DEMO_ORDERS]);
        }
      })
      .catch(() => {});
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsLoggedIn(true);
      sessionStorage.setItem('linkedshot_admin', 'true');
    } else {
      setLoginError('Incorrect password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    sessionStorage.removeItem('linkedshot_admin');
  };

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3000);
  };

  const updateStatus = (id: string, status: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    }).catch(() => {});
    showToast(`Order ${id} updated to ${status}`);
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      searchQuery === '' ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Stats
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayOrders = orders.filter((o) => new Date(o.createdAt) >= today);
  const todayRevenue = todayOrders
    .filter((o) => o.status !== 'refunded')
    .reduce((s, o) => s + o.total, 0);
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-[#F3F6F8] flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-lg p-8 w-full max-w-sm"
        >
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-[#0A66C2] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🔐</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Admin Login</h1>
            <p className="text-gray-500 text-sm mt-1">LinkedShot Dashboard</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setLoginError('');
                }}
                placeholder="Enter admin password"
                className={`w-full px-4 py-3 border rounded-xl focus:outline-none focus:ring-2 transition-all ${
                  loginError
                    ? 'border-red-300 focus:ring-red-200'
                    : 'border-gray-200 focus:border-[#0A66C2] focus:ring-[#0A66C2]/20'
                }`}
                autoFocus
              />
              {loginError && (
                <p className="mt-1.5 text-sm text-red-500">{loginError}</p>
              )}
            </div>
            <button
              type="submit"
              className="w-full bg-[#0A66C2] text-white font-bold py-3 rounded-xl hover:bg-[#0855A0] transition-colors"
            >
              Login
            </button>
          </form>
          <p className="text-center text-xs text-gray-400 mt-4">Demo password: admin123</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F6F8]">
      {/* Header */}
      <div className="bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <a href="/" className="font-bold text-xl text-gray-900">
              Linked<span className="text-[#0A66C2]">Shot</span>
            </a>
            <span className="bg-[#EBF3FC] text-[#0A66C2] text-xs font-bold px-2 py-0.5 rounded-full">
              ADMIN
            </span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 text-gray-600 hover:text-red-600 text-sm font-medium transition-colors"
          >
            <LogOut className="w-4 h-4" />
            Logout
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Orders Today',
              value: todayOrders.length,
              icon: Package,
              color: 'text-[#0A66C2]',
              bg: 'bg-[#EBF3FC]',
            },
            {
              label: 'Revenue Today',
              value: `RM${todayRevenue}`,
              icon: DollarSign,
              color: 'text-[#057642]',
              bg: 'bg-green-50',
            },
            {
              label: 'Pending',
              value: pendingCount,
              icon: Clock,
              color: 'text-yellow-600',
              bg: 'bg-yellow-50',
            },
            {
              label: 'Completed',
              value: completedCount,
              icon: CheckCircle,
              color: 'text-purple-600',
              bg: 'bg-purple-50',
            },
          ].map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-2xl border border-gray-100 p-5"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-medium text-gray-500">{stat.label}</span>
                <div className={`w-8 h-8 ${stat.bg} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-4 h-4 ${stat.color}`} />
                </div>
              </div>
              <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
            </motion.div>
          ))}
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-5">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search by email or order ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0A66C2] focus:ring-2 focus:ring-[#0A66C2]/20"
            />
          </div>
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as OrderStatus | 'all')}
              className="px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:border-[#0A66C2] bg-white"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="processing">Processing</option>
              <option value="completed">Completed</option>
              <option value="refunded">Refunded</option>
            </select>
          </div>
        </div>

        {/* Orders table */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100">
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Order ID
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Email
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Package
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Total
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Photos
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Date
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600 text-xs uppercase tracking-wide">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {filteredOrders.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-10 text-gray-400">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  filteredOrders.map((order) => {
                    const status = STATUS_CONFIG[order.status];
                    const date = new Date(order.createdAt);
                    const timeAgo = getTimeAgo(date);

                    return (
                      <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3">
                          <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700">
                            {order.id}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700 max-w-[180px] truncate">
                          {order.email}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-semibold px-2 py-1 rounded-full ${
                              order.package === 'pro'
                                ? 'bg-purple-50 text-purple-700'
                                : 'bg-blue-50 text-blue-700'
                            }`}
                          >
                            {order.package === 'pro' ? 'Pro' : 'Basic'}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-semibold text-gray-900">
                          RM{order.total}
                        </td>
                        <td className="px-4 py-3 text-gray-600">
                          {order.photoCount} photos
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${status.bg} ${status.color}`}
                          >
                            {status.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-500 text-xs">
                          {timeAgo}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1.5">
                            <button
                              onClick={() => showToast(`Viewing photos for ${order.id}`)}
                              className="w-7 h-7 bg-gray-100 rounded-lg flex items-center justify-center hover:bg-gray-200 transition-colors"
                              title="View Photos"
                            >
                              <Eye className="w-3.5 h-3.5 text-gray-600" />
                            </button>
                            <button
                              onClick={() => updateStatus(order.id, 'processing')}
                              className="w-7 h-7 bg-blue-50 rounded-lg flex items-center justify-center hover:bg-blue-100 transition-colors"
                              title="Upload Results"
                            >
                              <Upload className="w-3.5 h-3.5 text-blue-600" />
                            </button>
                            <button
                              onClick={() => updateStatus(order.id, 'completed')}
                              className="w-7 h-7 bg-green-50 rounded-lg flex items-center justify-center hover:bg-green-100 transition-colors"
                              title="Mark Complete & Send"
                            >
                              <Send className="w-3.5 h-3.5 text-green-600" />
                            </button>
                            <button
                              onClick={() => updateStatus(order.id, 'refunded')}
                              className="w-7 h-7 bg-red-50 rounded-lg flex items-center justify-center hover:bg-red-100 transition-colors"
                              title="Issue Refund"
                            >
                              <RefreshCw className="w-3.5 h-3.5 text-red-500" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* Table footer */}
          <div className="px-4 py-3 border-t border-gray-100 flex items-center justify-between text-xs text-gray-500">
            <span>Showing {filteredOrders.length} of {orders.length} orders</span>
            <span>Total revenue: RM{orders.filter((o) => o.status !== 'refunded').reduce((s, o) => s + o.total, 0)}</span>
          </div>
        </div>
      </div>

      {/* Toast */}
      {actionToast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-4 right-4 bg-gray-900 text-white px-5 py-3 rounded-xl shadow-xl text-sm font-semibold z-50"
        >
          {actionToast}
        </motion.div>
      )}
    </div>
  );
}

function getTimeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}
