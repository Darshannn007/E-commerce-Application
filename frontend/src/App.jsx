import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';
import Login from './components/Login';
import Signup from './components/Signup';
import Dashboard from './components/Dashboard';
import AdminPanel from './components/AdminPanel';
import ReviewManagement from './components/ReviewManagement';
import UserManagement from './components/UserManagement';
import ProductDetails from './components/ProductDetails';
import ShoppingCart from './components/ShoppingCart';
import PaymentGateway from './components/PaymentGateway';

function App() {
  const [currentView, setCurrentView] = useState('login'); 
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [paymentData, setPaymentData] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const handleRoute = () => {
      const path = window.location.pathname;
      if (isLoggedIn) {
        if (path === '/admin') {
          setCurrentView('admin');
        } else if (path === '/reviews') {
          setCurrentView('reviews');
        } else if (path === '/users') {
          setCurrentView('users');
        } else if (path.startsWith('/product/')) {
          const productId = path.split('/')[2];
          setSelectedProductId(parseInt(productId));
          setCurrentView('product');
        } else if (path === '/cart') {
          setCurrentView('cart');
        } else if (path === '/payment') {
          setCurrentView('payment');
        } else {
          setCurrentView('dashboard');
        }
      }
    };

    handleRoute();
    window.addEventListener('popstate', handleRoute);
    return () => window.removeEventListener('popstate', handleRoute);
  }, [isLoggedIn]);

  const handleLogin = (userData) => {
    setUser(userData);
    setIsLoggedIn(true);
    setCurrentView('dashboard');
    window.history.pushState({}, '', '/dashboard');
    console.log('User logged in:', userData);
  };

  const handleLogout = () => {
    setUser(null);
    setIsLoggedIn(false);
    setCurrentView('login');
    window.history.pushState({}, '', '/');
  };

  const handleSwitchToSignup = () => {
    setCurrentView('signup');
  };

  const handleSwitchToLogin = () => {
    setCurrentView('login');
  };

  const navigateToAdmin = () => {
    setCurrentView('admin');
    window.history.pushState({}, '', '/admin');
  };

  const navigateToDashboard = () => {
    setCurrentView('dashboard');
    window.history.pushState({}, '', '/dashboard');
  };

  const navigateToReviews = () => {
    setCurrentView('reviews');
    window.history.pushState({}, '', '/reviews');
  };

  const navigateToUsers = () => {
    setCurrentView('users');
    window.history.pushState({}, '', '/users');
  };

  const navigateToProduct = (productId) => {
    setSelectedProductId(productId);
    setCurrentView('product');
    window.history.pushState({}, '', `/product/${productId}`);
  };

  const navigateToCart = () => {
    setCurrentView('cart');
    window.history.pushState({}, '', '/cart');
  };

  const navigateToPayment = (cartItems, totalAmount) => {
    setPaymentData({ cartItems, totalAmount });
    setCurrentView('payment');
    window.history.pushState({}, '', '/payment');
  };

  const handlePaymentSuccess = (orderData) => {
    localStorage.removeItem('flipkart_cart');
    setCurrentView('dashboard');
    window.history.pushState({}, '', '/dashboard');
    setPaymentData(null);
  };

  const handlePaymentCancel = () => {
    setCurrentView('cart');
    window.history.pushState({}, '', '/cart');
    setPaymentData(null);
  };

  if (isLoggedIn) {
    if (currentView === 'admin') {
      return <AdminPanel user={user} onLogout={handleLogout} onNavigateToDashboard={navigateToDashboard} onNavigateToReviews={navigateToReviews} onNavigateToUsers={navigateToUsers} />;
    } else if (currentView === 'reviews') {
      return <ReviewManagement user={user} onLogout={handleLogout} onNavigateToDashboard={navigateToDashboard} onNavigateToAdmin={navigateToAdmin} onNavigateToUsers={navigateToUsers} />;
    } else if (currentView === 'users') {
      return <UserManagement user={user} onLogout={handleLogout} onNavigateToDashboard={navigateToDashboard} onNavigateToAdmin={navigateToAdmin} onNavigateToReviews={navigateToReviews} />;
    } else if (currentView === 'product') {
      return <ProductDetails productId={selectedProductId} user={user} onLogout={handleLogout} onNavigateToDashboard={navigateToDashboard} onNavigateToAdmin={navigateToAdmin} onNavigateToReviews={navigateToReviews} onNavigateToUsers={navigateToUsers} />;
    } else if (currentView === 'cart') {
      return <ShoppingCart user={user} onLogout={handleLogout} onNavigateToDashboard={navigateToDashboard} onNavigateToAdmin={navigateToAdmin} onNavigateToReviews={navigateToReviews} onNavigateToUsers={navigateToUsers} onNavigateToPayment={navigateToPayment} />;
    } else if (currentView === 'payment') {
      return <PaymentGateway cartItems={paymentData?.cartItems || []} totalAmount={paymentData?.totalAmount || 0} user={user} onPaymentSuccess={handlePaymentSuccess} onPaymentCancel={handlePaymentCancel} onLogout={handleLogout} onNavigateToDashboard={navigateToDashboard} onNavigateToAdmin={navigateToAdmin} onNavigateToReviews={navigateToReviews} onNavigateToUsers={navigateToUsers} />;
    } else {
      return <Dashboard user={user} onLogout={handleLogout} onNavigateToAdmin={navigateToAdmin} onNavigateToReviews={navigateToReviews} onNavigateToUsers={navigateToUsers} onNavigateToProduct={navigateToProduct} onNavigateToCart={navigateToCart} />;
    }
  }

  return (
    <div className="App" style={{ height: '100vh', backgroundColor: '#f8f9fa' }}>
      {currentView === 'login' ? (
        <Login 
          onLogin={handleLogin} 
          onSwitchToSignup={handleSwitchToSignup} 
        />
      ) : (
        <Signup 
          onSignup={() => {}} 
          onSwitchToLogin={handleSwitchToLogin} 
        />
      )}
    </div>
  );
}

export default App;
