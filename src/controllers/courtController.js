
const Court = require('../models/Court');
const CourtSlot = require('../models/CourtSlot');
const CourtBookingUser = require('../models/CourtBookingUser');





// GET /courts – list active courts (+filters: sport)
exports.listCourts = async (req, res) => {
    try {
        const filter = { active: true };
        if (req.query.sport) {
            filter.sport = req.query.sport;
        }
        const courts = await Court.find(filter);
        return res.status(200).json({ success: true, data: courts });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};


// GET /courts/:id – details
exports.getCourtDetails = async (req, res) => {
    try {
        const court = await Court.findById(req.params.id);
        if (!court) return res.status(404).json({ success: false, error: 'Court not found' });
        return res.status(200).json({ success: true, data: court });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};


// GET /slots/availability – query by date (and optional court_id)
exports.getSlotsAvailability = async (req, res) => {
    try {
        const { date, court_id } = req.query;
        if (!date) return res.status(400).json({ success: false, error: 'date is required' });
        const filter = { date, status: 'available' };
        if (court_id) filter.court = court_id;
        const slots = await CourtSlot.find(filter);
        return res.status(200).json({ success: true, data: slots });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};


// POST /slots/hold – hold one/many inventory_slot_ids for N minutes
exports.holdSlots = async (req, res) => {
    try {
        const { inventory_slot_ids, minutes, cart_id } = req.body;
        if (!inventory_slot_ids || !minutes || !cart_id) {
            return res.status(400).json({ success: false, error: 'inventory_slot_ids, minutes, and cart_id are required' });
        }
        const now = new Date();
        const holdUntil = new Date(now.getTime() + minutes * 60000);
        await CourtSlot.updateMany(
            { _id: { $in: inventory_slot_ids }, status: 'available' },
            { $set: { status: 'held', holdUntil, cart_id } }
        );
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};


// POST /slots/release – release held slots
exports.releaseSlots = async (req, res) => {
    try {
        const { inventory_slot_ids, cart_id } = req.body;
        if (!inventory_slot_ids || !cart_id) {
            return res.status(400).json({ success: false, error: 'inventory_slot_ids and cart_id are required' });
        }
        await CourtSlot.updateMany(
            { _id: { $in: inventory_slot_ids }, status: 'held', cart_id },
            { $set: { status: 'available' }, $unset: { holdUntil: '', cart_id: '' } }
        );
        return res.status(200).json({ success: true });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};


// POST /courts – add a single court
exports.addCourt = async (req, res) => {
    try {
        const { name, sport, location, active } = req.body;
        if (!name || !sport || !location) {
            return res.status(400).json({ success: false, error: 'name, sport, and location are required' });
        }
        const court = new Court({
            name,
            sport,
            location,
            active: active !== undefined ? active : true,
            createdAt: new Date()
        });
        const savedCourt = await court.save();
        return res.status(201).json({ success: true, data: savedCourt });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};


// POST /courtbooking – save booking form details and redirect to payment
exports.saveCourtBooking = async (req, res) => {
    try {
        const userId = req.user.id;
        const { name, phone, email, slots, totalAmount } = req.body;
        if (!name || !phone || !email || !slots || !totalAmount) {
            return res.status(400).json({ success: false, error: 'name, phone, email, slots, and totalAmount are required' });
        }
        const booking = new CourtBookingUser({
            userId,
            name,
            phone,
            email,
            slots,
            totalAmount
        });
        const savedBooking = await booking.save();
        return res.status(201).json({ success: true, data: { bookingId: savedBooking._id, redirectUrl: '/payment' } });
    } catch (err) {
        return res.status(500).json({ success: false, error: err.message });
    }
};



