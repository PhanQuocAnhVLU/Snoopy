import { Outlet } from 'react-router-dom';
import Header from '../components/storefront/header/Header';

const StorefrontLayout = () => {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Header />
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
      
      {/* Simple Footer for now */}
      <footer style={{ background: '#1a1a1a', color: '#fff', padding: '40px 0', marginTop: '60px' }}>
        <div className="container grid grid-cols-2">
          <div>
            <h3 style={{ color: '#fff', marginBottom: '20px' }}>COFFEE TAKE AWAY</h3>
            <p style={{ color: '#aaa', fontSize: '14px', marginBottom: '10px' }}>Hotline: 0988 23 24 25</p>
            <p style={{ color: '#aaa', fontSize: '14px' }}>Địa chỉ: 17 Đường Số 1D, TP HCM</p>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: '#aaa', fontSize: '14px' }}>© 2026 Coffee Take Away. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default StorefrontLayout;
