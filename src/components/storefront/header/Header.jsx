import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../../../contexts/AppContext';
import {
  FiShoppingBag, FiUser, FiX, FiMinus, FiPlus,
  FiTrash2, FiShoppingCart, FiArrowLeft, FiCheckCircle,
  FiMapPin, FiClock, FiPhone
} from 'react-icons/fi';
import snoopyImg from '../../../assets/snoopy.png';
import './Header.css';

/* ─────────────────────────────────────────────────── */
/*  BƯỚC XÁC NHẬN THANH TOÁN                          */
/* ─────────────────────────────────────────────────── */
const CheckoutStep = ({ onBack, onConfirm, cartTotal, cart }) => {
  const [name, setName]       = useState('');
  const [phone, setPhone]     = useState('');
  const [note, setNote]       = useState('');
  const [method, setMethod]   = useState('cash');
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]   = useState({});

  const formatPrice = (p) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  const validate = () => {
    const e = {};
    if (!name.trim()) e.name = 'Vui lòng nhập tên';
    if (!phone.trim()) e.phone = 'Vui lòng nhập số điện thoại';
    else if (!/^(0|\+84)[0-9]{8,10}$/.test(phone.trim())) e.phone = 'Số điện thoại không hợp lệ';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitted(true);
    setTimeout(() => onConfirm({ name, phone, note, method }), 1800);
  };

  if (submitted) {
    return (
      <div className="checkout-success">
        <div className="checkout-success-icon">
          <FiCheckCircle size={56} />
        </div>
        <h3>Đặt hàng thành công!</h3>
        <p>Cảm ơn <strong>{name}</strong>!<br />Chúng tôi sẽ liên hệ xác nhận qua <strong>{phone}</strong></p>
        <div className="success-order-summary">
          {cart.map(i => (
            <div key={i.cartKey} className="success-item">
              <span>{i.name} ×{i.quantity}</span>
              <span>{formatPrice(i.unitPrice * i.quantity)}</span>
            </div>
          ))}
          <div className="success-total">
            <span>Tổng</span>
            <span>{formatPrice(cartTotal)}</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-form">
      {/* Header */}
      <div className="checkout-form-header">
        <button className="back-btn" onClick={onBack}>
          <FiArrowLeft size={16} /> Giỏ hàng
        </button>
        <span>Xác Nhận Đơn Hàng</span>
      </div>

      {/* Order Summary mini */}
      <div className="checkout-summary">
        <div className="checkout-summary-title">📋 Đơn của bạn</div>
        {cart.map(i => (
          <div key={i.cartKey} className="checkout-summary-item">
            <span className="csitem-name">{i.name} <span className="csitem-size">({i.size})</span></span>
            <span className="csitem-qty">×{i.quantity}</span>
            <span className="csitem-price">{formatPrice(i.unitPrice * i.quantity)}</span>
          </div>
        ))}
        <div className="checkout-summary-total">
          <span>Tổng cộng</span>
          <span>{formatPrice(cartTotal)}</span>
        </div>
      </div>

      {/* Form fields */}
      <div className="checkout-fields">
        <div className="checkout-field-group">
          <label>Họ & Tên <span className="required">*</span></label>
          <input
            className={`checkout-input ${errors.name ? 'input-error' : ''}`}
            placeholder="Nguyễn Văn A"
            value={name}
            onChange={e => { setName(e.target.value); setErrors(prev => ({ ...prev, name: '' })); }}
          />
          {errors.name && <span className="field-error">{errors.name}</span>}
        </div>

        <div className="checkout-field-group">
          <label>Số điện thoại <span className="required">*</span></label>
          <div className="checkout-input-icon">
            <FiPhone size={14} className="input-prefix-icon" />
            <input
              className={`checkout-input with-icon ${errors.phone ? 'input-error' : ''}`}
              placeholder="0901 234 567"
              value={phone}
              onChange={e => { setPhone(e.target.value); setErrors(prev => ({ ...prev, phone: '' })); }}
            />
          </div>
          {errors.phone && <span className="field-error">{errors.phone}</span>}
        </div>

        {/* Store info */}
        <div className="checkout-store-info">
          <div className="store-info-row"><FiMapPin size={13} /> Nhận tại quầy — Snoopy Coffee</div>
          <div className="store-info-row"><FiClock size={13} /> Chuẩn bị trong 5–10 phút</div>
        </div>

        {/* Payment method */}
        <div className="checkout-field-group">
          <label>Phương thức thanh toán</label>
          <div className="payment-methods">
            {[
              { id: 'cash', icon: '💵', label: 'Tiền mặt' },
              { id: 'card', icon: '💳', label: 'Thẻ / QR' },
              { id: 'momo', icon: '🟣', label: 'Momo' },
            ].map(m => (
              <button
                key={m.id}
                className={`payment-btn ${method === m.id ? 'active' : ''}`}
                onClick={() => setMethod(m.id)}
              >
                <span>{m.icon}</span>
                <span>{m.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="checkout-field-group">
          <label>Ghi chú (tuỳ chọn)</label>
          <textarea
            className="checkout-input checkout-textarea"
            placeholder="Ít đá, ít đường, dị ứng gì đó..."
            value={note}
            onChange={e => setNote(e.target.value)}
            rows={2}
          />
        </div>
      </div>

      {/* Confirm button */}
      <div className="checkout-confirm-footer">
        <button className="confirm-order-btn" onClick={handleSubmit}>
          <FiCheckCircle size={18} />
          Xác Nhận Đặt Hàng — {formatPrice(cartTotal)}
        </button>
      </div>
    </div>
  );
};

/* ─────────────────────────────────────────────────── */
/*  CART DRAWER                                        */
/* ─────────────────────────────────────────────────── */
const CartDrawer = ({ isOpen, onClose }) => {
  const { cart, cartTotal, updateCartQuantity, removeFromCart, clearCart, placeOrder, showNotification } = useApp();
  const navigate = useNavigate();
  const [step, setStep] = useState('cart'); // 'cart' | 'checkout'

  const formatPrice = (p) =>
    new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(p);

  const handleConfirmOrder = ({ name, phone, note, method }) => {
    placeOrder({
      customerName: name,
      phone,
      note,
      paymentMethod: method,
      items: cart.map(i => ({
        productId: i.productId,
        name: i.name,
        size: i.size,
        quantity: i.quantity,
        unitPrice: i.unitPrice,
      })),
      total: cartTotal,
    });
    setTimeout(() => {
      setStep('cart');
      onClose();
      showNotification('🎉 Đặt hàng thành công! Chúng tôi sẽ chuẩn bị ngay!', 'success');
    }, 2200);
  };

  const handleClose = () => {
    setStep('cart');
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      <div className={`cart-backdrop ${isOpen ? 'open' : ''}`} onClick={handleClose} />

      {/* Drawer */}
      <div className={`cart-drawer ${isOpen ? 'open' : ''}`}>

        {/* ─── STEP: CART ─────────────────────────── */}
        {step === 'cart' && (
          <>
            <div className="cart-drawer-header">
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <FiShoppingCart size={20} style={{ color: 'var(--primary)' }} />
                <span>Giỏ Hàng</span>
                {cart.length > 0 && (
                  <span className="cart-count-badge">{cart.reduce((s, i) => s + i.quantity, 0)}</span>
                )}
              </div>
              <button className="cart-close-btn" onClick={handleClose}>
                <FiX size={20} />
              </button>
            </div>

            <div className="cart-drawer-body">
              {cart.length === 0 ? (
                <div className="cart-empty">
                  <div className="cart-empty-icon">☕</div>
                  <p>Giỏ hàng của bạn đang trống</p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 6 }}>
                    Thêm đồ uống để bắt đầu!
                  </p>
                  <button
                    style={{ marginTop: 20, padding: '10px 24px', borderRadius: 'var(--radius-full)', background: 'var(--primary)', color: 'white', border: 'none', fontWeight: 700, cursor: 'pointer' }}
                    onClick={() => { handleClose(); navigate('/menu'); }}
                  >
                    Xem Thực Đơn
                  </button>
                </div>
              ) : (
                <>
                  <div className="cart-items">
                    {cart.map(item => (
                      <div key={item.cartKey} className="cart-item">
                        {item.image && (
                          <img src={item.image} alt={item.name} className="cart-item-img" />
                        )}
                        <div className="cart-item-info">
                          <div className="cart-item-name">{item.name}</div>
                          <div className="cart-item-size">Size: {item.size}</div>
                          <div className="cart-item-price">{formatPrice(item.unitPrice)}</div>
                        </div>
                        <div className="cart-item-actions">
                          <div className="qty-control">
                            <button onClick={() => updateCartQuantity(item.cartKey, item.quantity - 1)}>
                              <FiMinus size={12} />
                            </button>
                            <span>{item.quantity}</span>
                            <button onClick={() => updateCartQuantity(item.cartKey, item.quantity + 1)}>
                              <FiPlus size={12} />
                            </button>
                          </div>
                          <button className="remove-btn" onClick={() => removeFromCart(item.cartKey)}>
                            <FiTrash2 size={14} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="cart-drawer-footer">
                    <div className="cart-total">
                      <span>Tổng cộng</span>
                      <span className="cart-total-price">{formatPrice(cartTotal)}</span>
                    </div>
                    <button
                      className="checkout-btn"
                      onClick={() => setStep('checkout')}
                    >
                      <FiShoppingBag size={16} />
                      Thanh Toán
                    </button>
                    <button className="clear-cart-btn" onClick={clearCart}>
                      Xóa giỏ hàng
                    </button>
                  </div>
                </>
              )}
            </div>
          </>
        )}

        {/* ─── STEP: CHECKOUT ─────────────────────── */}
        {step === 'checkout' && (
          <CheckoutStep
            onBack={() => setStep('cart')}
            onConfirm={handleConfirmOrder}
            cartTotal={cartTotal}
            cart={cart}
          />
        )}
      </div>
    </>
  );
};

/* ─────────────────────────────────────────────────── */
/*  HEADER                                             */
/* ─────────────────────────────────────────────────── */
const Header = () => {
  const { cart } = useApp();
  const [cartOpen, setCartOpen] = useState(false);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <>
      <header className="tch-header">
        <div className="container header-container">
          {/* Logo */}
          <Link to="/" className="header-logo">
            <img src={snoopyImg} alt="Snoopy" className="logo-img" />
            <span className="logo-text">Snoopy <span className="logo-accent">Coffee</span></span>
          </Link>

          {/* Navigation */}
          <nav className="header-nav">
            <Link to="/menu" className="nav-link">Cà phê</Link>
            <Link to="/menu" className="nav-link">Trà</Link>
            <Link to="/menu" className="nav-link">Menu</Link>
            <Link to="/" className="nav-link">Cửa hàng</Link>
          </nav>

          {/* Actions */}
          <div className="header-actions">
            <button
              className="action-btn cart-btn"
              onClick={() => setCartOpen(true)}
              title="Giỏ hàng"
            >
              <FiShoppingBag size={20} />
              {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
            </button>
            <Link to="/login" className="action-btn user-btn" title="Tài khoản">
              <FiUser size={20} />
            </Link>
          </div>
        </div>
      </header>

      {/* Cart Drawer */}
      <CartDrawer isOpen={cartOpen} onClose={() => setCartOpen(false)} />
    </>
  );
};

export default Header;
