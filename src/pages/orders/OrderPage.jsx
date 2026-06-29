import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import {
  FiSearch, FiPlus, FiMinus, FiTrash2,
  FiShoppingCart, FiX, FiCheck, FiUser
} from 'react-icons/fi';

const CATEGORIES = [
  { key: 'all', label: 'Tất cả', emoji: '☕' },
  { key: 'espresso', label: 'Espresso', emoji: '☕' },
  { key: 'cold', label: 'Cold Drinks', emoji: '🧊' },
  { key: 'specialty', label: 'Đặc biệt', emoji: '✨' },
  { key: 'vietnamese', label: 'Cà phê Việt', emoji: '🇻🇳' },
  { key: 'food', label: 'Đồ ăn', emoji: '🥐' },
];

const PAYMENT_METHODS = [
  { key: 'cash', label: 'Tiền mặt', icon: '💵' },
  { key: 'momo', label: 'MoMo', icon: '💜' },
  { key: 'vnpay', label: 'VNPay', icon: '🔵' },
  { key: 'card', label: 'Thẻ ngân hàng', icon: '💳' },
];

const formatCurrency = (n) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(n);

const OrderPage = () => {
  const { menu, cart, addToCart, removeFromCart, updateCartQuantity, cartTotal, placeOrder } = useApp();
  const navigate = useNavigate();

  const [activeCategory, setActiveCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedSize, setSelectedSize] = useState('');
  const [noteText, setNoteText] = useState('');

  // Checkout state
  const [showCheckout, setShowCheckout] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('cash');
  const [discount, setDiscount] = useState(0);
  const [orderNote, setOrderNote] = useState('');
  const [success, setSuccess] = useState(false);

  const availableMenu = menu.filter(m => m.available);
  const filtered = availableMenu.filter(item => {
    const matchCat = activeCategory === 'all' || item.category === activeCategory;
    const matchSearch = item.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const openProduct = (product) => {
    setSelectedProduct(product);
    setSelectedSize(product.sizes[0]?.label || '');
    setNoteText('');
  };

  const addProductToCart = () => {
    if (!selectedProduct) return;
    addToCart(selectedProduct, selectedSize, 1, noteText);
    setSelectedProduct(null);
  };

  const finalTotal = Math.max(0, cartTotal - discount);

  const handlePlaceOrder = () => {
    if (!customerName.trim()) return;
    const order = placeOrder({
      customerName: customerName.trim(),
      customerPhone: customerPhone.trim(),
      items: cart.map(i => ({
        productId: i.productId,
        name: i.name,
        size: i.size,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
        note: i.note,
      })),
      subtotal: cartTotal,
      discount,
      total: finalTotal,
      paymentMethod,
      orderType: 'takeaway',
      note: orderNote,
    });
    setSuccess(true);
    setTimeout(() => {
      setSuccess(false);
      setShowCheckout(false);
      navigate('/orders');
    }, 2500);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 'var(--space-lg)', height: 'calc(100vh - var(--navbar-height) - 48px)', alignItems: 'start' }}>

      {/* LEFT — Menu */}
      <div className="animate-fade-in" style={{ overflowY: 'auto', maxHeight: '100%', paddingBottom: 24 }}>
        {/* Search */}
        <div className="search-bar" style={{ marginBottom: 'var(--space-md)' }}>
          <FiSearch className="search-icon" />
          <input placeholder="Tìm món..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        {/* Category Tabs */}
        <div style={{ display: 'flex', gap: 6, marginBottom: 'var(--space-lg)', flexWrap: 'wrap' }}>
          {CATEGORIES.map(cat => (
            <button key={cat.key}
              onClick={() => setActiveCategory(cat.key)}
              className={activeCategory === cat.key ? 'btn btn-primary btn-sm btn-rounded' : 'btn btn-secondary btn-sm btn-rounded'}
              style={{ fontSize: '0.78rem' }}
            >
              {cat.emoji} {cat.label}
            </button>
          ))}
        </div>

        {/* Menu Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 'var(--space-md)' }}>
          {filtered.map(item => (
            <div key={item.id}
              className="card"
              style={{ cursor: 'pointer', overflow: 'hidden' }}
              onClick={() => openProduct(item)}
            >
              <div style={{ height: 130, overflow: 'hidden', position: 'relative' }}>
                <img src={item.image} alt={item.name} style={{ width: '100%', height: '100%', objectFit: 'cover', transition: 'transform 0.3s' }}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.07)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                />
                {item.tags?.includes('bestseller') && (
                  <span style={{
                    position: 'absolute', top: 6, right: 6,
                    background: 'rgba(212,168,83,0.9)', color: '#1a0a00',
                    fontSize: '0.6rem', fontWeight: 800,
                    padding: '2px 7px', borderRadius: 'var(--radius-full)',
                    backdropFilter: 'blur(4px)',
                  }}>⭐ HOT</span>
                )}
                {item.tags?.includes('new') && (
                  <span style={{
                    position: 'absolute', top: 6, right: 6,
                    background: 'rgba(34,197,94,0.9)', color: '#fff',
                    fontSize: '0.6rem', fontWeight: 800,
                    padding: '2px 7px', borderRadius: 'var(--radius-full)',
                  }}>✦ NEW</span>
                )}
              </div>
              <div style={{ padding: '12px 14px' }}>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.92rem', fontWeight: 600, marginBottom: 4 }}>
                  {item.name}
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ color: 'var(--brand-caramel)', fontWeight: 700, fontSize: '0.95rem' }}>
                    {formatCurrency(item.price)}
                  </span>
                  <span style={{ fontSize: '0.72rem', color: 'var(--brand-gold)' }}>★ {item.rating}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT — Cart */}
      <div style={{
        background: 'var(--bg-card)',
        border: '1px solid var(--border-subtle)',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        flexDirection: 'column',
        height: 'calc(100vh - var(--navbar-height) - 48px)',
        overflow: 'hidden',
        position: 'sticky',
        top: 'var(--navbar-height)',
      }}>
        {/* Cart Header */}
        <div style={{
          padding: '20px var(--space-lg) 16px',
          borderBottom: '1px solid var(--border-subtle)',
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <FiShoppingCart style={{ color: 'var(--brand-caramel)' }} />
          <h3 style={{ fontFamily: 'var(--font-display)', flex: 1 }}>Giỏ hàng</h3>
          {cart.length > 0 && (
            <span style={{
              background: 'var(--brand-caramel)', color: '#fff',
              fontSize: '0.72rem', fontWeight: 700,
              padding: '2px 8px', borderRadius: 'var(--radius-full)',
            }}>
              {cart.reduce((s, i) => s + i.quantity, 0)} món
            </span>
          )}
        </div>

        {/* Cart Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '12px var(--space-md)' }}>
          {cart.length === 0 ? (
            <div className="empty-state" style={{ padding: 'var(--space-2xl) var(--space-md)' }}>
              <div style={{ fontSize: '2.5rem' }}>🛒</div>
              <h3>Giỏ hàng trống</h3>
              <p>Chọn món từ thực đơn để bắt đầu</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {cart.map(item => (
                <div key={item.cartKey} style={{
                  background: 'var(--bg-elevated)',
                  borderRadius: 'var(--radius-md)',
                  padding: '10px 12px',
                  border: '1px solid var(--border-subtle)',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 600 }}>{item.name}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.size}</div>
                    </div>
                    <button onClick={() => removeFromCart(item.cartKey)} className="btn btn-ghost btn-icon btn-sm">
                      <FiX size={13} style={{ color: 'var(--danger)' }} />
                    </button>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <button className="btn btn-secondary btn-icon btn-sm"
                        style={{ width: 26, height: 26, padding: 0 }}
                        onClick={() => updateCartQuantity(item.cartKey, item.quantity - 1)}>
                        <FiMinus size={11} />
                      </button>
                      <span style={{ width: 28, textAlign: 'center', fontSize: '0.88rem', fontWeight: 700 }}>
                        {item.quantity}
                      </span>
                      <button className="btn btn-secondary btn-icon btn-sm"
                        style={{ width: 26, height: 26, padding: 0 }}
                        onClick={() => updateCartQuantity(item.cartKey, item.quantity + 1)}>
                        <FiPlus size={11} />
                      </button>
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--brand-caramel)' }}>
                      {formatCurrency(item.unitPrice * item.quantity)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Cart Footer */}
        {cart.length > 0 && (
          <div style={{ padding: 'var(--space-md)', borderTop: '1px solid var(--border-subtle)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Tổng cộng</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem', color: 'var(--brand-caramel)', fontWeight: 700 }}>
                {formatCurrency(cartTotal)}
              </span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%' }} onClick={() => setShowCheckout(true)}>
              <FiCheck /> Xác nhận đơn hàng
            </button>
          </div>
        )}
      </div>

      {/* Product Detail Modal */}
      {selectedProduct && (
        <div className="modal-overlay" onClick={() => setSelectedProduct(null)}>
          <div className="modal animate-scale-in" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
            <div style={{ height: 200, overflow: 'hidden', borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0' }}>
              <img src={selectedProduct.image} alt={selectedProduct.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            <div className="modal-body">
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', marginBottom: 6 }}>{selectedProduct.name}</h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: 'var(--space-lg)' }}>{selectedProduct.description}</p>

              {/* Sizes */}
              <div className="form-group" style={{ marginBottom: 'var(--space-md)' }}>
                <label className="form-label">Chọn size</label>
                <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                  {selectedProduct.sizes.map(s => (
                    <button key={s.label}
                      onClick={() => setSelectedSize(s.label)}
                      className={selectedSize === s.label ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                    >
                      {s.label}
                      {s.extraPrice > 0 && <span style={{ opacity: 0.7 }}> +{formatCurrency(s.extraPrice)}</span>}
                    </button>
                  ))}
                </div>
              </div>

              {/* Note */}
              <div className="form-group" style={{ marginBottom: 'var(--space-lg)' }}>
                <label className="form-label">Ghi chú</label>
                <input placeholder="Ít đường, thêm đá, không sữa..." value={noteText} onChange={e => setNoteText(e.target.value)} />
              </div>

              {/* Price + Add */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: 2 }}>Giá</div>
                  <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--brand-caramel)', fontFamily: 'var(--font-display)' }}>
                    {formatCurrency(selectedProduct.price + (selectedProduct.sizes.find(s => s.label === selectedSize)?.extraPrice || 0))}
                  </div>
                </div>
                <button className="btn btn-primary" onClick={addProductToCart}>
                  <FiPlus /> Thêm vào giỏ
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Checkout Modal */}
      {showCheckout && (
        <div className="modal-overlay">
          <div className="modal animate-scale-in">
            {success ? (
              <div style={{ padding: 'var(--space-3xl)', textAlign: 'center' }}>
                <div style={{ fontSize: '3.5rem', marginBottom: 16 }}>✅</div>
                <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', marginBottom: 8, color: 'var(--success)' }}>
                  Đặt hàng thành công!
                </h2>
                <p style={{ color: 'var(--text-muted)' }}>Đơn hàng đang được xử lý, bạn sẽ được chuyển sang trang quản lý đơn...</p>
              </div>
            ) : (
              <>
                <div className="modal-header">
                  <h2>Xác nhận đơn hàng</h2>
                  <button className="btn btn-ghost btn-icon" onClick={() => setShowCheckout(false)}>
                    <FiX />
                  </button>
                </div>
                <div className="modal-body" style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                  {/* Customer Info */}
                  <div style={{
                    background: 'var(--bg-elevated)',
                    borderRadius: 'var(--radius-md)',
                    padding: 'var(--space-md)',
                    border: '1px solid var(--border-subtle)',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 'var(--space-md)' }}>
                      <FiUser size={14} style={{ color: 'var(--brand-caramel)' }} />
                      <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                        Thông tin khách hàng
                      </span>
                    </div>
                    <div className="grid-2" style={{ gap: 10 }}>
                      <div className="form-group">
                        <label className="form-label">Tên khách hàng *</label>
                        <input placeholder="Nguyễn Văn A" value={customerName} onChange={e => setCustomerName(e.target.value)} />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Số điện thoại</label>
                        <input placeholder="09xx xxx xxx" value={customerPhone} onChange={e => setCustomerPhone(e.target.value)} />
                      </div>
                    </div>
                  </div>

                  {/* Order Summary */}
                  <div style={{ background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)', padding: 'var(--space-md)', border: '1px solid var(--border-subtle)' }}>
                    <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-secondary)', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: 10 }}>
                      Chi tiết đơn
                    </div>
                    {cart.map(i => (
                      <div key={i.cartKey} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid var(--border-subtle)', fontSize: '0.88rem' }}>
                        <span>{i.name} ({i.size}) × {i.quantity}</span>
                        <span style={{ color: 'var(--brand-caramel)' }}>{formatCurrency(i.unitPrice * i.quantity)}</span>
                      </div>
                    ))}
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 10 }}>
                      <span style={{ color: 'var(--text-muted)' }}>Chiết khấu</span>
                      <input
                        type="number" min={0} max={cartTotal}
                        value={discount}
                        onChange={e => setDiscount(Number(e.target.value))}
                        style={{ width: 100, textAlign: 'right', padding: '4px 8px', fontSize: '0.88rem' }}
                      />
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontWeight: 700 }}>
                      <span>Tổng thanh toán</span>
                      <span style={{ fontSize: '1.1rem', color: 'var(--brand-caramel)', fontFamily: 'var(--font-display)' }}>
                        {formatCurrency(finalTotal)}
                      </span>
                    </div>
                  </div>

                  {/* Payment */}
                  <div className="form-group">
                    <label className="form-label">Phương thức thanh toán</label>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      {PAYMENT_METHODS.map(pm => (
                        <button key={pm.key}
                          onClick={() => setPaymentMethod(pm.key)}
                          className={paymentMethod === pm.key ? 'btn btn-primary btn-sm' : 'btn btn-secondary btn-sm'}
                        >
                          {pm.icon} {pm.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Note */}
                  <div className="form-group">
                    <label className="form-label">Ghi chú đơn hàng</label>
                    <textarea placeholder="Giao đến cổng, gọi khi sẵn sàng..." value={orderNote} onChange={e => setOrderNote(e.target.value)} rows={2} />
                  </div>
                </div>
                <div className="modal-footer">
                  <button className="btn btn-secondary" onClick={() => setShowCheckout(false)}>Hủy</button>
                  <button className="btn btn-primary" onClick={handlePlaceOrder} disabled={!customerName.trim()}>
                    <FiCheck /> Xác nhận đặt hàng
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default OrderPage;
