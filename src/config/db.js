const mongoose = require('mongoose');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/courtline';

async function connectDB() {
	try {
		await mongoose.connect(uri, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
		});
		console.log('Connected to MongoDB');
	} catch (err) {
		console.error('MongoDB connection error:', err);
		throw err;
	}
}

module.exports = { connectDB };
