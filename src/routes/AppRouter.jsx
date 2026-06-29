import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// Layouts
import MainLayout from '../layouts/MainLayout';
import AuthLayout from '../layouts/AuthLayout';
import StorefrontLayout from '../layouts/StorefrontLayout';

// Storefront Pages
import HomePage from '../pages/storefront/HomePage';
import CustomerMenuPage from '../pages/storefront/CustomerMenuPage';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage';

// Staff Pages
import Dashboard from '../pages/dashboard/Dashboard';
import MenuPage from '../pages/menu/MenuPage';
import OrderPage from '../pages/orders/OrderPage';
import OrderManagePage from '../pages/orders/OrderManagePage';
import HistoryPage from '../pages/history/HistoryPage';
import CustomersPage from '../pages/customers/CustomersPage';
import ReportsPage from '../pages/reports/ReportsPage';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (allowedRoles && !allowedRoles.includes(user.role)) return <Navigate to="/admin/dashboard" replace />;
  return children;
};

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Routes>
      {/* Storefront (B2C) */}
      <Route element={<StorefrontLayout />}>
        <Route path="/" element={<HomePage />} />
        <Route path="/menu" element={<CustomerMenuPage />} />
      </Route>

      {/* Auth */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={isAuthenticated ? <Navigate to="/admin/dashboard" /> : <LoginPage />} />
        <Route path="/register" element={isAuthenticated ? <Navigate to="/admin/dashboard" /> : <RegisterPage />} />
      </Route>

      {/* Protected Admin (B2B/Internal) */}
      <Route path="/admin" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/admin/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="menu" element={<MenuPage />} />
        <Route path="order" element={<OrderPage />} />
        <Route path="orders" element={<OrderManagePage />} />
        <Route path="history" element={<HistoryPage />} />
        <Route path="customers" element={<CustomersPage />} />
        <Route path="reports" element={<ReportsPage />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default AppRouter;
