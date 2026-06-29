import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { FiSearch, FiClock, FiCheckCircle, FiAlertCircle, FiLoader, FiXCircle, FiChevronRight } from 'react-icons/fi';

const STATUS_CONFIG = {
  pending:   { label: 'Chờ xác nhận', color: 'var(--warning)',  bg: 'var(--warning-bg)',  icon: FiAlertCircle, next: 'preparing' },
  preparing: { label: 'Đang pha chế', color: 'var(--info)',     bg: 'var(--info-bg)',     icon: FiLoader,      next: 'ready' },
  ready:     { label: 'Sẵn sàng lấy', color: 'var(--success)',  bg: 'var(--success-bg)',  icon: FiCheckCircle, next: 'completed' },
  completed: { label: 'Hoàn thành',   color: 'var(--success)',  bg: 'var(--success-bg)',  icon: FiCheckCircle, next: null },
  cancelled: { label: 'Đã hủy',       color: 'var(--danger)',   bg: 'var(--danger-bg)',   icon: FiXCircle,     next: null },
};

const STATUS_LABELS = {
  all:       'Tất cả',
  pending:   'Chờ xác nhận',
  preparing: 'Đang pha chế',
  ready:     'Sẵn sàng',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
const formatTime = (dt) => dt ? new Date(dt).toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' }) : '--:--';
const formatDate = (dt) => dt ? new Date(dt).toLocaleDateString('vi-VN') : '';

const OrderManagePage = () => {
  const { orders, updateOrderStatus } = useApp();
  const [statusFilter, setStatusFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);

  const filtered = orders.filter(o => {
    const matchStatus = statusFilter === 'all' || o.status === statusFilter;
    const matchSearch = o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const statusCounts = Object.keys(STATUS_LABELS).reduce((acc, key) => {
    acc[key] = key === 'all' ? orders.length : orders.filter(o => o.status === key).length;
    return acc;
  }, {});

  const advanceOrder = (order) => {
    const cfg = STATUS_CONFIG[order.status];
    if (cfg?.next) updateOrderStatus(order.id, cfg.next);
  };

  const cancelOrder = (order) => {
    if (window.confirm('Bạn có chắc muốn hủy đơn hàng này?')) {
      updateOrderStatus(order.id, 'cancelled');
      if (selectedOrder?.id === order.id) setSelectedOrder({ ...order, status: 'cancelled' });
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <h1>Quản lý Đơn hàng</h1>
        <p style={{ color: 'var(--text-muted)' }}>Theo dõi và xử lý tất cả đơn hàng</p>
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
        {Object.entries(STATUS_LABELS).map(([key, label]) => (
          <button key={key}
            onClick={() => setStatusFilter(key)}
            className={statusFilter === key ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            style={{ position: 'relative' }}
          >
            {label}
            {statusCounts[key] > 0 && (
              <span style={{
                marginLeft: 6, background: statusFilter === key ? 'rgba(255,255,255,0.3)' : 'var(--bg-elevated)',
                fontSize: '0.7rem', fontWeight: 700,
                padding: '1px 6px', borderRadius: 'var(--radius-full)',
              }}>
                {statusCounts[key]}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="search-bar" style={{ marginBottom: 'var(--space-lg)', maxWidth: 360 }}>
        <FiSearch className="search-icon" />
        <input placeholder="Tìm theo mã đơn, tên khách..." value={search} onChange={e => setSearch(e.target.value)} />
      </div>

      {/* Orders Layout */}
      <div style={{ display: 'grid', gridTemplateColumns: selectedOrder ? '1fr 380px' : '1fr', gap: 'var(--space-lg)' }}>
        {/* Order List */}
        <div>
          {filtered.length === 0 ? (
            <div className="empty-state card" style={{ padding: 'var(--space-3xl)' }}>
              <div className="empty-state-icon">📋</div>
              <h3>Không có đơn hàng</h3>
              <p>Chưa có đơn nào phù hợp với bộ lọc hiện tại</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map(order => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                const StatusIcon = cfg.icon;
                const isSelected = selectedOrder?.id === order.id;

                return (
                  <div key={order.id}
                    onClick={() => setSelectedOrder(isSelected ? null : order)}
                    style={{
                      background: isSelected ? 'var(--bg-elevated)' : 'var(--bg-card)',
                      border: `1px solid ${isSelected ? 'var(--brand-caramel)' : 'var(--border-subtle)'}`,
                      borderRadius: 'var(--radius-lg)',
                      padding: '14px 18px',
                      cursor: 'pointer',
                      transition: 'var(--ease-fast)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 14,
                    }}
                  >
                    {/* Status Icon */}
                    <div style={{
                      width: 40, height: 40, borderRadius: 'var(--radius-md)',
                      background: cfg.bg,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: cfg.color, flexShrink: 0,
                    }}>
                      <StatusIcon size={18} />
                    </div>

                    {/* Order Info */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 3 }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>{order.orderNumber}</span>
                        <span style={{
                          fontSize: '0.68rem', fontWeight: 700, color: cfg.color,
                          background: cfg.bg, padding: '2px 8px',
                          borderRadius: 'var(--radius-full)',
                        }}>
                          {cfg.label}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                        {order.customerName} · {order.items?.length} món · {formatTime(order.createdAt)}
                      </div>
                    </div>

                    {/* Total + Arrow */}
                    <div style={{ textAlign: 'right', flexShrink: 0 }}>
                      <div style={{ fontWeight: 700, color: 'var(--brand-caramel)', fontSize: '0.95rem' }}>
                        {formatCurrency(order.total)}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'capitalize' }}>
                        {order.paymentMethod}
                      </div>
                    </div>

                    {/* Advance Button */}
                    {['pending','preparing','ready'].includes(order.status) && (
                      <button
                        className="btn btn-primary btn-sm"
                        style={{ flexShrink: 0 }}
                        onClick={e => { e.stopPropagation(); advanceOrder(order); }}
                      >
                        <FiChevronRight />
                        {order.status === 'pending' ? 'Xác nhận' : order.status === 'preparing' ? 'Sẵn sàng' : 'Hoàn thành'}
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Order Detail Panel */}
        {selectedOrder && (
          <div className="animate-scale-in" style={{
            background: 'var(--bg-card)',
            border: '1px solid var(--border-medium)',
            borderRadius: 'var(--radius-xl)',
            padding: 'var(--space-lg)',
            position: 'sticky',
            top: 'calc(var(--navbar-height) + 20px)',
            height: 'fit-content',
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 'var(--space-lg)' }}>
              <div>
                <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.05rem' }}>Chi tiết đơn hàng</h3>
                <div style={{ fontSize: '0.8rem', color: 'var(--brand-caramel)', marginTop: 2 }}>{selectedOrder.orderNumber}</div>
              </div>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setSelectedOrder(null)}>✕</button>
            </div>

            {/* Customer */}
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)', marginBottom: 8 }}>Khách hàng</div>
              <div style={{ fontWeight: 600 }}>{selectedOrder.customerName}</div>
              <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{selectedOrder.customerPhone || 'Chưa có số điện thoại'}</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4 }}>
                📅 {formatDate(selectedOrder.createdAt)} · ⏰ {formatTime(selectedOrder.createdAt)}
              </div>
            </div>

            {/* Items */}
            <div style={{ marginBottom: 'var(--space-md)' }}>
              <div style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.8px', color: 'var(--text-muted)', marginBottom: 8 }}>Món đã đặt</div>
              {selectedOrder.items?.map((item, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.88rem' }}>
                  <div>
                    <div>{item.name} ({item.size})</div>
                    {item.note && <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Note: {item.note}</div>}
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div>×{item.quantity}</div>
                    <div style={{ color: 'var(--brand-caramel)' }}>{formatCurrency(item.unitPrice * item.quantity)}</div>
                  </div>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', marginBottom: 'var(--space-md)' }}>
              {selectedOrder.discount > 0 && (
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 6 }}>
                  <span>Chiết khấu</span>
                  <span style={{ color: 'var(--success)' }}>-{formatCurrency(selectedOrder.discount)}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 700 }}>
                <span>Tổng thanh toán</span>
                <span style={{ color: 'var(--brand-caramel)', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
                  {formatCurrency(selectedOrder.total)}
                </span>
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 4, textTransform: 'capitalize' }}>
                💳 {selectedOrder.paymentMethod}
              </div>
            </div>

            {/* Action Buttons */}
            {['pending','preparing','ready'].includes(selectedOrder.status) && (
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-danger btn-sm" style={{ flex: 1 }} onClick={() => cancelOrder(selectedOrder)}>
                  Hủy đơn
                </button>
                <button className="btn btn-primary" style={{ flex: 2 }} onClick={() => {
                  advanceOrder(selectedOrder);
                  const cfg = STATUS_CONFIG[selectedOrder.status];
                  if (cfg?.next) setSelectedOrder({ ...selectedOrder, status: cfg.next });
                }}>
                  <FiChevronRight />
                  {selectedOrder.status === 'pending' ? 'Xác nhận' : selectedOrder.status === 'preparing' ? 'Đánh dấu sẵn sàng' : 'Hoàn thành'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManagePage;
