const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  court: { type: String, required: true }
});

const courtBookingUserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  slots: { type: [slotSchema], required: true },
  totalAmount: { type: Number, required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CourtBookingUser', courtBookingUserSchema);
