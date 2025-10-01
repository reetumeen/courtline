
const nodemailer = require('nodemailer');
const User = require('../models/User');
const CourtBookingUser = require('../models/CourtBookingUser');
const CourtSlot = require('../models/CourtSlot');

// Use environment variables for SMTP credentials
const transporter = nodemailer.createTransport({
  service: process.env.SMTP_SERVICE || 'gmail',
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Send booking confirmation email
exports.sendBookingEmail = async (req, res) => {
  try {
    const { userId, bookingId, paymentAmount } = req.body;
    if (!userId || !bookingId || !paymentAmount) {
      return res.status(400).json({ success: false, error: 'userId, bookingId, and paymentAmount are required' });
    }
    const user = await User.findById(userId);
    const booking = await CourtBookingUser.findById(bookingId);
    if (!user || !booking) {
      return res.status(404).json({ success: false, error: 'User or booking not found' });
    }
    // Build slot info string
    const slotDetails = booking.slots.map(slot => `${slot.date} ${slot.time} (${slot.court})`).join(', ');
    // Email content
    const mailOptions = {
      from: process.env.SMTP_USER,
      to: user.email,
      subject: 'Court Booking Confirmation',
      html: `<h2>Thank you for your booking!</h2>
        <p>Name: ${user.name}</p>
        <p>Phone: ${user.phone || booking.phone}</p>
        <p>Booked Slots: ${slotDetails}</p>
        <p>Amount Paid: 9${paymentAmount}</p>
        <p>Enjoy your game!</p>`
    };
    await transporter.sendMail(mailOptions);
    return res.status(200).json({ success: true, message: 'Confirmation email sent.' });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
