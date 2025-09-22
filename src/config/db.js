const { MongoClient } = require('mongodb');

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/courtline';
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectDB() {
	try {
		await client.connect();
		console.log('Connected to MongoDB');
		return client.db();
	} catch (err) {
		console.error('MongoDB connection error:', err);
		throw err;
	}
}

module.exports = { connectDB };
