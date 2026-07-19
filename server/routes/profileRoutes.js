const express = require("express");
const { getPublicProfile } = require("../controllers/profileController");

const router = express.Router();

// Public profile route
router.get("/:username", getPublicProfile);

module.exports = router;