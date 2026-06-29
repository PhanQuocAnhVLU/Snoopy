import { useLocation } from 'react-router-dom';
import { useApp } from '../../contexts/AppContext';
import { useAuth } from '../../contexts/AuthContext';
import { FiBell, FiShoppingCart, FiSun } from 'react-icons/fi';

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', subtitle: 'Tổng quan hoạt động hôm nay' },
  '/order':     { title: 'Tạo đơn mới', subtitle: 'Chọn món và xác nhận đơn hàng' },
  '/orders':    { title: 'Quản lý đơn', subtitle: 'Theo dõi và xử lý đơn hàng' },
  '/menu':      { title: 'Thực đơn', subtitle: 'Quản lý danh mục sản phẩm' },
  '/history':   { title: 'Lịch sử đơn', subtitle: 'Xem lại các giao dịch đã thực hiện' },
  '/customers': { title: 'Khách hàng', subtitle: 'Quản lý thông tin thành viên' },
  '/reports':   { title: 'Báo cáo', subtitle: 'Phân tích doanh thu và hiệu suất' },
};

const Navbar = () => {
  const location = useLocation();
  const { cartCount } = useApp();
  const { user } = useAuth();
  const pageInfo = PAGE_TITLES[location.pathname] || { title: 'Snoopy', subtitle: '' };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Chào buổi sáng' : hour < 18 ? 'Chào buổi chiều' : 'Chào buổi tối';

  return (
    <header className="navbar">
      <div className="navbar-left">
        <div>
          <div className="navbar-title">{pageInfo.title}</div>
          <div className="navbar-subtitle">{pageInfo.subtitle}</div>
        </div>
      </div>

      <div className="navbar-right">
        {/* Greeting */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '6px 14px',
          background: 'var(--bg-glass)',
          border: '1px solid var(--border-subtle)',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.8rem',
          color: 'var(--text-secondary)',
        }}>
          <FiSun size={13} style={{ color: 'var(--brand-caramel)' }} />
          {greeting}, {user?.name?.split(' ').pop()}!
        </div>

        {/* Cart badge */}
        <button className="navbar-btn" title="Giỏ hàng">
          <FiShoppingCart />
          {cartCount > 0 && <span className="dot" />}
        </button>

        {/* Notifications */}
        <button className="navbar-btn" title="Thông báo">
          <FiBell />
          <span className="dot" />
        </button>
      </div>
    </header>
  );
};

export default Navbar;
