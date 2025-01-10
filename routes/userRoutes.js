const express = require("express");
const router = express.Router();
const User = require("../models/user");
const Club = require("../models/club");

// Write code to insert a single document into the users collection.
router.post("/", (req, res) => {
  const { name, email, age, grades, address, profile, clubs } = req.body;

  const user = new User({
    name,
    email,
    age,
    grades,
    address,
    profile,
    clubs,
  });
  user
    .save()
    .then((savedUser) => {
      res.status(201).json({
        message: "User created successfully",
        user: savedUser,
      });
    })
    .catch((error) => {
      res.status(400).json({
        message: "Error creating user",
        error: error.message,
      });
    });
});

router.get("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findById(id).populate("clubs");
    if (user) {
      res.status(200).json({
        message: "User fetched successfully",
        user,
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
});

router.post("/:id/club", async (req, res) => {
  const { id } = req.params;
  const { clubId } = req.body;

  if (!clubId) {
    return res.status(400).json({
      message: "Club ID is required",
    });
  }

  try {
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({
        message: "Club not found",
      });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    if (user.clubs.includes(clubId)) {
      return res.status(400).json({
        message: "Club already added to user",
      });
    }

    user.clubs.push({
      _id: club.id,
      name: club.name,
    });
    await user.save();

    res.status(201).json({
      message: "Club added to user successfully",
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error",
      error: error.message,
    });
  }
});

// Write a query to retrieve all documents from the users collection.

router.get("/", async (req, res) => {
  try {
    const users = await User.find()
      .populate("clubs")
      .select("-profile.address"); //   -> issue address
    if (users) {
      res.status(200).json({
        message: "All users fetched successfully",
        users,
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Error fetching users",
      error: error.message,
    });
  }
});

// Find by a Specific Field

router.get("/name/:name", async (req, res) => {
  const { name } = req.params;
  try {
    const user = await User.findOne({
      name,
    }).populate("clubs");

    if (user) {
      res.status(200).json({
        message: "User fetched successfully",
        user,
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Error fetching user",
      error: error.message,
    });
  }
});

// Update a Document
router.patch("/id/:id", async (req, res) => {
  const { id } = req.params;
  const { name, email, age, grades, address, clubs } = req.body;

  try {
    const updatedUser = await User.findByIdAndUpdate(
      { _id: id },
      { name, email, age, address, $push: { grades }, $push: { clubs } },
      { new: true }
    ).populate("clubs");

    res.status(200).json({
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    res.status(400).json({
      message: "Error updating user",
      error: error.message,
    });
  }
});

// Delete a Document
router.delete("/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const user = await User.findByIdAndDelete({
      _id: id,
    });

    if (user) {
      res.status(200).json({
        message: "User deleted successfully",
        user,
      });
    } else {
      res.status(404).json({
        message: "User not found",
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Error deleting user",
      error: error.message,
    });
  }
});
module.exports = router;
