const mongoose = require('mongoose');

const courtSlotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  court: { type: String, required: true },
  status: { type: String, default: 'available' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('CourtSlot', courtSlotSchema);
