import { useState } from 'react';
import { FiSearch, FiUserPlus, FiStar } from 'react-icons/fi';

const SAMPLE_CUSTOMERS = [
  { id: 'MEM001', name: 'Trần Thị Bích', phone: '0912345678', email: 'bich@gmail.com', tier: 'Gold', points: 1250, totalOrders: 42, totalSpent: 2850000, joinDate: '2023-06-15', avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 'MEM002', name: 'Nguyễn Văn An', phone: '0923456789', email: 'an@gmail.com', tier: 'Silver', points: 680, totalOrders: 23, totalSpent: 1380000, joinDate: '2023-09-20', avatar: 'https://i.pravatar.cc/150?img=12' },
  { id: 'MEM003', name: 'Lê Hoàng Nam', phone: '0934567890', email: 'nam@gmail.com', tier: 'Member', points: 180, totalOrders: 7, totalSpent: 420000, joinDate: '2024-01-10', avatar: 'https://i.pravatar.cc/150?img=22' },
  { id: 'MEM004', name: 'Phạm Thu Hương', phone: '0945678901', email: 'huong@gmail.com', tier: 'Platinum', points: 3200, totalOrders: 98, totalSpent: 7600000, joinDate: '2023-01-05', avatar: 'https://i.pravatar.cc/150?img=9' },
  { id: 'MEM005', name: 'Đỗ Minh Tuấn', phone: '0956789012', email: 'tuan@gmail.com', tier: 'Gold', points: 1080, totalOrders: 36, totalSpent: 2160000, joinDate: '2023-07-22', avatar: 'https://i.pravatar.cc/150?img=33' },
];

const TIER_CONFIG = {
  Platinum: { color: '#e5e4e2', icon: '💎' },
  Gold:     { color: 'var(--brand-gold)', icon: '🥇' },
  Silver:   { color: '#9ca3af', icon: '🥈' },
  Member:   { color: 'var(--brand-caramel)', icon: '☕' },
};

const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const CustomersPage = () => {
  const [search, setSearch] = useState('');
  const [tierFilter, setTierFilter] = useState('all');

  const customers = SAMPLE_CUSTOMERS.filter(c => {
    const matchSearch = c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) || c.email.toLowerCase().includes(search.toLowerCase());
    const matchTier = tierFilter === 'all' || c.tier === tierFilter;
    return matchSearch && matchTier;
  });

  return (
    <div className="animate-fade-in">
      <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h1>Quản lý Khách hàng</h1>
          <p style={{ color: 'var(--text-muted)' }}>{customers.length} thành viên</p>
        </div>
        <button className="btn btn-primary">
          <FiUserPlus /> Thêm thành viên
        </button>
      </div>

      {/* Filters */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        <div className="search-bar" style={{ flex: 1, minWidth: 240 }}>
          <FiSearch className="search-icon" />
          <input placeholder="Tên, SĐT, email..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>
        <div style={{ display: 'flex', gap: 6 }}>
          {['all', 'Platinum', 'Gold', 'Silver', 'Member'].map(tier => (
            <button key={tier}
              onClick={() => setTierFilter(tier)}
              className={tierFilter === tier ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
            >
              {tier === 'all' ? 'Tất cả' : `${TIER_CONFIG[tier]?.icon} ${tier}`}
            </button>
          ))}
        </div>
      </div>

      {/* Customer Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 'var(--space-lg)' }}>
        {customers.map(customer => {
          const tierCfg = TIER_CONFIG[customer.tier] || TIER_CONFIG.Member;
          return (
            <div key={customer.id} className="card" style={{ padding: 'var(--space-lg)' }}>
              <div style={{ display: 'flex', gap: 12, marginBottom: 'var(--space-md)' }}>
                <div style={{ position: 'relative' }}>
                  <img src={customer.avatar} alt={customer.name}
                    style={{ width: 52, height: 52, borderRadius: '50%', border: `2px solid ${tierCfg.color}` }}
                  />
                  <span style={{
                    position: 'absolute', bottom: -2, right: -2,
                    fontSize: '0.8rem', background: 'var(--bg-card)',
                    borderRadius: '50%', width: 20, height: 20,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    {tierCfg.icon}
                  </span>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: '1rem', marginBottom: 2 }}>{customer.name}</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{customer.phone}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{customer.email}</div>
                </div>
                <span style={{
                  fontSize: '0.68rem', fontWeight: 700, color: tierCfg.color,
                  background: `${tierCfg.color}18`, padding: '3px 10px',
                  borderRadius: 'var(--radius-full)', height: 'fit-content',
                  border: `1px solid ${tierCfg.color}40`,
                }}>
                  {customer.tier}
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
                <div style={{ textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', padding: '10px 6px' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-caramel)' }}>{customer.totalOrders}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Đơn hàng</div>
                </div>
                <div style={{ textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', padding: '10px 6px' }}>
                  <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--brand-gold)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 2 }}>
                    <FiStar size={12} /> {customer.points}
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Điểm thưởng</div>
                </div>
                <div style={{ textAlign: 'center', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)', padding: '10px 6px' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--success)' }}>
                    {(customer.totalSpent / 1000000).toFixed(1)}M
                  </div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Chi tiêu</div>
                </div>
              </div>

              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 12 }}>
                📅 Thành viên từ {new Date(customer.joinDate).toLocaleDateString('vi-VN')}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CustomersPage;
