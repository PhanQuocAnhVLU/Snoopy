import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiMail, FiLock, FiLogIn } from 'react-icons/fi';

import { FcGoogle } from 'react-icons/fc';

const LoginPage = () => {
  const { login, loginWithGoogle } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    const result = login(email, password);
    if (!result.success) {
      setError(result.error || 'Email hoặc mật khẩu không chính xác');
    }
  };

  const handleGoogleLogin = async () => {
    const result = await loginWithGoogle();
    if (!result.success) {
      setError(result.error);
    }
  };

  return (
    <div className="auth-card animate-fade-in">
      <div className="auth-card-header">
        <div className="auth-card-brand">COFFEE TAKE AWAY</div>
        <h2>Đăng nhập</h2>
        <p>Quản lý đơn hàng và nhân sự ngay trên một giao diện chuyên nghiệp.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label>Email</label>
          <div className="input-with-icon">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="admin@breva.vn"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Mật khẩu</label>
          <div className="input-with-icon">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block auth-submit">
          <FiLogIn /> Đăng nhập
        </button>

        <div className="auth-divider">
          <span>hoặc</span>
        </div>

        <button type="button" className="btn btn-google btn-block" onClick={handleGoogleLogin}>
          <FcGoogle size={20} /> Đăng nhập bằng Gmail
        </button>
      </form>

      <div className="form-footer">
        <p>Bạn chưa có tài khoản? <Link to="/register">Đăng ký</Link></p>
      </div>
    </div>
  );
};

export default LoginPage;
