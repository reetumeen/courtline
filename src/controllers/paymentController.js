const Razorpay = require('razorpay');
const Payment = require('../models/Payment');
const CourtBookingUser = require('../models/CourtBookingUser');
const CourtSlot = require('../models/CourtSlot');




// Demo Razorpay keys (replace with owner key in production)
const razorpay = new Razorpay({
  key_id: 'rzp_test_1DP5mmOlF5G5ag',
  key_secret: 'your_demo_secret'
});

// POST /create-order
// Expects: { amount, currency, userId, bookingId }

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency = 'INR', userId, bookingId } = req.body;
    if (!amount || !userId || !bookingId) {
      return res.status(400).json({ error: 'amount, userId, and bookingId are required' });
    }

    // Get booking and slots
    const booking = await CourtBookingUser.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Check slot availability and lock slots as pending
    for (const slot of booking.slots) {
      const slotDoc = await CourtSlot.findOne({
        date: slot.date,
        time: slot.time,
        court: slot.court,
        status: { $in: ['booked', 'pending'] }
      });
      if (slotDoc) {
        return res.status(409).json({ error: `Slot unavailable: ${slot.date} ${slot.time} ${slot.court}` });
      }
    }
    for (const slot of booking.slots) {
      await CourtSlot.updateOne(
        { date: slot.date, time: slot.time, court: slot.court, status: 'available' },
        { $set: { status: 'pending', pendingBy: userId, pendingAt: new Date() } }
      );
    }

    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: `rcpt_${bookingId}`
    };
    try {
      const order = await razorpay.orders.create(options);
      if (!order || !order.id) {
        console.error('Razorpay order response:', order);
        return res.status(500).json({ error: 'Failed to create Razorpay order', details: order });
      }
      res.json({ orderId: order.id });
    } catch (razorErr) {
      console.error('Razorpay order creation error:', razorErr);
      if (razorErr && razorErr.error) {
        return res.status(500).json({ error: razorErr.error.description || 'Razorpay error', details: razorErr.error });
      }
      return res.status(500).json({ error: razorErr.message || 'Unknown error', details: razorErr });
    }
  } catch (err) {
    console.error('Create order API error:', err);
    res.status(500).json({ error: err.message });
  }
};

// POST /verify-payment
// Expects: { paymentId, orderId, userId, bookingId, amount, status }
exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId, orderId, userId, bookingId, amount, status } = req.body;
    if (!paymentId || !orderId || !userId || !bookingId || !amount || !status) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Check for duplicate payment
    const existingPayment = await Payment.findOne({ transactionId: paymentId });
    if (existingPayment) {
      return res.status(409).json({ error: 'Duplicate payment detected' });
    }

    // Get booking and slots
    const booking = await CourtBookingUser.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    // Validate slot availability
    for (const slot of booking.slots) {
      const slotDoc = await CourtSlot.findOne({
        date: slot.date,
        time: slot.time,
        court: slot.court,
        status: 'available'
      });
      if (!slotDoc) {
        return res.status(409).json({ error: `Slot unavailable: ${slot.date} ${slot.time} ${slot.court}` });
      }
    }

    // Mark slots as booked
    for (const slot of booking.slots) {
      await CourtSlot.updateOne(
        { date: slot.date, time: slot.time, court: slot.court, status: 'available' },
        { $set: { status: 'booked', bookedBy: userId, bookedAt: new Date() } }
      );
    }

    // Save payment info
    const payment = new Payment({
      userId,
      bookingId,
      amount,
      status,
      paymentMethod: 'razorpay',
      transactionId: paymentId
    });
    await payment.save();

    // Send booking confirmation email (only if payment is successful)
    if (status === 'success' || status === 'captured') {
      try {
        const emailController = require('./emailController');
        await emailController.sendBookingEmail({
          body: { userId, bookingId, paymentAmount: amount }
        }, { json: () => {} }); // dummy res for direct call
      } catch (emailErr) {
        // Log email error but don't block payment response
        console.error('Email send error:', emailErr);
      }
    }

    res.json({ success: true, paymentId, status });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
