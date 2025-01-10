const express = require("express");
const router = express.Router();
const Club = require("../models/club.js");
const User = require("../models/user.js");

// GET all clubs
router.get("/", async (req, res) => {
  try {
    const clubs = await Club.find().populate("users").select("name");
    if (!clubs) {
      return res.status(404).json({ message: "No clubs found" });
    }
    res.json(clubs);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving clubs", error });
  }
});

// GET a single club by ID
router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const club = await Club.findById(id);
    if (!club) {
      return res.status(404).json({ message: "Club not found" });
    }
    const users = await User.find({ clubs: club.id });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: "Error retrieving club", error });
  }
});

// POST a new club
router.post("/", async (req, res) => {
  try {
    const { name, description, users } = req.body;
    const newClub = new Club({ name, description, users });
    const savedClub = await newClub.save();
    res.status(201).json(savedClub);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Error creating club", error, reqBody: req.body });
  }
});

// PUT to update a club by ID
router.put("/:id", async (req, res) => {
  try {
    const updatedClub = await Club.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!updatedClub) {
      return res.status(404).json({ message: "Club not found" });
    }
    res.json(updatedClub);
  } catch (error) {
    res.status(400).json({ message: "Error updating club", error });
  }
});

// DELETE a club by ID
router.delete("/:id", async (req, res) => {
  try {
    const deletedClub = await Club.findByIdAndDelete(req.params.id);
    if (!deletedClub) {
      return res.status(404).json({ message: "Club not found" });
    }
    res.json({ message: "Club deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting club", error });
  }
});

module.exports = router;
