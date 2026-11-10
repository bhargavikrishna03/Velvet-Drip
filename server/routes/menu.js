
const router = require("express").Router();
const Dish = require("../models/Dish");
const auth = require("../middleware/auth");

// Allowed dish fields
const pickDish = (body) => {
  const allowed = [
    "name",
    "description",
    "price",
    "category",
    "image",
    "isVeg",
    "available",
    "isFeatured",
    "isBestseller",
  ];

  return Object.fromEntries(
    Object.entries(body).filter(([key]) =>
      allowed.includes(key)
    )
  );
};

// GET all dishes
router.get("/", async (req, res) => {
  try {
    const dishes = await Dish.find().sort({
      category: 1,
      name: 1,
    });

    res.status(200).json(dishes);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST - Add dish
router.post("/", auth, async (req, res) => {
  try {
    const dishData = pickDish(req.body);

    const dish = await Dish.create(dishData);

    res.status(201).json({
      message: "Dish added successfully",
      dish,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT - Update dish
router.put("/:id", auth, async (req, res) => {
  try {
    const dishData = pickDish(req.body);

    const dish = await Dish.findByIdAndUpdate(
      req.params.id,
      dishData,
      {
        returnDocument: "after",
        runValidators: true,
      }
    );

    if (!dish) {
      return res.status(404).json({
        message: "Dish not found",
      });
    }

    res.json({
      message: "Dish updated successfully",
      dish,
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE - Remove dish
router.delete("/:id", auth, async (req, res) => {
  try {
    const dish = await Dish.findByIdAndDelete(req.params.id);

    if (!dish) {
      return res.status(404).json({
        message: "Dish not found",
      });
    }

    res.json({
      message: "Dish deleted successfully",
    });
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
