'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  LogOut,
  Upload,
  RefreshCw,
  Package,
  Clock,
  CheckCircle,
  DollarSign,
  Search,
  Filter,
  Image,
} from 'lucide-react';
import { Order, OrderStatus } from '@/lib/types';

const STATUS_CONFIG: Record<OrderStatus, { label: string; color: string; bg: string }> = {
  pending: { label: 'Pending', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200' },
  processing: { label: 'Processing', color: 'text-blue-700', bg: 'bg-blue-50 border-blue-200' },
  completed: { label: 'Completed', color: 'text-green-700', bg: 'bg-green-50 border-green-200' },
  refunded: { label: 'Refunded', color: 'text-red-700', bg: 'bg-red-50 border-red-200' },
};

interface AdminStats {
  ordersToday: number;
  revenueToday: number;
  pending: number;
  completed: number;
}

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [orders, setOrders] = useState<Order[]>([]);
  const [stats, setStats] = useState<AdminStats>({ ordersToday: 0, revenueToday: 0, pending: 0, completed: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [actionToast, setActionToast] = useState<string | null>(null);
  const [uploadingFor, setUploadingFor] = useState<string | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);
  const [adminPassword, setAdminPassword] = useState('');

  const fetchOrders = async (pwd: string) => {
    try {
      const res = await fetch('/api/orders', {
        headers: { 'x-admin-password': pwd },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (Array.isArray(data.orders)) {
        setOrders(data.orders);
      }
      if (data.stats) {
        setStats(data.stats);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    const session = sessionStorage.getItem('linkedshot_admin');
    const savedPwd = sessionStorage.getItem('linkedshot_admin_pwd') ?? '';
    if (session === 'true' && savedPwd) {
      setIsLoggedIn(true);
      setAdminPassword(savedPwd);
      fetchOrders(savedPwd);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    // Verify password against API
    const res = await fetch('/api/orders', {
      headers: { 'x-admin-password': password },
    });
    if (res.ok) {
      const data = await res.json();
      setIsLoggedIn(true);
      setAdminPassword(password);
      sessionStorage.setItem('linkedshot_admin', 'true');
      sessionStorage.setItem('linkedshot_admin_pwd', password);
      if (Array.isArray(data.orders)) setOrders(data.orders);
      if (data.stats) setStats(data.stats);
    } else {
      setLoginError('Incorrect password');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setAdminPassword('');
    setOrders([]);
    sessionStorage.removeItem('linkedshot_admin');
    sessionStorage.removeItem('linkedshot_admin_pwd');
  };

  const showToast = (msg: string) => {
    setActionToast(msg);
    setTimeout(() => setActionToast(null), 3000);
  };

  const updateStatus = async (id: string, status: OrderStatus) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status } : o))
    );
    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      if (res.ok) {
        const updated: Order = await res.json();
        setOrders((prev) => prev.map((o) => (o.id === id ? updated : o)));
        showToast(`Order ${id} updated to ${status}`);
        // Refresh stats
        fetchOrders(adminPassword);
      }
    } catch {
      showToast('Failed to update status');
    }
  };

  const handleUploadResults = async (orderId: string, files: FileList) => {
    if (!files || files.length === 0) return;
    setUploadingFor(orderId);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append('photos', file);
      });

      const res = await fetch(`/api/orders/${orderId}/upload-results`, {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const data = await res.json();
        if (data.order) {
          setOrders((prev) => prev.map((o) => (o.id === orderId ? data.order : o)));
        }
        showToast(`Results uploaded for order ${orderId}`);
        fetchOrders(adminPassword);
      } else {
        const err = await res.json().catch(() => ({}));
        showToast(err.error ?? 'Upload failed');
      }
    } catch {
      showToast('Upload failed');
    } finally {
      setUploadingFor(null);
    }
  };

  const filteredOrders = orders.filter((o) => {
    const matchSearch =
      searchQuery === '' ||
      o.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.id.toLowerCase().includes(searchQuery.toLowerCase());
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const totalRevenue = orders
    .filter((o) => o.status !== 'refunded')
    .reduce((s, o) => s + o.total, 0);

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
          <p className="text-center text-xs text-gray-400 mt-4">Default password: admin123</p>
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
          <div className="flex items-center gap-3">
            <button
              onClick={() => fetchOrders(adminPassword)}
              className="flex items-center gap-1.5 text-gray-500 hover:text-[#0A66C2] text-sm font-medium transition-colors"
              title="Refresh orders"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-gray-600 hover:text-red-600 text-sm font-medium transition-colors"
            >
              <LogOut className="w-4 h-4" />
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Dashboard</h1>

        {/* Stats cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            {
              label: 'Orders Today',
              value: stats.ordersToday,
              icon: Package,
              color: 'text-[#0A66C2]',
              bg: 'bg-[#EBF3FC]',
            },
            {
              label: 'Revenue Today',
              value: `RM${stats.revenueToday}`,
              icon: DollarSign,
              color: 'text-[#057642]',
              bg: 'bg-green-50',
            },
            {
              label: 'Pending',
              value: stats.pending,
              icon: Clock,
              color: 'text-yellow-600',
              bg: 'bg-yellow-50',
            },
            {
              label: 'Completed',
              value: stats.completed,
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

        {/* Orders list */}
        <div className="space-y-4">
          {filteredOrders.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center text-gray-400">
              {orders.length === 0 ? 'No orders yet. Orders will appear here after customers complete checkout.' : 'No orders match your filters.'}
            </div>
          ) : (
            filteredOrders.map((order) => {
              const status = STATUS_CONFIG[order.status];
              const date = new Date(order.createdAt);
              const timeAgo = getTimeAgo(date);
              const isExpanded = expandedOrder === order.id;

              return (
                <div key={order.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  {/* Order header row */}
                  <div
                    className="flex flex-wrap items-center gap-3 px-5 py-4 cursor-pointer hover:bg-gray-50 transition-colors"
                    onClick={() => setExpandedOrder(isExpanded ? null : order.id)}
                  >
                    {/* ID */}
                    <span className="font-mono text-xs bg-gray-100 px-1.5 py-0.5 rounded text-gray-700 flex-shrink-0">
                      {order.id}
                    </span>

                    {/* Email */}
                    <span className="text-gray-700 text-sm flex-1 min-w-[160px] truncate">
                      {order.email}
                    </span>

                    {/* Package */}
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0 ${
                      order.package === 'pro'
                        ? 'bg-purple-50 text-purple-700'
                        : 'bg-blue-50 text-blue-700'
                    }`}>
                      {order.package === 'pro' ? 'Pro' : 'Basic'}
                    </span>

                    {/* Total */}
                    <span className="font-semibold text-gray-900 text-sm flex-shrink-0">
                      RM{order.total}
                    </span>

                    {/* Photo count */}
                    <span className="text-gray-500 text-xs flex-shrink-0">
                      {order.photoCount} photos
                    </span>

                    {/* Status dropdown */}
                    <div onClick={(e) => e.stopPropagation()}>
                      <select
                        value={order.status}
                        onChange={(e) => updateStatus(order.id, e.target.value as OrderStatus)}
                        className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-none ${status.bg} ${status.color}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="completed">Completed</option>
                        <option value="refunded">Refunded</option>
                      </select>
                    </div>

                    {/* Time */}
                    <span className="text-gray-400 text-xs flex-shrink-0">{timeAgo}</span>

                    {/* Expand chevron */}
                    <span className="text-gray-400 text-xs flex-shrink-0">
                      {isExpanded ? '▲' : '▼'}
                    </span>
                  </div>

                  {/* Expanded detail panel */}
                  {isExpanded && (
                    <div className="border-t border-gray-100 px-5 py-4 space-y-4 bg-gray-50">
                      {/* Addons */}
                      <div className="flex gap-3 text-xs">
                        {order.addons.linkedinBanner && (
                          <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full border border-blue-200 font-medium">
                            + LinkedIn Banner
                          </span>
                        )}
                        {order.addons.rushDelivery && (
                          <span className="bg-orange-50 text-orange-700 px-2 py-1 rounded-full border border-orange-200 font-medium">
                            + Rush Delivery
                          </span>
                        )}
                        {!order.addons.linkedinBanner && !order.addons.rushDelivery && (
                          <span className="text-gray-400">No addons</span>
                        )}
                      </div>

                      {/* Uploaded source photos */}
                      {order.photos && order.photos.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                            <Image className="w-3.5 h-3.5" />
                            Customer Photos ({order.photos.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {order.photos.map((photoPath, idx) => (
                              <a
                                key={idx}
                                href={photoPath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-14 h-14 rounded-lg overflow-hidden border border-gray-200 bg-gray-100 flex-shrink-0 hover:border-[#0A66C2] transition-colors"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={photoPath}
                                  alt={`Customer photo ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Result photos */}
                      {order.resultPhotos && order.resultPhotos.length > 0 && (
                        <div>
                          <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                            <CheckCircle className="w-3.5 h-3.5 text-green-600" />
                            Result Photos ({order.resultPhotos.length})
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {order.resultPhotos.map((photoPath, idx) => (
                              <a
                                key={idx}
                                href={photoPath}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-14 h-14 rounded-lg overflow-hidden border border-green-200 bg-gray-100 flex-shrink-0"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={photoPath}
                                  alt={`Result ${idx + 1}`}
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    (e.currentTarget as HTMLImageElement).style.display = 'none';
                                  }}
                                />
                              </a>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Upload results section */}
                      <div>
                        <p className="text-xs font-semibold text-gray-600 mb-2 flex items-center gap-1.5">
                          <Upload className="w-3.5 h-3.5" />
                          Upload Result Photos
                        </p>
                        <label className="inline-flex items-center gap-2 cursor-pointer">
                          <input
                            type="file"
                            accept="image/*"
                            multiple
                            className="hidden"
                            disabled={uploadingFor === order.id}
                            onChange={(e) => {
                              if (e.target.files) {
                                handleUploadResults(order.id, e.target.files);
                              }
                            }}
                          />
                          <span className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-colors ${
                            uploadingFor === order.id
                              ? 'bg-gray-100 text-gray-400 border-gray-200 cursor-not-allowed'
                              : 'bg-white text-[#0A66C2] border-[#0A66C2] hover:bg-[#EBF3FC]'
                          }`}>
                            {uploadingFor === order.id ? (
                              <>
                                <svg className="animate-spin w-3.5 h-3.5" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                                </svg>
                                Uploading...
                              </>
                            ) : (
                              <>
                                <Upload className="w-3.5 h-3.5" />
                                Choose Photos
                              </>
                            )}
                          </span>
                        </label>
                        <p className="text-xs text-gray-400 mt-1">
                          Uploading photos will automatically mark order as completed.
                        </p>
                      </div>

                      {/* Notes */}
                      {order.notes && (
                        <div className="bg-yellow-50 border border-yellow-200 rounded-xl px-3 py-2 text-xs text-yellow-800">
                          <strong>Note:</strong> {order.notes}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between text-xs text-gray-500 px-1">
          <span>Showing {filteredOrders.length} of {orders.length} orders</span>
          <span>Total revenue: RM{totalRevenue}</span>
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
