import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Alert, Badge, Modal } from 'react-bootstrap';
import axios from 'axios';

const ShoppingCart = ({ user, onLogout,onNavigateToDashboard,onNavigateToAdmin,onNavigateToReviews,onNavigateToUsers,onNavigateToPayment}) => {
  const [cartItems, setCartItems] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [itemToRemove, setItemToRemove] = useState(null);

  useEffect(() => {
    fetchProducts();
    loadCartFromStorage();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/product');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
    }
  };

  const loadCartFromStorage = () => {
    const savedCart = localStorage.getItem('flipkart_cart');
    if (savedCart) {
      setCartItems(JSON.parse(savedCart));
    }
  };

  const saveCartToStorage = (cart) => {
    localStorage.setItem('flipkart_cart', JSON.stringify(cart));
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    let updatedCart;
    
    if (existingItem) {
      updatedCart = cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
    } else {
      updatedCart = [...cartItems, { ...product, quantity: 1 }];
    }
    
    setCartItems(updatedCart);
    saveCartToStorage(updatedCart);
  };

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    setCartItems(updatedCart);
    saveCartToStorage(updatedCart);
    setShowRemoveModal(false);
    setItemToRemove(null);
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      setItemToRemove(productId);
      setShowRemoveModal(true);
      return;
    }
    
    const updatedCart = cartItems.map(item =>
      item.id === productId
        ? { ...item, quantity: newQuantity }
        : item
    );
    
    setCartItems(updatedCart);
    saveCartToStorage(updatedCart);
  };

  const getTotalAmount = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const handleProceedToPayment = () => {
    if (cartItems.length === 0) {
      setError('Your cart is empty. Add some items to proceed.');
      return;
    }
    onNavigateToPayment(cartItems, getTotalAmount());
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            🛒 Flipkart Shopping Cart
          </a>
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">
              Welcome, {user?.firstname} {user?.lastname}!
            </span>
            <Badge bg="light" text="dark" className="me-3">
              {getTotalItems()} items
            </Badge>
            <button 
              className="btn btn-outline-light btn-sm me-2"
              onClick={onNavigateToDashboard}
            >
              Dashboard
            </button>
            <button 
              className="btn btn-outline-light btn-sm me-2"
              onClick={onNavigateToAdmin}
            >
              Admin Panel
            </button>
            <button 
              className="btn btn-outline-light btn-sm me-2"
              onClick={onNavigateToReviews}
            >
              Reviews
            </button>
            <button 
              className="btn btn-outline-light btn-sm me-2"
              onClick={onNavigateToUsers}
            >
              Users
            </button>
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={onLogout}
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      <Container className="mt-4">
        {/* Header */}
        <Row className="mb-4">
          <Col>
            <div className="d-flex justify-content-between align-items-center">
              <h2>Shopping Cart ({getTotalItems()} items)</h2>
              {cartItems.length > 0 && (
                <Button 
                  variant="success" 
                  size="lg"
                  onClick={handleProceedToPayment}
                >
                  Proceed to Payment ({formatPrice(getTotalAmount())})
                </Button>
              )}
            </div>
          </Col>
        </Row>

        {/* Error Alert */}
        {error && (
          <Row className="mb-4">
            <Col>
              <Alert variant="danger" dismissible onClose={() => setError('')}>
                {error}
              </Alert>
            </Col>
          </Row>
        )}

        {/* Cart Items */}
        <Row>
          <Col lg={8}>
            {cartItems.length === 0 ? (
              <Card>
                <Card.Body className="text-center py-5">
                  <h4 className="text-muted">Your cart is empty</h4>
                  <p className="text-muted">Add some products to get started!</p>
                  <Button variant="primary" onClick={onNavigateToDashboard}>
                    Continue Shopping
                  </Button>
                </Card.Body>
              </Card>
            ) : (
              <div>
                {cartItems.map((item) => (
                  <Card key={item.id} className="mb-3">
                    <Card.Body>
                      <Row className="align-items-center">
                        <Col md={2}>
                          <div className="bg-light p-3 rounded text-center">
                            <i className="fas fa-image fa-2x text-muted"></i>
                          </div>
                        </Col>
                        <Col md={4}>
                          <h5 className="mb-1">{item.name}</h5>
                          <p className="text-muted mb-0">Product ID: #{item.id}</p>
                        </Col>
                        <Col md={2}>
                          <div className="d-flex align-items-center">
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity - 1)}
                            >
                              -
                            </Button>
                            <span className="mx-3">{item.quantity}</span>
                            <Button
                              variant="outline-secondary"
                              size="sm"
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                            >
                              +
                            </Button>
                          </div>
                        </Col>
                        <Col md={2}>
                          <h5 className="text-success mb-0">
                            {formatPrice(item.price * item.quantity)}
                          </h5>
                          <small className="text-muted">
                            {formatPrice(item.price)} each
                          </small>
                        </Col>
                        <Col md={2}>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => {
                              setItemToRemove(item.id);
                              setShowRemoveModal(true);
                            }}
                          >
                            Remove
                          </Button>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>
                ))}
              </div>
            )}
          </Col>

          <Col lg={4}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                <div className="d-flex justify-content-between mb-2">
                  <span>Subtotal ({getTotalItems()} items):</span>
                  <span>{formatPrice(getTotalAmount())}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Shipping:</span>
                  <span className="text-success">FREE</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Tax:</span>
                  <span>₹0</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total:</strong>
                  <strong className="text-success">{formatPrice(getTotalAmount())}</strong>
                </div>
                
                {cartItems.length > 0 && (
                  <div className="d-grid mt-3">
                    <Button 
                      variant="success" 
                      size="lg"
                      onClick={handleProceedToPayment}
                    >
                      Proceed to Payment
                    </Button>
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Remove Item Confirmation Modal */}
      <Modal show={showRemoveModal} onHide={() => setShowRemoveModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Remove Item</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to remove this item from your cart?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRemoveModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={() => removeFromCart(itemToRemove)}>
            Remove
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ShoppingCart;
