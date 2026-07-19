const express = require("express");
const router = express.Router();

const protect = require("../middleware/authMiddleware");
const Link = require("../models/Link");

const {
  addLink,
  getLinks,
  updateLink,
  deleteLink,
} = require("../controllers/linkController");

router.route("/")
  .post(protect, addLink)
  .get(protect, getLinks);

router.route("/:id")
  .put(protect, updateLink)
  .delete(protect, deleteLink);

router.get("/:id/click", async (req, res) => {
  try {
    const link = await Link.findByIdAndUpdate(
      req.params.id,
      { $inc: { clicks: 1 } },
      { new: true }
    );

    if (!link) {
      return res.status(404).json({ message: "Link not found" });
    }

    res.redirect(link.url);
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;