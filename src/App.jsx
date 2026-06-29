import './styles/variables.css';
import './styles/global.css';
import './styles/components.css';
import './styles/layout.css';

import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { AppProvider } from './contexts/AppContext';
import AppRouter from './routes/AppRouter';
import Toast from './components/common/Toast';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppProvider>
          <AppRouter />
          <Toast />
        </AppProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
