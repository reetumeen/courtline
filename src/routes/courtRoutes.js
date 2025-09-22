const express = require('express');
const router = express.Router();
const courtController = require('../controllers/courtController');

// GET /courts – list active courts (+filters: sport)
router.get('/courts', courtController.listCourts);

// GET /courts/:id – details
router.get('/courts/:id', courtController.getCourtDetails);

// GET /slots/availability – query by date (and optional court_id)
router.get('/slots/availability', courtController.getSlotsAvailability);

// POST /slots/hold – hold one/many inventory_slot_ids for N minutes
router.post('/slots/hold', courtController.holdSlots);

// POST /slots/release – release held slots
router.post('/slots/release', courtController.releaseSlots);

module.exports = router;
