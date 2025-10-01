
const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const courtController = require('../controllers/courtController');
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');

// Send booking confirmation email
router.post('/send-booking-email', emailController.sendBookingEmail);

// Save booking form details (protected)
router.post('/courtbooking', auth, courtController.saveCourtBooking);

// List active courts (+filters: sport)
router.get('/courts', courtController.listCourts);

// Add a single court
router.post('/courts', courtController.addCourt);

// Get court details (protected)
router.get('/courts/:id', auth, courtController.getCourtDetails);

// Query available slots by date (and optional court_id)
router.get('/slots/availability', courtController.getSlotsAvailability);

// Hold one/many inventory_slot_ids for N minutes
router.post('/slots/hold', courtController.holdSlots);

// Release held slots
router.post('/slots/release', courtController.releaseSlots);

// Create Razorpay order
router.post('/create-order', paymentController.createOrder);

// Verify and save payment
router.post('/verify-payment', paymentController.verifyPayment);

module.exports = router;



    // "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZDI1OTM0ODNlODhmNGU3MzZkZjBmNCIsImlhdCI6MTc1ODcwOTgyOSwiZXhwIjoxNzU4Nzk2MjI5fQ.8Lw2K3kgYtu3nMxGhGxvGQrbDdQKkcH1MSI84GnML2w",
//   "message": "Booking saved",
//     "bookingId": "68d3c8dd7be32889c4f05a5e",
//     "redirectUrl": "/payment"
