const express = require("express");
const { getUsers, createUser } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");
const router = express.Router();

router.get("/",auth, getUsers);
router.post("/", createUser);

module.exports = router;
