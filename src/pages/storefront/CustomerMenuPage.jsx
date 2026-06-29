import { useState, useMemo } from 'react';
import { useApp } from '../../contexts/AppContext';

const CAT_LABELS = {
  all: 'Tất cả',
  espresso: 'Cà Phê Máy',
  cold: 'Cold Brew',
  specialty: 'Trái Cây & Trà',
  vietnamese: 'Cà Phê Việt Nam',
  food: 'Bánh & Đồ Ăn',
  other: 'Khác'
};

const CAT_ICONS = {
  all: '🎯',
  espresso: '☕',
  cold: '🧊',
  specialty: '🍓',
  vietnamese: '🇻🇳',
  food: '🍰',
  other: '✨'
};

const PLACEHOLDER_IMAGE = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22300%22 height=%22300%22%3E%3Cdefs%3E%3ClinearGradient id=%22grad%22 x1=%220%25%22 y1=%220%25%22 x2=%22100%25%22 y2=%22100%25%22%3E%3Cstop offset=%220%25%22 style=%22stop-color:%23d4a574;stop-opacity:1%22 /%3E%3Cstop offset=%22100%25%22 style=%22stop-color:%23b8956a;stop-opacity:1%22 /%3E%3C/linearGradient%3E%3C/defs%3E%3Crect fill=%22url(%23grad)%22 width=%22300%22 height=%22300%22/%3E%3Ccircle cx=%22150%22 cy=%22120%22 r=%2230%22 fill=%22%238b6f47%22 opacity=%220.3%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 dominant-baseline=%22middle%22 text-anchor=%22middle%22 font-family=%22system-ui%22 font-size=%2260%22%3E☕%3C/text%3E%3C/svg%3E';

const ProductImage = ({ src, alt }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageFailed(true);
  };

  return (
    <>
      {!imageLoaded && (
        <div 
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(90deg, #f3f4f6 25%, #e5e7eb 50%, #f3f4f6 75%)',
            backgroundSize: '200% 100%',
            animation: 'shimmer 2s infinite',
          }}
        />
      )}
      <img
        src={imageFailed ? PLACEHOLDER_IMAGE : src}
        alt={alt}
        onLoad={handleImageLoad}
        onError={handleImageError}
        style={{
          visibility: imageLoaded ? 'visible' : 'hidden',
          width: '100%',
          height: '100%',
          objectFit: 'cover',
        }}
      />
    </>
  );
};

const CustomerMenuPage = () => {
  const { menu, addToCart } = useApp();
  const [activeCat, setActiveCat] = useState('all');
  const [addedId, setAddedId] = useState(null);

  const handleAddToCart = (item) => {
    addToCart({ ...item, quantity: 1, size: 'M' });
    setAddedId(item.id);
    setTimeout(() => setAddedId(null), 1500);
  };


  const categories = useMemo(
    () => ['all', ...Array.from(new Set(menu.map(item => item.category)))],
    [menu]
  );

  const filteredMenu = useMemo(
    () => activeCat === 'all'
      ? menu.filter(i => i.available)
      : menu.filter(i => i.category === activeCat && i.available),
    [menu, activeCat]
  );

  const categoryCounts = useMemo(() => {
    const counts = {};
    menu.forEach(item => {
      if (item.available) {
        counts[item.category] = (counts[item.category] || 0) + 1;
      }
    });
    counts.all = menu.filter(i => i.available).length;
    return counts;
  }, [menu]);

  const formatPrice = (p) => new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  return (
    <div className="container" style={{ padding: '60px 15px', display: 'flex', gap: '40px' }}>
      {/* Sidebar Categories */}
      <aside className="category-sidebar">
        <div className="category-sticky">
          <div className="category-header">
            Danh Mục
          </div>
          <ul className="category-list" style={{ listStyle: 'none', margin: 0, padding: 0 }}>
            {categories.map(cat => (
              <li key={cat}>
                <button
                  className={`category-btn ${activeCat === cat ? 'active' : ''}`}
                  onClick={() => setActiveCat(cat)}
                  title={CAT_LABELS[cat] || cat}
                >
                  <span className="category-icon">{CAT_ICONS[cat] || '•'}</span>
                  <span>{CAT_LABELS[cat] || cat}</span>
                  <span className="category-count">{categoryCounts[cat] || 0}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      {/* Main Menu Grid */}
      <main style={{ flex: 1 }}>
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '28px', marginBottom: '8px', color: 'var(--text-main)' }}>
            {CAT_ICONS[activeCat] || '🎯'} {CAT_LABELS[activeCat] || activeCat}
          </h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            {filteredMenu.length} sản phẩm
          </p>
        </div>

        {filteredMenu.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">🛒</div>
            <h3>Không có sản phẩm nào</h3>
            <p>Vui lòng thử chọn danh mục khác.</p>
          </div>
        ) : (
          <div className="grid grid-cols-3">
            {filteredMenu.map(item => {
              const badgeClass = item.badge === 'Bestseller' ? 'badge-bestseller'
                : item.badge === 'New' ? 'badge-new'
                  : 'badge-must-try';
              return (
                <div key={item.id} className="product-card-pro">
                  {item.badge && (
                    <span className={`product-badge ${badgeClass}`}>
                      {item.badge}
                    </span>
                  )}
                  <div className="product-img-wrapper">
                    <ProductImage src={item.image} alt={item.name} />
                  </div>
                   <div className="product-info">
                    <div className="product-name">{item.name}</div>
                    <div className="product-price">{formatPrice(item.price)}</div>
                    <div className="product-action">
                      <button
                        className={addedId === item.id ? 'btn-success-coffee' : 'btn-primary'}
                        style={{ width: '100%', fontSize: '15px', padding: '12px 0', borderRadius: '30px', transition: 'all 0.3s' }}
                        onClick={() => handleAddToCart(item)}
                      >
                        {addedId === item.id ? '✓ Đã thêm!' : 'Thêm vào giỏ'}
                      </button>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
};

export default CustomerMenuPage;
