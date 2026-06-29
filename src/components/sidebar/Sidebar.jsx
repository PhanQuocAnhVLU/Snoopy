import { NavLink } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiPieChart, FiCoffee, FiShoppingCart, FiList, FiUsers, FiBarChart2, FiLogOut } from 'react-icons/fi';

const Sidebar = () => {
  const { user, logout } = useAuth();

  const NAV_ITEMS = [
    { path: '/admin/dashboard', icon: FiPieChart, label: 'Tổng quan', roles: ['admin', 'manager'] },
    { path: '/admin/order', icon: FiShoppingCart, label: 'Tạo đơn (POS)', roles: ['admin', 'barista', 'cashier'] },
    { path: '/admin/orders', icon: FiList, label: 'Quản lý đơn', roles: ['admin', 'barista', 'cashier'] },
    { path: '/admin/menu', icon: FiCoffee, label: 'Thực đơn', roles: ['admin'] },
    { path: '/admin/history', icon: FiPieChart, label: 'Lịch sử', roles: ['admin', 'cashier'] },
    { path: '/admin/customers', icon: FiUsers, label: 'Khách hàng', roles: ['admin'] },
    { path: '/admin/reports', icon: FiBarChart2, label: 'Báo cáo', roles: ['admin'] },
  ];

  const allowedNav = NAV_ITEMS.filter(item => item.roles.includes(user?.role));

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>COFFEE TAKE AWAY</h2>
        <span className="badge badge-gold" style={{ marginTop: '4px' }}>ADMIN PANEL</span>
      </div>

      <nav className="sidebar-nav">
        {allowedNav.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}
          >
            <item.icon className="nav-icon" />
            <span className="nav-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile">
          <div className="avatar">
            {user?.name.charAt(0)}
          </div>
          <div className="user-info">
            <div className="user-name">{user?.name}</div>
            <div className="user-role">{user?.role}</div>
          </div>
        </div>
        <button className="btn-logout" onClick={logout} title="Đăng xuất">
          <FiLogOut size={20} />
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
