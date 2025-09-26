const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const courtController = require('../controllers/courtController');
// POST /send-booking-email – send booking confirmation email
router.post('/send-booking-email', emailController.sendBookingEmail);

const auth = require('../middleware/authMiddleware');
// POST /courtbooking – save booking form details and redirect to payment
router.post('/courtbooking', auth, courtController.saveCourtBooking);

// GET /courts – list active courts (+filters: sport)
router.get('/courts', courtController.listCourts);

// POST /courts – add a single court
router.post('/courts', courtController.addCourt);

// GET /courts/:id – details
router.get('/courts/:id', courtController.getCourtDetails);

// GET /slots/availability – query by date (and optional court_id)
router.get('/slots/availability', courtController.getSlotsAvailability);

// POST /slots/hold – hold one/many inventory_slot_ids for N minutes
router.post('/slots/hold', courtController.holdSlots);

// POST /slots/release – release held slots
router.post('/slots/release', courtController.releaseSlots);

const paymentController = require('../controllers/paymentController');
// POST /create-order – create Razorpay order
router.post('/create-order', paymentController.createOrder);

// POST /verify-payment – verify and save payment
router.post('/verify-payment', paymentController.verifyPayment);

module.exports = router;



    // "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY4ZDI1OTM0ODNlODhmNGU3MzZkZjBmNCIsImlhdCI6MTc1ODcwOTgyOSwiZXhwIjoxNzU4Nzk2MjI5fQ.8Lw2K3kgYtu3nMxGhGxvGQrbDdQKkcH1MSI84GnML2w",
//   "message": "Booking saved",
//     "bookingId": "68d3c8dd7be32889c4f05a5e",
//     "redirectUrl": "/payment"
