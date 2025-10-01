
const mongoose = require('mongoose');

const courtSlotSchema = new mongoose.Schema({
  date: { type: String, required: true, trim: true },
  time: { type: String, required: true, trim: true },
  court: { type: mongoose.Schema.Types.ObjectId, ref: 'Court', required: true },
  status: { type: String, enum: ['available', 'held', 'booked'], default: 'available' },
  holdUntil: { type: Date },
  cart_id: { type: String },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

courtSlotSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CourtSlot', courtSlotSchema);
