import { createContext, useContext, useState, useEffect } from 'react';
import menuData from '../data/menu.json';
import ordersData from '../data/orders.json';

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const [menu, setMenu] = useState([]);
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  useEffect(() => {
    // Changed keys to tch_* to force clear old breva_* local storage
    const initData = (key, defaultData) => {
      try {
        const stored = localStorage.getItem(key);
        if (stored) return JSON.parse(stored);
        localStorage.setItem(key, JSON.stringify(defaultData));
        return defaultData;
      } catch (e) {
        return defaultData;
      }
    };

    setMenu(initData('tch_menu_v2', menuData));
    setOrders(initData('tch_orders', ordersData));

    const savedCart = localStorage.getItem('tch_cart');
    if (savedCart) {
      try { setCart(JSON.parse(savedCart)); } catch (e) {}
    }

    setLoading(false);
  }, []);

  // ── Cart Operations ──────────────────────────────────────
  const addToCart = (product, size, quantity = 1, note = '') => {
    const sizeInfo = product.sizes.find(s => s.label === size) || { extraPrice: 0 };
    const finalPrice = product.price + (sizeInfo.extraPrice || 0);
    const cartKey = `${product.id}-${size}`;

    setCart(prev => {
      const exists = prev.find(i => i.cartKey === cartKey);
      let updated;
      if (exists) {
        updated = prev.map(i =>
          i.cartKey === cartKey ? { ...i, quantity: i.quantity + quantity } : i
        );
      } else {
        updated = [...prev, {
          cartKey,
          productId: product.id,
          name: product.name,
          size,
          quantity,
          unitPrice: finalPrice,
          note,
          image: product.image,
        }];
      }
      localStorage.setItem('tch_cart', JSON.stringify(updated));
      return updated;
    });

    showNotification(`✓ Đã thêm ${product.name} vào giỏ hàng`, 'success');
  };

  const removeFromCart = (cartKey) => {
    setCart(prev => {
      const updated = prev.filter(i => i.cartKey !== cartKey);
      localStorage.setItem('tch_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const updateCartQuantity = (cartKey, quantity) => {
    if (quantity <= 0) { removeFromCart(cartKey); return; }
    setCart(prev => {
      const updated = prev.map(i => i.cartKey === cartKey ? { ...i, quantity } : i);
      localStorage.setItem('tch_cart', JSON.stringify(updated));
      return updated;
    });
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('tch_cart');
  };

  const cartTotal = cart.reduce((sum, i) => sum + i.unitPrice * i.quantity, 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  // ── Orders Operations ────────────────────────────────────
  const placeOrder = (orderData) => {
    const newOrder = {
      id: `ORD${Date.now()}`,
      orderNumber: `TCH-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${String(orders.length + 1).padStart(3, '0')}`,
      ...orderData,
      status: 'pending',
      createdAt: new Date().toISOString(),
      completedAt: null,
    };
    const updated = [newOrder, ...orders];
    setOrders(updated);
    localStorage.setItem('tch_orders', JSON.stringify(updated));
    clearCart();
    return newOrder;
  };

  const updateOrderStatus = (id, status) => {
    const updated = orders.map(o => o.id === id ? {
      ...o,
      status,
      completedAt: status === 'completed' ? new Date().toISOString() : o.completedAt
    } : o);
    setOrders(updated);
    localStorage.setItem('tch_orders', JSON.stringify(updated));
  };

  // ── Menu Operations ──────────────────────────────────────
  const updateMenuItem = (item) => {
    const updated = menu.map(m => m.id === item.id ? item : m);
    setMenu(updated);
    localStorage.setItem('tch_menu_v2', JSON.stringify(updated));
  };

  const addMenuItem = (item) => {
    const updated = [...menu, item];
    setMenu(updated);
    localStorage.setItem('tch_menu_v2', JSON.stringify(updated));
  };

  const deleteMenuItem = (id) => {
    const updated = menu.filter(m => m.id !== id);
    setMenu(updated);
    localStorage.setItem('tch_menu_v2', JSON.stringify(updated));
  };

  // ── Notification ─────────────────────────────────────────
  const showNotification = (message, type = 'info') => {
    setNotification({ message, type, id: Date.now() });
    setTimeout(() => setNotification(null), 3000);
  };

  const value = {
    menu, updateMenuItem, addMenuItem, deleteMenuItem,
    orders, placeOrder, updateOrderStatus,
    cart, addToCart, removeFromCart, updateCartQuantity, clearCart,
    cartTotal, cartCount,
    loading,
    notification, showNotification,
  };

  return (
    <AppContext.Provider value={value}>
      {!loading && children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
};

export default AppContext;
