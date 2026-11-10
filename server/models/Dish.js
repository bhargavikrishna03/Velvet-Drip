
const mongoose = require("mongoose");

const CATEGORIES = [
  "Coffee",
  "Tea",
  "Drinks",
  "Snacks",
  "Desserts",
  "Fast Food",
];

const dishSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },

    description: {
      type: String,
      trim: true,
      maxlength: 300,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    category: {
      type: String,
      required: true,
      enum: CATEGORIES,
    },

    image: {
      type: String,
      trim: true,
    },

    isVeg: {
      type: Boolean,
      default: true,
    },

    available: {
      type: Boolean,
      default: true,
    },

    // New fields
    isFeatured: {
      type: Boolean,
      default: false,
    },

    isBestseller: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Dish", dishSchema);
