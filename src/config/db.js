const mongoose = require('mongoose');

const uri = process.env.MONGO_URI || 'mongodb+srv://reetumeen10:<yzGB8eWDDuWJVYs3>@cluster1.frfivz0.mongodb.net/courtline?retryWrites=true&w=majority&appName=Cluster1';

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
