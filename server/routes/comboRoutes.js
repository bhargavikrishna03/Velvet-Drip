
const router = require("express").Router();
const mongoose = require("mongoose");

const Combo = require("../models/Combo");
const Dish = require("../models/Dish");
const auth = require("../middleware/auth");

// Only allow these fields from the request
const pickCombo = (body) => {
  const allowed = [
    "name",
    "description",
    "image",
    "dishes",
    "offerPrice",
    "active",
  ];

  return Object.fromEntries(
    Object.entries(body).filter(([key]) => allowed.includes(key))
  );
};

// Validate combo details and included dishes
const validateCombo = async (data) => {
  if (!data.name || !data.name.trim()) {
    throw new Error("Combo name is required");
  }

  if (!Array.isArray(data.dishes) || data.dishes.length < 1) {
    throw new Error("Select at least one dish");
  }

  if (
    data.dishes.some((id) => !mongoose.Types.ObjectId.isValid(id))
  ) {
    throw new Error("Invalid dish ID");
  }

  if (
    data.offerPrice === undefined ||
    !Number.isFinite(Number(data.offerPrice)) ||
    Number(data.offerPrice) < 0
  ) {
    throw new Error("Enter a valid combo price");
  }

  const uniqueIds = [...new Set(data.dishes.map(String))];

  if (uniqueIds.length !== data.dishes.length) {
    throw new Error("Duplicate dishes are not allowed");
  }

  const availableDishes = await Dish.countDocuments({
    _id: { $in: uniqueIds },
    available: true,
  });

  if (availableDishes !== uniqueIds.length) {
    throw new Error("One or more selected dishes are unavailable");
  }
};

// GET active combos for customers
router.get("/", async (req, res) => {
  try {
    const combos = await Combo.find({ active: true })
      .populate("dishes", "name price image isVeg available")
      .sort({ createdAt: -1 });

    res.status(200).json(combos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET all combos for admin
// Keep this route before /:id
router.get("/admin", auth, async (req, res) => {
  try {
    const combos = await Combo.find()
      .populate("dishes", "name price image isVeg available")
      .sort({ createdAt: -1 });

    res.status(200).json(combos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ADD combo
router.post("/", auth, async (req, res) => {
  try {
    const data = pickCombo(req.body);

    await validateCombo(data);

    const combo = await Combo.create({
      ...data,
      offerPrice: Number(data.offerPrice),
    });

    const populatedCombo = await Combo.findById(combo._id)
      .populate("dishes", "name price image isVeg available");

    res.status(201).json({
      message: "Combo added successfully",
      combo: populatedCombo,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// UPDATE combo
router.put("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid combo ID" });
    }

    const data = pickCombo(req.body);

    if (Object.keys(data).length === 0) {
      return res.status(400).json({ message: "No valid fields provided" });
    }

    await validateCombo(data);

    const combo = await Combo.findByIdAndUpdate(
      req.params.id,
      {
        ...data,
        ...(data.offerPrice !== undefined && {
          offerPrice: Number(data.offerPrice),
        }),
      },
      {
        returnDocument: "after",
        runValidators: true,
      }
    ).populate("dishes", "name price image isVeg available");

    if (!combo) {
      return res.status(404).json({ message: "Combo not found" });
    }

    res.json({
      message: "Combo updated successfully",
      combo,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE combo
router.delete("/:id", auth, async (req, res) => {
  try {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
      return res.status(400).json({ message: "Invalid combo ID" });
    }

    const combo = await Combo.findByIdAndDelete(req.params.id);

    if (!combo) {
      return res.status(404).json({ message: "Combo not found" });
    }

    res.json({ message: "Combo deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
