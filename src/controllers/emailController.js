const nodemailer = require('nodemailer');
const User = require('../models/User');
const CourtBookingUser = require('../models/CourtBookingUser');
const CourtSlot = require('../models/CourtSlot');

// Demo SMTP config (use your own credentials in production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'demo.sender@gmail.com',
    pass: 'demo_password'
  }
});

// Send booking confirmation email
exports.sendBookingEmail = async (req, res) => {
  try {
    const { userId, bookingId, paymentAmount } = req.body;
    if (!userId || !bookingId || !paymentAmount) {
      return res.status(400).json({ error: 'userId, bookingId, and paymentAmount are required' });
    }
    const user = await User.findById(userId);
    const booking = await CourtBookingUser.findById(bookingId);
    if (!user || !booking) {
      return res.status(404).json({ error: 'User or booking not found' });
    }
    // Build slot info string
    const slotDetails = booking.slots.map(slot => `${slot.date} ${slot.time} (${slot.court})`).join(', ');
    // Email content
    const mailOptions = {
      from: 'demo.sender@gmail.com',
      to: user.email,
      subject: 'Court Booking Confirmation',
      html: `<h2>Thank you for your booking!</h2>
        <p>Name: ${user.name}</p>
        <p>Phone: ${user.phone || booking.phone}</p>
        <p>Booked Slots: ${slotDetails}</p>
        <p>Amount Paid: ₹${paymentAmount}</p>
        <p>Enjoy your game!</p>`
    };
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Confirmation email sent.' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
