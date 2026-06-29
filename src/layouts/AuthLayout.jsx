import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="auth-layout">
      <div className="auth-visual">
        <div
          className="auth-visual-bg"
          style={{
            backgroundImage: 'url("https://images.unsplash.com/photo-1511920170033-f8396924c348?auto=format&fit=crop&q=80&w=1920")',
          }}
        />
        <div className="auth-visual-overlay" />

        <div className="auth-visual-content">
          <div className="auth-badge">THE COFFEE HOUSE</div>
          <h1>Quản lý quán cà phê nhanh chóng</h1>
          <p>Giao diện chuyên nghiệp, tone màu ấm và trải nghiệm đơn giản cho người dùng.</p>
          <p className="auth-visual-note">Đăng nhập hoặc đăng ký để quản lý đơn hàng, nhân viên và báo cáo hàng ngày.</p>
        </div>
      </div>

      <div className="auth-form-section">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
