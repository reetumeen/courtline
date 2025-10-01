const mongoose = require('mongoose');

const courtSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sport: { type: String, required: true, trim: true },
  location: { type: String, required: true, trim: true },
  active: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Court', courtSchema);
