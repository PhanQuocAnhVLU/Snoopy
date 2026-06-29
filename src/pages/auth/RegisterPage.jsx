import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FiUser, FiMail, FiLock, FiArrowLeftCircle } from 'react-icons/fi';

import { FcGoogle } from 'react-icons/fc';

const RegisterPage = () => {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!name || !email || !password || !confirmPassword) {
      setError('Vui lòng điền đầy đủ thông tin');
      return;
    }

    if (password !== confirmPassword) {
      setError('Mật khẩu không khớp');
      return;
    }

    const result = register({ name, email, password });
    if (!result.success) {
      setError(result.error || 'Đăng ký thất bại');
      return;
    }

    navigate('/admin/dashboard');
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
        <h2>Đăng ký</h2>
        <p>Tạo tài khoản để bắt đầu quản lý cửa hàng của bạn.</p>
      </div>

      <form onSubmit={handleSubmit} className="auth-form">
        {error && <div className="alert alert-error">{error}</div>}

        <div className="form-group">
          <label>Họ và tên</label>
          <div className="input-with-icon">
            <FiUser className="input-icon" />
            <input
              type="text"
              placeholder="Nguyễn Văn A"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
        </div>

        <div className="form-group">
          <label>Email</label>
          <div className="input-with-icon">
            <FiMail className="input-icon" />
            <input
              type="email"
              placeholder="you@example.com"
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

        <div className="form-group">
          <label>Xác nhận mật khẩu</label>
          <div className="input-with-icon">
            <FiLock className="input-icon" />
            <input
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </div>

        <button type="submit" className="btn btn-primary btn-block auth-submit">
          <FiArrowLeftCircle /> Đăng ký
        </button>

        <div className="auth-divider">
          <span>hoặc</span>
        </div>

        <button type="button" className="btn btn-google btn-block" onClick={handleGoogleLogin}>
          <FcGoogle size={20} /> Đăng ký bằng Gmail
        </button>
      </form>

      <div className="form-footer">
        <p>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
