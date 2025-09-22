const { ObjectId } = require('mongodb');
const { connectDB } = require('../config/db');

// GET /courts – list active courts (+filters: sport)
async function listCourts(req, res) {
    try {
        const db = await connectDB();
        const filter = { active: true };
        if (req.query.sport) {
            filter.sport = req.query.sport;
        }
        const courts = await db.collection('courts').find(filter).toArray();
        res.json(courts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// GET /courts/:id – details
async function getCourtDetails(req, res) {
    try {
        const db = await connectDB();
        const court = await db.collection('courts').findOne({ _id: new ObjectId(req.params.id) });
        if (!court) return res.status(404).json({ error: 'Court not found' });
        res.json(court);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// GET /slots/availability – query by date (and optional court_id)
async function getSlotsAvailability(req, res) {
    try {
        const db = await connectDB();
        const { date, court_id } = req.query;
        if (!date) return res.status(400).json({ error: 'date is required' });
        const filter = { date };
        if (court_id) filter.court_id = court_id;
        filter.status = 'available';
        const slots = await db.collection('inventory_slots').find(filter).toArray();
        res.json(slots);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// POST /slots/hold – hold one/many inventory_slot_ids for N minutes
async function holdSlots(req, res) {
    try {
        const db = await connectDB();
        const { inventory_slot_ids, minutes, cart_id } = req.body;
        if (!inventory_slot_ids || !minutes || !cart_id) {
            return res.status(400).json({ error: 'inventory_slot_ids, minutes, and cart_id are required' });
        }
        const now = new Date();
        const holdUntil = new Date(now.getTime() + minutes * 60000);
        await db.collection('inventory_slots').updateMany(
            { _id: { $in: inventory_slot_ids.map(id => new ObjectId(id)) }, status: 'available' },
            { $set: { status: 'held', holdUntil, cart_id } }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// POST /slots/release – release held slots
async function releaseSlots(req, res) {
    try {
        const db = await connectDB();
        const { inventory_slot_ids, cart_id } = req.body;
        if (!inventory_slot_ids || !cart_id) {
            return res.status(400).json({ error: 'inventory_slot_ids and cart_id are required' });
        }
        await db.collection('inventory_slots').updateMany(
            { _id: { $in: inventory_slot_ids.map(id => new ObjectId(id)) }, status: 'held', cart_id },
            { $set: { status: 'available' }, $unset: { holdUntil: '', cart_id: '' } }
        );
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

module.exports = {
    listCourts,
    getCourtDetails,
    getSlotsAvailability,
    holdSlots,
    releaseSlots
};
