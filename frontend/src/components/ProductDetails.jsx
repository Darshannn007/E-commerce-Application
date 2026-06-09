import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert, Badge, Modal, Form } from 'react-bootstrap';
import axios from 'axios';

const ProductDetails = ({ productId, user, onLogout, onNavigateToDashboard, onNavigateToAdmin, onNavigateToReviews, onNavigateToUsers }) => {
  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewForm, setReviewForm] = useState({ review: '' });

  useEffect(() => {
    if (productId) {
      fetchProductDetails();
      fetchReviews();
      fetchUsers();
    }
  }, [productId]);

  const fetchProductDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:8080/product/${productId}`);
      setProduct(response.data);
    } catch (err) {
      console.error('Error fetching product:', err);
      setError('Failed to fetch product details');
    } finally {
      setLoading(false);
    }
  };

  const fetchReviews = async () => {
    try {
      const response = await axios.get('http://localhost:8080/review');
      setReviews(response.data.filter(review => review.productid === productId));
    } catch (err) {
      console.error('Error fetching reviews:', err);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8080/user');
      setUsers(response.data);
    } catch (err) {
      console.error('Error fetching users:', err);
    }
  };

  setReviewForm({ review: '' });
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    try {
      const reviewData = {
        review: reviewForm.review,
        productid: productId,
        userid: user.id
      };

      await axios.post('http://localhost:8080/review', reviewData);
      setShowReviewModal(false);
      fetchReviews(); 
    } catch (err) {
      console.error('Error creating review:', err); 
      setError('Failed to create review');
    }
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);             
    return user ? `${user.firstname} ${user.lastname}` : `User #${userId}`;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR'
    }).format(price);
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  if (loading) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div className="text-center">
          <Spinner animation="border" size="lg" />
          <p className="mt-3">Loading product details...</p>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
          <div className="container">
            <a className="navbar-brand fw-bold" href="#">
              🛒 Flipkart
            </a>
            <div className="navbar-nav ms-auto">
              <button 
                className="btn btn-outline-light btn-sm"
                onClick={onNavigateToDashboard}
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        </nav>
        <Container className="mt-4">
          <Alert variant="danger">
            {error || 'Product not found'}
          </Alert>
        </Container>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            🛒 Flipkart Product Details
          </a>
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">
              Welcome, {user?.firstname} {user?.lastname}!
            </span>
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
        {/* Product Details */}
        <Row className="mb-4">
          <Col>
            <Card>
              <Card.Body className="p-4">
                <Row>
                  <Col md={8}>
                    <h2 className="text-primary mb-3">{product.name}</h2>
                    <div className="mb-3">
                      <h3 className="text-success">{formatPrice(product.price)}</h3>
                      <Badge bg="info">Product ID: #{product.id}</Badge>
                    </div>
                    <p className="text-muted">
                      <strong>Added on:</strong> {formatDate(product.date)}
                    </p>
                    <p className="text-muted">
                      <strong>Added by:</strong> User #{product.userid}
                    </p>
                  </Col>
                  <Col md={4} className="text-center">
                    <div className="bg-light p-4 rounded">
                      <h5>Product Image</h5>
                      <div className="bg-secondary text-white p-5 rounded">
                        <i className="fas fa-image fa-3x"></i>
                        <p className="mt-2">No Image Available</p>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Reviews Section */}
        <Row>
          <Col>
            <Card>
              <Card.Header className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Reviews ({reviews.length})</h5>
                <Button 
                  variant="primary" 
                  size="sm"
                  onClick={() => setShowReviewModal(true)}
                >
                  Add Review
                </Button>
              </Card.Header>
              <Card.Body>
                {reviews.length === 0 ? (
                  <div className="text-center py-4">
                    <p className="text-muted">No reviews yet. Be the first to review this product!</p>
                  </div>
                ) : (
                  <div>
                    {reviews.map((review) => (
                      <Card key={review.id} className="mb-3">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-start">
                            <div>
                              <h6 className="mb-1">{getUserName(review.userid)}</h6>
                              <p className="mb-0">{review.review}</p>
                            </div>
                            <Badge bg="secondary">#{review.id}</Badge>
                          </div>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Add Review Modal */}
      <Modal show={showReviewModal} onHide={() => setShowReviewModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Add Review for {product.name}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleReviewSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Your Review</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Write your review here..."
                value={reviewForm.review}
                onChange={(e) => setReviewForm({ review: e.target.value })}
                required
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReviewModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleReviewSubmit}>
            Submit Review
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ProductDetails;
