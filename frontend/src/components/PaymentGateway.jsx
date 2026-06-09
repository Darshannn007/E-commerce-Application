import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Form, Button, Alert, Spinner, Modal, Badge } from 'react-bootstrap';
import axios from 'axios';

const PaymentGateway = ({ 
  cartItems, 
  totalAmount, 
  user, 
  onPaymentSuccess, 
  onPaymentCancel,
  onLogout,
  onNavigateToDashboard,
  onNavigateToAdmin,
  onNavigateToReviews,
  onNavigateToUsers
}) => {
  const [paymentMethod, setPaymentMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [showOTPModal, setShowOTPModal] = useState(false);
  const [otp, setOtp] = useState('');
  const [paymentStep, setPaymentStep] = useState('details'); 

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
    upiId: '',
    phoneNumber: '',
    email: user?.email || ''
  });

  const handlePaymentDetailsChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value
    });
  };

  const validatePaymentDetails = () => {
    if (paymentMethod === 'card') {
      if (!paymentDetails.cardNumber || !paymentDetails.expiryDate || !paymentDetails.cvv || !paymentDetails.cardHolderName) {
        setError('Please fill in all card details');
        return false;
      }
      if (paymentDetails.cardNumber.length < 16) {
        setError('Card number must be at least 16 digits');
        return false;
      }
      if (paymentDetails.cvv.length < 3) {
        setError('CVV must be at least 3 digits');
        return false;
      }
    } else if (paymentMethod === 'upi') {
      if (!paymentDetails.upiId) {
        setError('Please enter UPI ID');
        return false;
      }
    } else if (paymentMethod === 'netbanking') {
      if (!paymentDetails.phoneNumber) {
        setError('Please enter phone number');
        return false;
      }
    }
    return true;
  };

  const handlePaymentSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validatePaymentDetails()) {
      return;
    }

    setPaymentStep('otp');
    setShowOTPModal(true);
  };

  const handleOTPSubmit = async () => {
    if (otp.length !== 6) {
      setError('OTP must be 6 digits');
      return;
    }

    setPaymentStep('processing');
    setLoading(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 3000));

      const isSuccess = Math.random() > 0.1;

      if (isSuccess) {
        setPaymentStep('success');
        setSuccess('Payment successful! Your order has been placed.');
        
        const orderData = {
          userId: user.id,
          items: cartItems,
          totalAmount: totalAmount,
          paymentMethod: paymentMethod,
          status: 'confirmed',
          orderDate: new Date().toISOString()
        };

        console.log('Order created:', orderData);
        
        setTimeout(() => {
          onPaymentSuccess(orderData);
        }, 2000);
      } else {
        setError('Payment failed. Please try again.');
        setPaymentStep('details');
        setShowOTPModal(false);
        setOtp('');
      }
    } catch (err) {
      setError('Payment processing failed. Please try again.');
      setPaymentStep('details');
      setShowOTPModal(false);
      setOtp('');
    } finally {
      setLoading(false);
    }
  };

  const formatCardNumber = (value) => {
    return value.replace(/\s/g, '').replace(/(.{4})/g, '$1 ').trim();
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(.{2})/, '$1/').substring(0, 5);
  };

  if (paymentStep === 'success') {
    return (
      <div style={{ minHeight: '100vh', backgroundColor: '#f8f9fa', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Container>
          <Row className="justify-content-center">
            <Col md={6}>
              <Card className="text-center shadow">
                <Card.Body className="p-5">
                  <div className="text-success mb-4">
                    <i className="fas fa-check-circle fa-5x"></i>
                  </div>
                  <h2 className="text-success mb-3">Payment Successful!</h2>
                  <p className="lead">Your order has been placed successfully.</p>
                  <p className="text-muted">Order ID: #{Math.floor(Math.random() * 1000000)}</p>
                  <Button variant="primary" onClick={onNavigateToDashboard}>
                    Continue Shopping
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>
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
            🛒 Flipkart Payment
          </a>
          <div className="navbar-nav ms-auto">
            <span className="navbar-text me-3">
              Welcome, {user?.firstname} {user?.lastname}!
            </span>
            <button 
              className="btn btn-outline-light btn-sm"
              onClick={onPaymentCancel}
            >
              Cancel Payment
            </button>
          </div>
        </div>
      </nav>

      <Container className="mt-4">
        <Row>
          <Col lg={8}>
            <Card>
              <Card.Header>
                <h4 className="mb-0">Payment Details</h4>
              </Card.Header>
              <Card.Body>
                {error && <Alert variant="danger">{error}</Alert>}
                {success && <Alert variant="success">{success}</Alert>}

                {/* Payment Method Selection */}
                <div className="mb-4">
                  <h5>Select Payment Method</h5>
                  <div className="d-flex gap-3">
                    <Button
                      variant={paymentMethod === 'card' ? 'primary' : 'outline-primary'}
                      onClick={() => setPaymentMethod('card')}
                    >
                      💳 Credit/Debit Card
                    </Button>
                    <Button
                      variant={paymentMethod === 'upi' ? 'primary' : 'outline-primary'}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      📱 UPI
                    </Button>
                    <Button
                      variant={paymentMethod === 'netbanking' ? 'primary' : 'outline-primary'}
                      onClick={() => setPaymentMethod('netbanking')}
                    >
                      🏦 Net Banking
                    </Button>
                  </div>
                </div>

                <Form onSubmit={handlePaymentSubmit}>
                  {paymentMethod === 'card' && (
                    <div>
                      <Form.Group className="mb-3">
                        <Form.Label>Card Number</Form.Label>
                        <Form.Control
                          type="text"
                          name="cardNumber"
                          placeholder="1234 5678 9012 3456"
                          value={paymentDetails.cardNumber}
                          onChange={(e) => {
                            const formatted = formatCardNumber(e.target.value);
                            setPaymentDetails({...paymentDetails, cardNumber: formatted});
                          }}
                          maxLength="19"
                          required
                        />
                      </Form.Group>
                      <Row>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>Expiry Date</Form.Label>
                            <Form.Control
                              type="text"
                              name="expiryDate"
                              placeholder="MM/YY"
                              value={paymentDetails.expiryDate}
                              onChange={(e) => {
                                const formatted = formatExpiryDate(e.target.value);
                                setPaymentDetails({...paymentDetails, expiryDate: formatted});
                              }}
                              maxLength="5"
                              required
                            />
                          </Form.Group>
                        </Col>
                        <Col md={6}>
                          <Form.Group className="mb-3">
                            <Form.Label>CVV</Form.Label>
                            <Form.Control
                              type="text"
                              name="cvv"
                              placeholder="123"
                              value={paymentDetails.cvv}
                              onChange={handlePaymentDetailsChange}
                              maxLength="4"
                              required
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>Card Holder Name</Form.Label>
                        <Form.Control
                          type="text"
                          name="cardHolderName"
                          placeholder="Name"
                          value={paymentDetails.cardHolderName}
                          onChange={handlePaymentDetailsChange}
                          required
                        />
                      </Form.Group>
                    </div>
                  )}

                  {paymentMethod === 'upi' && (
                    <Form.Group className="mb-3">
                      <Form.Label>UPI ID</Form.Label>
                      <Form.Control
                        type="text"
                        name="upiId"
                        placeholder="yourname@paytm"
                        value={paymentDetails.upiId}
                        onChange={handlePaymentDetailsChange}
                        required
                      />
                    </Form.Group>
                  )}

                  {paymentMethod === 'netbanking' && (
                    <div>
                      <Form.Group className="mb-3">
                        <Form.Label>Phone Number</Form.Label>
                        <Form.Control
                          type="tel"
                          name="phoneNumber"
                          placeholder="+91 9876543210"
                          value={paymentDetails.phoneNumber}
                          onChange={handlePaymentDetailsChange}
                          required
                        />
                      </Form.Group>
                      <Form.Group className="mb-3">
                        <Form.Label>Email</Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          value={paymentDetails.email}
                          onChange={handlePaymentDetailsChange}
                          required
                        />
                      </Form.Group>
                    </div>
                  )}

                  <div className="d-grid">
                    <Button 
                      type="submit" 
                      variant="success" 
                      size="lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Processing Payment...
                        </>
                      ) : (
                        `Pay ₹${totalAmount}`
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>

          <Col lg={4}>
            <Card>
              <Card.Header>
                <h5 className="mb-0">Order Summary</h5>
              </Card.Header>
              <Card.Body>
                {cartItems.map((item, index) => (
                  <div key={index} className="d-flex justify-content-between mb-2">
                    <span>{item.name}</span>
                    <span>₹{item.price}</span>
                  </div>
                ))}
                <hr />
                <div className="d-flex justify-content-between">
                  <strong>Total Amount:</strong>
                  <strong className="text-success">₹{totalAmount}</strong>
                </div>
                <div className="mt-3">
                  <Badge bg="info" className="me-2">Secure Payment</Badge>
                  <Badge bg="success">SSL Encrypted</Badge>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* OTP Modal */}
      <Modal show={showOTPModal} onHide={() => {}} backdrop="static" keyboard={false}>
        <Modal.Header>
          <Modal.Title>Enter OTP</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Please enter the 6-digit OTP sent to your registered mobile number.</p>
          <Form.Group>
            <Form.Control
              type="text"
              placeholder="123456"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').substring(0, 6))}
              maxLength="6"
              className="text-center fs-4"
            />
          </Form.Group>
          <div className="text-center mt-3">
            <small className="text-muted">Demo OTP: 123456</small>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button 
            variant="success" 
            onClick={handleOTPSubmit}
            disabled={loading || otp.length !== 6}
          >
            {loading ? (
              <>
                <Spinner animation="border" size="sm" className="me-2" />
                Verifying...
              </>
            ) : (
              'Verify & Pay'
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PaymentGateway;
