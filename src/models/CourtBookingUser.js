
const mongoose = require('mongoose');

const slotSchema = new mongoose.Schema({
  date: { type: String, required: true, trim: true },
  time: { type: String, required: true, trim: true },
  court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true }
});

const courtBookingUserSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true },
  email: { type: String,required: true,},
  slots: { type: [slotSchema], required: true },
  totalAmount: { type: Number, required: true, min: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

courtBookingUserSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CourtBookingUser', courtBookingUserSchema);
