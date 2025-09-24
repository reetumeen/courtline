const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');
const courtController = require('../controllers/courtController');
// POST /send-booking-email – send booking confirmation email
router.post('/send-booking-email', emailController.sendBookingEmail);

// POST /courtbooking – save booking form details and redirect to payment
router.post('/courtbooking', courtController.saveCourtBooking);

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
