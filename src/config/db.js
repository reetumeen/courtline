
const mongoose = require('mongoose');
const uri = process.env.MONGO_URI;

async function connectDB() {
	try {
		await mongoose.connect(uri);
		console.log('Connected to MongoDB');
	} catch (err) {
		console.error('MongoDB connection error:', err);
		throw err;
	}
}

module.exports = { connectDB };
