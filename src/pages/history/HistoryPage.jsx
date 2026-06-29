import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { FiSearch, FiDownload } from 'react-icons/fi';

const STATUS_CONFIG = {
  pending:   { label: 'Chờ xác nhận', color: 'var(--warning)', bg: 'var(--warning-bg)' },
  preparing: { label: 'Đang pha chế', color: 'var(--info)',    bg: 'var(--info-bg)' },
  ready:     { label: 'Sẵn sàng lấy', color: 'var(--success)', bg: 'var(--success-bg)' },
  completed: { label: 'Hoàn thành',   color: 'var(--success)', bg: 'var(--success-bg)' },
  cancelled: { label: 'Đã hủy',       color: 'var(--danger)',  bg: 'var(--danger-bg)' },
};

const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);
const formatDateTime = (dt) => dt ? new Date(dt).toLocaleString('vi-VN') : '--';

const HistoryPage = () => {
  const { orders } = useApp();
  const [search, setSearch] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');

  const filtered = orders.filter(o => {
    const matchSearch = !search ||
      o.orderNumber?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerName?.toLowerCase().includes(search.toLowerCase());
    const orderDate = o.createdAt ? new Date(o.createdAt) : null;
    const matchFrom = !dateFrom || (orderDate && orderDate >= new Date(dateFrom));
    const matchTo = !dateTo || (orderDate && orderDate <= new Date(dateTo + 'T23:59:59'));
    return matchSearch && matchFrom && matchTo;
  }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalRevenue = filtered.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0);

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Lịch sử Đơn hàng</h1>
          <p style={{ color: 'var(--text-muted)' }}>{filtered.length} đơn hàng · Doanh thu: <strong style={{ color: 'var(--brand-caramel)' }}>{formatCurrency(totalRevenue)}</strong></p>
        </div>
        <button className="btn btn-secondary btn-sm">
          <FiDownload /> Xuất Excel
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 200 }}>
          <FiSearch className="search-icon" />
          <input placeholder="Tìm mã đơn, tên khách..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div className="form-group" style={{ flex: 0 }}>
          <input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}
            style={{ width: 'auto', padding: '8px 12px' }} />
        </div>
        <div className="form-group" style={{ flex: 0 }}>
          <input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}
            style={{ width: 'auto', padding: '8px 12px' }} />
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="data-table">
          <thead>
            <tr>
              <th>Mã đơn</th>
              <th>Khách hàng</th>
              <th>Thời gian</th>
              <th>Món</th>
              <th>Thanh toán</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={7} style={{ textAlign: 'center', padding: '48px', color: 'var(--text-muted)' }}>
                  Không tìm thấy đơn hàng nào
                </td>
              </tr>
            ) : (
              filtered.map(order => {
                const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
                return (
                  <tr key={order.id}>
                    <td style={{ fontWeight: 600, color: 'var(--brand-caramel)', fontFamily: 'monospace', fontSize: '0.82rem' }}>
                      {order.orderNumber}
                    </td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{order.customerName}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.customerPhone}</div>
                    </td>
                    <td style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                      {formatDateTime(order.createdAt)}
                    </td>
                    <td style={{ fontSize: '0.82rem' }}>
                      {order.items?.map(i => `${i.name} ×${i.quantity}`).join(', ').slice(0, 40)}
                      {order.items?.join(',').length > 40 ? '...' : ''}
                    </td>
                    <td style={{ textTransform: 'uppercase', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {order.paymentMethod}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--brand-caramel)' }}>
                      {formatCurrency(order.total)}
                    </td>
                    <td>
                      <span style={{
                        fontSize: '0.72rem', fontWeight: 700, color: cfg.color,
                        background: cfg.bg, padding: '3px 10px',
                        borderRadius: 'var(--radius-full)',
                      }}>
                        {cfg.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HistoryPage;
