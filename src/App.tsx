import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { CounterProvider } from './context/CounterContext';
import { AppRoutes } from './routes/AppRoutes';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <CounterProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </CounterProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
