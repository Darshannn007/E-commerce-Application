import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Table, Modal, Spinner, Badge } from 'react-bootstrap';
import axios from 'axios';

const ReviewManagement = ({ user, onLogout, onNavigateToDashboard, onNavigateToAdmin }) => {
  const [reviews, setReviews] = useState([]);
  const [products, setProducts] = useState([]);
  const [users, setUsers] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editingReview, setEditingReview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    review: '',
    productid: '',
    userid: user?.id || ''
  });

  useEffect(() => {
    fetchReviews();
    fetchProducts();
    fetchUsers();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:8080/review');
      setReviews(response.data);
    } catch (err) {
      console.error('Error fetching reviews:', err);
      setError('Failed to fetch reviews');
    } finally {
      setLoading(false);
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await axios.get('http://localhost:8080/product');
      setProducts(response.data);
    } catch (err) {
      console.error('Error fetching products:', err);
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

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const reviewData = {
        review: formData.review,
        productid: parseInt(formData.productid),
        userid: parseInt(formData.userid)
      };

      if (editingReview) {
        
        await axios.put(`http://localhost:8080/review/${editingReview.id}`, reviewData);
        setSuccess('Review updated successfully!');
      } else {
        await axios.post('http://localhost:8080/review', reviewData);
        setSuccess('Review created successfully!');
      }

      setFormData({ review: '', productid: '', userid: user?.id || '' });
      setEditingReview(null);
      setShowModal(false);
      fetchReviews(); 
    } catch (err) {
      console.error('Error saving review:', err);
      setError('Failed to save review');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setFormData({
      review: review.review,
      productid: review.productid.toString(),
      userid: review.userid.toString()
    });
    setShowModal(true);
  };

  const handleDelete = async (reviewId) => {
    if (window.confirm('Are you sure you want to delete this review?')) {
      try {
        setLoading(true);
        await axios.delete(`http://localhost:8080/review/${reviewId}`);
        setSuccess('Review deleted successfully!');
        fetchReviews(); 
      } catch (err) {
        console.error('Error deleting review:', err);
        setError('Failed to delete review');
      } finally {
        setLoading(false);
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingReview(null);
    setFormData({ review: '', productid: '', userid: user?.id || '' });
    setError('');
    setSuccess('');
  };

  const getProductName = (productId) => {
    const product = products.find(p => p.id === productId);
    return product ? product.name : `Product #${productId}`;
  };

  const getUserName = (userId) => {
    const user = users.find(u => u.id === userId);
    return user ? `${user.firstname} ${user.lastname}` : `User #${userId}`;
  };

  return (
    <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa' }}>
      {/* Navigation Bar */}
      <nav className="navbar navbar-expand-lg navbar-dark bg-primary">
        <div className="container">
          <a className="navbar-brand fw-bold" href="#">
            🛒 Flipkart Review Management
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
              <h2>Review Management</h2>
              <Button 
                variant="primary" 
                onClick={() => setShowModal(true)}
                disabled={loading}
              >
                <i className="bi bi-plus-circle me-2"></i>
                Add New Review
              </Button>
            </div>
          </Col>
        </Row>

        {/* Alerts */}
        {error && <Alert variant="danger" dismissible onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert variant="success" dismissible onClose={() => setSuccess('')}>{success}</Alert>}

        {/* Reviews Table */}
        <Row>
          <Col>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Reviews List</h5>
              </Card.Header>
              <Card.Body>
                {loading ? (
                  <div className="text-center py-4">
                    <Spinner animation="border" />
                    <p className="mt-2">Loading reviews...</p>
                  </div>
                ) : (
                  <Table responsive striped hover>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Review</th>
                        <th>Product</th>
                        <th>User</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            No reviews found. Create your first review!
                          </td>
                        </tr>
                      ) : (
                        reviews.map((review) => (
                          <tr key={review.id}>
                            <td>
                              <Badge bg="primary">#{review.id}</Badge>
                            </td>
                            <td>
                              <div style={{ maxWidth: '300px', wordWrap: 'break-word' }}>
                                {review.review}
                              </div>
                            </td>
                            <td>
                              <Badge bg="info">{getProductName(review.productid)}</Badge>
                            </td>
                            <td>
                              <Badge bg="success">{getUserName(review.userid)}</Badge>
                            </td>
                            <td>
                              <Button 
                                variant="outline-primary" 
                                size="sm" 
                                className="me-2"
                                onClick={() => handleEdit(review)}
                              >
                                Edit
                              </Button>
                              <Button 
                                variant="outline-danger" 
                                size="sm"
                                onClick={() => handleDelete(review.id)}
                              >
                                Delete
                              </Button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Add/Edit Review Modal */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingReview ? 'Edit Review' : 'Add New Review'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Review Text</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                name="review"
                placeholder="Write your review here..."
                value={formData.review}
                onChange={handleChange}
                required
                disabled={loading}
              />
            </Form.Group>

            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Product</Form.Label>
                  <Form.Select
                    name="productid"
                    value={formData.productid}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select a product</option>
                    {products.map((product) => (
                      <option key={product.id} value={product.id}>
                        {product.name} - ₹{product.price}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>User</Form.Label>
                  <Form.Select
                    name="userid"
                    value={formData.userid}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  >
                    <option value="">Select a user</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.firstname} {user.lastname} ({user.email})
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal} disabled={loading}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                {editingReview ? 'Updating...' : 'Creating...'}
              </>
            ) : (
              editingReview ? 'Update Review' : 'Create Review'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ReviewManagement;
