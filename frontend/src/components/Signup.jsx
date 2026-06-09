import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import axios from 'axios';

const Signup = ({ onSignup, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    firstname: '',
    lastname: '',
    email: '',
    phone: '',
    passkey: '',
    confirmPasskey: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({...formData,[e.target.name]:e.target.value});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    
    if (!formData.firstname || !formData.lastname || !formData.email || 
        !formData.phone || !formData.passkey || !formData.confirmPasskey) {
      setError('Please fill in all fields');
      setLoading(false);
      return;
    }

    if (formData.passkey !== formData.confirmPasskey) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    if (formData.passkey.length < 6) {
      setError('Password must be at least 6 characters long');
      setLoading(false);
      return;
    }

    try {
      const userData = {
        firstname: formData.firstname,
        lastname: formData.lastname,
        email: formData.email,
        phone: formData.phone,
        passkey: parseInt(formData.passkey) 
      };

      const response = await axios.post('http://localhost:8080/user', userData);
      
      console.log('Signup successful:', response.data);
      setSuccess('Account created successfully! Please login.');
      
      setFormData({
        firstname: '',
        lastname: '',
        email: '',
        phone: '',
        passkey: '',
        confirmPasskey: ''
      });

      setTimeout(() => {
        onSwitchToLogin();
      }, 2000);

    } catch (err) {
      console.error('Signup error:', err);
      if (err.response?.status === 400) {
        setError('User with this email already exists');
      } else {
        setError('Signup failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px 0' }}>
      <Container>
        <Row className="justify-content-center">
          <Col md={8} lg={6}>
            <Card className="shadow">
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  <h2 className="text-primary">🛒 Flipkart</h2>
                  <h4 className="text-muted">Create Account</h4>
                </div>

                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>First Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="firstname"
                          placeholder="Enter first name"
                          value={formData.firstname}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label>Last Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="lastname"
                          placeholder="Enter last name"
                          value={formData.lastname}
                          onChange={handleChange}
                          required
                          disabled={loading}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label>Email Address</Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Enter your email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Phone Number</Form.Label>
                    <Form.Control
                      type="tel"
                      name="phone"
                      placeholder="Enter your phone number"
                      value={formData.phone}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="passkey"
                      placeholder="Create a password"
                      value={formData.passkey}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Confirm Password</Form.Label>
                    <Form.Control
                      type="password"
                      name="confirmPasskey"
                      placeholder="Confirm your password"
                      value={formData.confirmPasskey}
                      onChange={handleChange}
                      required
                      disabled={loading}
                    />
                  </Form.Group>

                  <Button 
                    variant="primary" 
                    type="submit" 
                    className="w-100 mb-3"
                    size="lg"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Spinner animation="border" size="sm" className="me-2" />
                        Creating Account...
                      </>
                    ) : (
                      'Create Account'
                    )}
                  </Button>
                </Form>

                <div className="text-center">
                  <p className="text-muted">
                    Already have an account?{' '}
                    <Button 
                      variant="link" 
                      className="p-0 text-decoration-none"
                      onClick={onSwitchToLogin}
                      disabled={loading}
                    >
                      Login here
                    </Button>
                  </p>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Signup;
