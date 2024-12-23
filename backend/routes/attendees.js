const express = require("express");
const router = express.Router();
const Attendee = require("../models/Attendee");

// Add Attendee
router.post("/", async (req, res) => {
  try {
    const attendee = await Attendee.create(req.body);
    res.status(201).json(attendee);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get All Attendees
router.get("/", async (req, res) => {
  try {
    const attendees = await Attendee.find();
    res.json(attendees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Delete Attendee
router.delete("/:id", async (req, res) => {
  try {
    await Attendee.findByIdAndDelete(req.params.id);
    res.json({ message: "Attendee deleted" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
