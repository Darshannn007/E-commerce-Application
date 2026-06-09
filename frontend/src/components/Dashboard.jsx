import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge } from 'react-bootstrap';
import axios from 'axios';

const Dashboard = ({ user, onLogout, onNavigateToAdmin, onNavigateToReviews, onNavigateToUsers, onNavigateToProduct,onNavigateToCart }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProducts();
  },[]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/product');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('Failed to fetch products');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            🛒 Flipkart Dashboard
          </a>
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">
              Welcome, {user?.firstname} {user?.lastname}!
            </span>
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
              className="btn btn-outline-light btn-sm me-2"
              onClick={onNavigateToCart}
            >
              🛒 Cart
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
        {/* Welcome Section */}
        <Row className="mb-4">
          <Col>
            <Card className="bg-primary text-white">
              <Card.Body className="p-4">
                <h2 className="mb-2">Welcome to Flipkart!</h2>
                <p className="mb-0">Discover amazing products and great deals</p>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Stats Cards */}
        <Row className="mb-4">
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-primary">{products.length}</h3>
                <p className="text-muted mb-0">Total Products</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-success">
                  {products.length > 0 ? Math.round(products.reduce((sum, p) => sum + p.price, 0) / products.length) : 0}
                </h3>
                <p className="text-muted mb-0">Avg Price</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-info">
                  {products.length > 0 ? Math.max(...products.map(p => p.price)) : 0}
                </h3>
                <p className="text-muted mb-0">Highest Price</p>
              </Card.Body>
            </Card>
          </Col>
          <Col md={3}>
            <Card className="text-center">
              <Card.Body>
                <h3 className="text-warning">
                  {products.length > 0 ? Math.min(...products.map(p => p.price)) : 0}
                </h3>
                <p className="text-muted mb-0">Lowest Price</p>
              </Card.Body>
            </Card>
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

        {/* Products Section */}
        <Row>
          <Col>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Available Products</h5>
                <Button 
                  variant="outline-primary" 
                  size="sm"
                  onClick={fetchProducts}
                  disabled={loading}
                >
                  {loading ? <Spinner size="sm" /> : 'Refresh'}
                </Button>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" size="lg" />
                    <p className="mt-3">Loading products...</p>
                  </div>
                ) : products.length === 0 ? (
                  <div className="text-center py-5">
                    <h5 className="text-muted">No products available</h5>
                    <p className="text-muted">Products will appear here once they are added.</p>
                  </div>
                ) : (
                  <Row>
                    {products.map((product) => (
                      <Col key={product.id} md={6} lg={4} className="mb-4">
                        <Card className="h-100 shadow-sm">
                          <Card.Body>
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <h6 className="card-title mb-0">{product.name}</h6>
                              <Badge bg="primary">#{product.id}</Badge>
                            </div>
                            <div className="mb-3">
                              <h4 className="text-success mb-1">
                                {formatPrice(product.price)}
                              </h4>
                              <small className="text-muted">
                                Added: {formatDate(product.date)}
                              </small>
                            </div>
                            <div className="d-grid gap-2">
                              <Button 
                                variant="outline-primary" 
                                size="sm"
                                onClick={() => onNavigateToProduct(product.id)}
                              >
                                View Details
                              </Button>
                              <Button 
                                variant="success" 
                                size="sm"
                                onClick={() => {
                                  const cart = JSON.parse(localStorage.getItem('flipkart_cart') || '[]');
                                  const existingItem = cart.find(item => item.id === product.id);
                                  
                                  if (existingItem) {
                                    const updatedCart = cart.map(item =>
                                      item.id === product.id
                                        ? { ...item, quantity: item.quantity + 1 }
                                        : item
                                    );
                                    localStorage.setItem('flipkart_cart', JSON.stringify(updatedCart));
                                  } else {
                                    const updatedCart = [...cart, { ...product, quantity: 1 }];
                                    localStorage.setItem('flipkart_cart', JSON.stringify(updatedCart));
                                  }
                                  
                                  alert('Product added to cart!');
                                }}
                              >
                                Add to Cart
                              </Button>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
