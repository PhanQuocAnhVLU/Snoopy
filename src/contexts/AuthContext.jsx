import { createContext, useContext, useState, useEffect } from 'react';
import { auth, googleProvider } from '../firebase';
import { signInWithPopup } from 'firebase/auth';

const AuthContext = createContext(null);

const STAFF_ACCOUNTS = [
  {
    id: 'STAFF001',
    name: 'Quản Trị Viên',
    email: 'admin@breva.vn',
    password: 'admin123',
    role: 'admin',
    avatar: 'https://i.pravatar.cc/150?img=11',
    phone: '0900000001',
  },
  {
    id: 'STAFF002',
    name: 'Nguyễn Thu Hà',
    email: 'barista@breva.vn',
    password: 'breva123',
    role: 'barista',
    avatar: 'https://i.pravatar.cc/150?img=25',
    phone: '0900000002',
  },
  {
    id: 'STAFF003',
    name: 'Trần Minh Quân',
    email: 'cashier@breva.vn',
    password: 'breva123',
    role: 'cashier',
    avatar: 'https://i.pravatar.cc/150?img=32',
    phone: '0900000003',
  },
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('breva_current_user');
      if (saved) setUser(JSON.parse(saved));
    } catch (e) {
      localStorage.removeItem('breva_current_user');
    } finally {
      setLoading(false);
    }
  }, []);

  const login = (email, password) => {
    const trimmedEmail = email.trim().toLowerCase();
    let allUsers = [...STAFF_ACCOUNTS];

    // also check localStorage customers
    try {
      const lsCustomers = JSON.parse(localStorage.getItem('breva_customers') || '[]');
      allUsers = [...allUsers, ...lsCustomers];
    } catch (e) {}

    const found = allUsers.find(
      u => u.email.trim().toLowerCase() === trimmedEmail && u.password === password
    );

    if (found) {
      const userData = {
        id: found.id,
        name: found.name,
        email: found.email,
        role: found.role,
        avatar: found.avatar,
        phone: found.phone,
        points: found.points || 0,
        tier: found.tier || null,
      };
      setUser(userData);
      localStorage.setItem('breva_current_user', JSON.stringify(userData));
      return { success: true, user: userData };
    }

    return { success: false, error: 'Email hoặc mật khẩu không đúng' };
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('breva_current_user');
  };

  const register = (formData) => {
    let lsCustomers = [];
    try {
      lsCustomers = JSON.parse(localStorage.getItem('breva_customers') || '[]');
    } catch (e) {}

    const allExisting = [...STAFF_ACCOUNTS, ...lsCustomers];
    const emailToRegister = formData.email.trim().toLowerCase();

    if (allExisting.some(u => u.email.trim().toLowerCase() === emailToRegister)) {
      return { success: false, error: 'Email đã được sử dụng' };
    }

    const newCustomer = {
      id: `MEM${Date.now()}`,
      name: formData.name,
      email: emailToRegister,
      phone: formData.phone || '',
      password: formData.password,
      role: 'customer',
      avatar: `https://i.pravatar.cc/150?img=${Math.floor(Math.random() * 70) + 1}`,
      points: 0,
      tier: 'Member',
      totalOrders: 0,
      totalSpent: 0,
      joinDate: new Date().toISOString().split('T')[0],
    };

    lsCustomers.push(newCustomer);
    localStorage.setItem('breva_customers', JSON.stringify(lsCustomers));

    const userData = {
      id: newCustomer.id,
      name: newCustomer.name,
      email: newCustomer.email,
      role: 'customer',
      avatar: newCustomer.avatar,
      phone: newCustomer.phone,
      points: 0,
      tier: 'Member',
    };
    setUser(userData);
    localStorage.setItem('breva_current_user', JSON.stringify(userData));
    return { success: true, user: userData };
  };

  const updateProfile = (updates) => {
    const updatedUser = { ...user, ...updates };
    setUser(updatedUser);
    localStorage.setItem('breva_current_user', JSON.stringify(updatedUser));
  };

  const hasRole = (roles) => {
    if (!user) return false;
    if (Array.isArray(roles)) return roles.includes(user.role);
    return user.role === roles;
  };

  const loginWithGoogle = async () => {
    try {
      let fbUser;
      
      // Fallback: If Firebase is not configured (e.g. on Vercel without env vars), use a mock user
      if (!auth || !googleProvider) {
        console.warn("Firebase not configured. Using mock Google login.");
        fbUser = {
          email: 'user@gmail.com',
          displayName: 'Người Dùng Google (Mock)',
          photoURL: 'https://i.pravatar.cc/150?img=50',
          phoneNumber: ''
        };
      } else {
        const result = await signInWithPopup(auth, googleProvider);
        fbUser = result.user;
      }

      let lsCustomers = [];
      try {
        lsCustomers = JSON.parse(localStorage.getItem('breva_customers') || '[]');
      } catch (e) {}

      let userFromGoogle = [...STAFF_ACCOUNTS, ...lsCustomers].find(u => u.email === fbUser.email);

      if (!userFromGoogle) {
        userFromGoogle = {
          id: `MEM${Date.now()}`,
          name: fbUser.displayName || 'Người Dùng Google',
          email: fbUser.email,
          phone: fbUser.phoneNumber || '',
          password: 'google_oauth',
          role: 'customer',
          avatar: fbUser.photoURL || 'https://i.pravatar.cc/150?img=50',
          points: 0,
          tier: 'Member',
          totalOrders: 0,
          totalSpent: 0,
          joinDate: new Date().toISOString().split('T')[0],
        };
        lsCustomers.push(userFromGoogle);
        localStorage.setItem('breva_customers', JSON.stringify(lsCustomers));
      }

      const userData = {
        id: userFromGoogle.id,
        name: userFromGoogle.name,
        email: userFromGoogle.email,
        role: userFromGoogle.role,
        avatar: userFromGoogle.avatar,
        phone: userFromGoogle.phone,
        points: userFromGoogle.points || 0,
        tier: userFromGoogle.tier || 'Member',
      };
      
      setUser(userData);
      localStorage.setItem('breva_current_user', JSON.stringify(userData));
      return { success: true, user: userData };
    } catch (error) {
      console.error('Lỗi đăng nhập Firebase:', error);
      return { success: false, error: `Lỗi: ${error.message || 'Đăng nhập bị hủy'}` };
    }
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated: !!user, loading, login, loginWithGoogle, logout, register, updateProfile, hasRole }}
    >
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
