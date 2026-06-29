import { useApp } from '../../contexts/AppContext';
import { FiTrendingUp, FiShoppingBag, FiUsers, FiDollarSign } from 'react-icons/fi';

const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const ReportsPage = () => {
  const { orders, menu } = useApp();

  const completedOrders = orders.filter(o => o.status === 'completed');
  const totalRevenue = completedOrders.reduce((s, o) => s + o.total, 0);
  const avgOrder = completedOrders.length ? totalRevenue / completedOrders.length : 0;

  // Revenue by day (last 7 days)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const key = d.toISOString().slice(0, 10);
    const label = d.toLocaleDateString('vi-VN', { weekday: 'short', day: 'numeric' });
    const dayOrders = completedOrders.filter(o => o.createdAt?.startsWith(key));
    const revenue = dayOrders.reduce((s, o) => s + o.total, 0);
    return { key, label, revenue, count: dayOrders.length };
  });

  const maxRevenue = Math.max(...last7.map(d => d.revenue), 1);

  // Category breakdown
  const categorySales = {};
  orders.forEach(o => o.items?.forEach(item => {
    const menuItem = menu.find(m => m.id === item.productId);
    const cat = menuItem?.category || 'other';
    categorySales[cat] = (categorySales[cat] || 0) + item.quantity;
  }));
  const totalItems = Object.values(categorySales).reduce((s, v) => s + v, 0);

  const CAT_LABELS = {
    espresso: 'Espresso',
    cold: 'Cold Drinks',
    specialty: 'Đặc biệt',
    vietnamese: 'Cà phê Việt',
    food: 'Đồ ăn',
    other: 'Khác',
  };

  const CAT_COLORS = {
    espresso: 'var(--brand-caramel)',
    cold: 'var(--info)',
    specialty: 'var(--brand-gold)',
    vietnamese: 'var(--success)',
    food: '#f97316',
    other: 'var(--text-muted)',
  };

  // Payment methods
  const paymentBreakdown = {};
  completedOrders.forEach(o => {
    paymentBreakdown[o.paymentMethod] = (paymentBreakdown[o.paymentMethod] || 0) + o.total;
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h1>Báo cáo & Phân tích</h1>
        <p style={{ color: 'var(--text-muted)' }}>Tổng quan hiệu suất kinh doanh</p>
      </div>

      {/* Key Metrics */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-xl)' }}>
        {[
          { label: 'Tổng doanh thu', value: formatCurrency(totalRevenue), icon: FiDollarSign, color: 'var(--success)' },
          { label: 'Tổng đơn hoàn thành', value: completedOrders.length, icon: FiShoppingBag, color: 'var(--brand-caramel)' },
          { label: 'Giá trị đơn TB', value: formatCurrency(avgOrder), icon: FiTrendingUp, color: 'var(--brand-gold)' },
          { label: 'Tổng đơn tất cả', value: orders.length, icon: FiUsers, color: 'var(--info)' },
        ].map((s, i) => (
          <div key={i} className="stat-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
              <div style={{
                width: 40, height: 40, borderRadius: 'var(--radius-md)',
                background: `${s.color}18`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: s.color,
              }}>
                <s.icon />
              </div>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.label}</span>
            </div>
            <div style={{ fontSize: '1.5rem', fontWeight: 700, fontFamily: 'var(--font-display)', color: 'var(--text-primary)' }}>
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="grid-2" style={{ marginBottom: 'var(--space-xl)' }}>
        {/* Revenue Chart (7 days) */}
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-lg)' }}>📈 Doanh thu 7 ngày qua</h3>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, height: 160 }}>
            {last7.map(day => {
              const pct = maxRevenue > 0 ? (day.revenue / maxRevenue) * 100 : 0;
              return (
                <div key={day.key} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100%', justifyContent: 'flex-end', gap: 6 }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600 }}>
                    {day.revenue > 0 ? `${Math.round(day.revenue/1000)}k` : ''}
                  </div>
                  <div style={{
                    width: '100%',
                    height: `${Math.max(pct, day.revenue > 0 ? 4 : 0)}%`,
                    background: pct > 0
                      ? 'linear-gradient(to top, var(--brand-caramel), var(--brand-gold))'
                      : 'var(--bg-elevated)',
                    borderRadius: '4px 4px 0 0',
                    transition: 'height 0.5s ease',
                    minHeight: day.count > 0 ? 8 : 4,
                  }} />
                  <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', textAlign: 'center', lineHeight: 1.2 }}>
                    {day.label}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card" style={{ padding: 'var(--space-lg)' }}>
          <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-lg)' }}>🥧 Phân bổ danh mục</h3>
          {totalItems === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-xl)' }}>
              <div className="empty-state-icon">📊</div>
              <h3>Chưa có dữ liệu</h3>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {Object.entries(categorySales).sort((a,b)=>b[1]-a[1]).map(([cat, count]) => {
                const pct = Math.round((count / totalItems) * 100);
                const color = CAT_COLORS[cat] || 'var(--text-muted)';
                return (
                  <div key={cat}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                      <span style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{CAT_LABELS[cat] || cat}</span>
                      <span style={{ fontSize: '0.82rem', color, fontWeight: 700 }}>{count} · {pct}%</span>
                    </div>
                    <div style={{ height: 6, background: 'var(--bg-elevated)', borderRadius: 'var(--radius-full)', overflow: 'hidden' }}>
                      <div style={{
                        height: '100%', width: `${pct}%`,
                        background: color,
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

      {/* Payment Methods */}
      <div className="card" style={{ padding: 'var(--space-lg)' }}>
        <h3 style={{ fontFamily: 'var(--font-display)', marginBottom: 'var(--space-lg)' }}>💳 Phương thức thanh toán</h3>
        <div style={{ display: 'flex', gap: 'var(--space-lg)', flexWrap: 'wrap' }}>
          {Object.entries(paymentBreakdown).length === 0 ? (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Chưa có dữ liệu thanh toán</p>
          ) : (
            Object.entries(paymentBreakdown).map(([method, amount]) => (
              <div key={method} style={{
                flex: '1 1 180px',
                background: 'var(--bg-elevated)',
                borderRadius: 'var(--radius-md)',
                padding: 'var(--space-md)',
                border: '1px solid var(--border-subtle)',
              }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 8 }}>
                  {{ cash: '💵', momo: '💜', vnpay: '🔵', card: '💳' }[method] || '💰'}
                </div>
                <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.5px', marginBottom: 4 }}>
                  {method}
                </div>
                <div style={{ fontWeight: 700, color: 'var(--brand-caramel)', fontFamily: 'var(--font-display)' }}>
                  {formatCurrency(amount)}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportsPage;
