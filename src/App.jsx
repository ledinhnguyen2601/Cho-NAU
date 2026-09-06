// File: src/App.jsx
import React from 'react';
import { BrowserRouter } from 'react-router-dom';

// Providers
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider } from './context/ToastContext';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';

// Components
import { ErrorBoundary } from './components/common/ErrorBoundary';

// Routes
import { AppRoutes } from './routes/AppRoutes';

export function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <CartProvider>
            <ErrorBoundary>
              <AppRoutes />
            </ErrorBoundary>
          </CartProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

export default App;
