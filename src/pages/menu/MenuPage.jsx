import { useState } from 'react';
import { useApp } from '../../contexts/AppContext';
import { FiSearch, FiPlus, FiEdit2, FiTrash2, FiToggleLeft, FiToggleRight } from 'react-icons/fi';

const CATEGORIES = [
  { key: 'all', label: 'Tất cả', emoji: '☕' },
  { key: 'espresso', label: 'Espresso', emoji: '☕' },
  { key: 'cold', label: 'Cold Drinks', emoji: '🧊' },
  { key: 'specialty', label: 'Đặc biệt', emoji: '✨' },
  { key: 'vietnamese', label: 'Cà phê Việt', emoji: '🇻🇳' },
  { key: 'food', label: 'Đồ ăn', emoji: '🥐' },
];

const formatCurrency = (n) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const MenuPage = () => {
  const { menu, updateMenuItem, deleteMenuItem } = useApp();
  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');

  const filtered = menu.filter(item => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.description.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const toggleAvailable = (item) => {
    updateMenuItem({ ...item, available: !item.available });
  };

  const handleDelete = (item) => {
    if (window.confirm(`Xóa "${item.name}" khỏi thực đơn?`)) {
      deleteMenuItem(item.id);
    }
  };

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="page-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
          <div>
            <h1>Quản lý Thực đơn</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              {menu.filter(m => m.available).length} sản phẩm đang hoạt động / {menu.length} tổng cộng
            </p>
          </div>
          <button className="btn btn-primary">
            <FiPlus /> Thêm sản phẩm
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="search-bar" style={{ marginBottom: 'var(--space-lg)', maxWidth: 400 }}>
        <FiSearch className="search-icon" />
        <input
          placeholder="Tìm kiếm sản phẩm..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Category Tabs */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 'var(--space-xl)', flexWrap: 'wrap' }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.key}
            onClick={() => setActiveCategory(cat.key)}
            className={activeCategory === cat.key ? 'btn btn-primary btn-sm btn-rounded' : 'btn btn-secondary btn-sm btn-rounded'}
          >
            {cat.emoji} {cat.label}
          </button>
        ))}
      </div>

      {/* Products Grid */}
      {filtered.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">☕</div>
          <h3>Không tìm thấy sản phẩm</h3>
          <p>Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 'var(--space-lg)' }}>
          {filtered.map(item => (
            <div key={item.id} className="card" style={{
              overflow: 'hidden',
              opacity: item.available ? 1 : 0.65,
            }}>
              {/* Image */}
              <div style={{ position: 'relative', height: 160, overflow: 'hidden' }}>
                <img src={item.image} alt={item.name}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.4s ease' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.05)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                <div style={{
                  position: 'absolute', top: 8, left: 8,
                  display: 'flex', gap: 4,
                }}>
                  {item.tags?.slice(0,2).map(tag => (
                    <span key={tag} style={{
                      fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.5px',
                      textTransform: 'uppercase', padding: '3px 8px',
                      borderRadius: 'var(--radius-full)',
                      background: 'rgba(0,0,0,0.7)',
                      color: tag === 'bestseller' ? 'var(--brand-gold)' :
                             tag === 'new' ? 'var(--success)' : 'var(--text-secondary)',
                      backdropFilter: 'blur(4px)',
                    }}>
                      {tag === 'bestseller' ? '⭐ Hot' : tag === 'new' ? '✦ New' : tag}
                    </span>
                  ))}
                </div>
                {!item.available && (
                  <div style={{
                    position: 'absolute', inset: 0,
                    background: 'rgba(0,0,0,0.5)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    backdropFilter: 'blur(2px)',
                  }}>
                    <span style={{
                      color: 'var(--danger)', fontWeight: 700, fontSize: '0.85rem',
                      background: 'rgba(239,68,68,0.15)', padding: '6px 14px',
                      borderRadius: 'var(--radius-full)', border: '1px solid rgba(239,68,68,0.4)',
                    }}>
                      Tạm ngưng
                    </span>
                  </div>
                )}
              </div>

              {/* Content */}
              <div style={{ padding: '16px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: '1rem', fontFamily: 'var(--font-display)', lineHeight: 1.3 }}>
                    {item.name}
                  </h3>
                  <span style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--brand-caramel)', whiteSpace: 'nowrap', marginLeft: 8 }}>
                    {formatCurrency(item.price)}
                  </span>
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 12, lineHeight: 1.5,
                  display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                  {item.description}
                </p>

                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ fontSize: '0.78rem', color: 'var(--brand-gold)' }}>★ {item.rating}</span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>({item.orderCount} đơn)</span>
                  </div>

                  <div style={{ display: 'flex', gap: 6 }}>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => toggleAvailable(item)} title="Bật/tắt">
                      {item.available ? <FiToggleRight size={18} style={{ color: 'var(--success)' }} /> : <FiToggleLeft size={18} />}
                    </button>
                    <button className="btn btn-ghost btn-icon btn-sm" title="Chỉnh sửa">
                      <FiEdit2 size={15} />
                    </button>
                    <button className="btn btn-ghost btn-icon btn-sm" onClick={() => handleDelete(item)} title="Xóa">
                      <FiTrash2 size={15} style={{ color: 'var(--danger)' }} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MenuPage;
