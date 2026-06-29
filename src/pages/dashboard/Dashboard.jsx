import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  FiShoppingBag, FiClock, FiTrendingUp, FiUsers,
  FiCoffee, FiAlertCircle, FiCheckCircle, FiLoader
} from 'react-icons/fi';

const STATUS_CONFIG = {
  pending:   { label: 'Chờ xác nhận', color: 'var(--warning)',  bg: 'var(--warning-bg)',  icon: FiAlertCircle },
  preparing: { label: 'Đang pha chế', color: 'var(--info)',     bg: 'var(--info-bg)',     icon: FiLoader },
  ready:     { label: 'Sẵn sàng lấy', color: 'var(--success)',  bg: 'var(--success-bg)',  icon: FiCheckCircle },
  completed: { label: 'Hoàn thành',   color: 'var(--success)',  bg: 'var(--success-bg)',  icon: FiCheckCircle },
  cancelled: { label: 'Đã hủy',       color: 'var(--danger)',   bg: 'var(--danger-bg)',   icon: FiAlertCircle },
};

const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const Dashboard = () => {
  const { orders, menu } = useApp();
  const { user } = useAuth();

  const today = new Date().toISOString().split('T')[0];
  const todayOrders = orders.filter(o => o.createdAt?.startsWith(today));
  const pendingOrders = orders.filter(o => ['pending','preparing','ready'].includes(o.status));
  const todayRevenue = todayOrders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0);
  const avgOrder = todayOrders.length ? todayRevenue / Math.max(todayOrders.filter(o=>o.status==='completed').length, 1) : 0;

  // Top products
  const productCount = {};
  orders.forEach(o => o.items?.forEach(i => {
    productCount[i.name] = (productCount[i.name] || 0) + i.quantity;
  }));
  const topProducts = Object.entries(productCount).sort((a,b) => b[1]-a[1]).slice(0,5);

  const stats = [
    { label: 'Đơn hàng hôm nay', value: todayOrders.length, icon: FiShoppingBag, color: 'var(--brand-caramel)', trend: '+12%' },
    { label: 'Đang xử lý', value: pendingOrders.length, icon: FiClock, color: 'var(--info)', trend: '' },
    { label: 'Doanh thu hôm nay', value: formatCurrency(todayRevenue), icon: FiTrendingUp, color: 'var(--success)', trend: '+8%' },
    { label: 'Sản phẩm hoạt động', value: menu.filter(m => m.available).length, icon: FiCoffee, color: 'var(--brand-gold)', trend: '' },
  ];

  return (
    <div className="animate-fade-in">
      {/* Welcome Banner */}
      <div style={{
        background: 'linear-gradient(135deg, var(--bg-elevated) 0%, var(--bg-card) 100%)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 32px',
        marginBottom: 'var(--space-xl)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', top: -20, right: -20,
          width: 120, height: 120,
          background: 'radial-gradient(circle, rgba(200,132,58,0.15) 0%, transparent 70%)',
          borderRadius: '50%',
        }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', marginBottom: 4 }}>
            ☕ {new Date().getHours() < 12 ? 'Buổi sáng tốt lành' : new Date().getHours() < 18 ? 'Chiều vui vẻ' : 'Buổi tối thư giãn'},&nbsp;
            <span className="text-gradient">{user?.name?.split(' ').slice(-1)[0]}!</span>
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            Hôm nay là {new Date().toLocaleDateString('vi-VN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        {stats.map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 'var(--radius-md)',
                background: `${s.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.color, fontSize: '1.2rem',
              }}>
                <s.icon />
              </div>
              {s.trend && (
                <span style={{
                  fontSize: '0.72rem', fontWeight: 600, color: 'var(--success)',
                  background: 'var(--success-bg)', padding: '2px 8px',
                  borderRadius: 'var(--radius-full)', border: '1px solid rgba(34,197,94,0.2)',
                }}>
                  {s.trend}
                </span>
              )}
            </div>
            <div style={{ fontSize: '1.6rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 4, fontFamily: 'var(--font-display)' }}>
              {s.value}
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Orders + Top Products */}
      <div className="grid-2">
        {/* Active Orders */}
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 'var(--space-lg)' }}>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem' }}>Đơn đang xử lý</h3>
            <span className="badge badge-yellow">{pendingOrders.length} đơn</span>
          </div>
          {pendingOrders.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-xl)' }}>
              <div className="empty-state-icon">✅</div>
              <h3>Không có đơn nào</h3>
              <p>Tất cả đơn hàng đã được xử lý xong!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {pendingOrders.slice(0, 5).map(order => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const StatusIcon = cfg.icon;
                return (
                  <div key={order.id} style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '12px 14px',
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-subtle)',
                  }}>
                    <StatusIcon size={16} style={{ color: cfg.color, flexShrink: 0 }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        {order.orderNumber}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {order.customerName} · {order.items?.length} món
                      </div>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--brand-caramel)' }}>
                        {formatCurrency(order.total)}
                      </div>
                      <span style={{ fontSize: '0.7rem', color: cfg.color, background: cfg.bg, padding: '1px 6px', borderRadius: 'var(--radius-full)' }}>
                        {cfg.label}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top Products */}
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', marginBottom: 'var(--space-lg)' }}>
            🏆 Sản phẩm bán chạy
          </h3>
          {topProducts.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-xl)' }}>
              <div className="empty-state-icon">📊</div>
              <h3>Chưa có dữ liệu</h3>
              <p>Tạo đơn hàng đầu tiên để xem thống kê</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {topProducts.map(([name, count], i) => {
                const maxCount = topProducts[0][1];
                const pct = Math.round((count / maxCount) * 100);
                return (
                  <div key={name}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>
                        {i === 0 ? '🥇' : i === 1 ? '🥈' : i === 2 ? '🥉' : `${i+1}.`} {name}
                      </span>
                      <span style={{ fontSize: '0.82rem', color: 'var(--brand-caramel)', fontWeight: 600 }}>
                        {count} ly
                      </span>
                    </div>
                    <div style={{ height: 5, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: `linear-gradient(90deg, var(--brand-caramel), var(--brand-gold))`,
                        borderRadius: 'var(--radius-full)',
                        transition: 'width 0.8s ease',
                      }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
