const mongoose = require("mongoose");

const comboSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
    image: {
      type: String,
      trim: true,
    },
    dishes: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Dish",
        required: true,
      },
    ],
    offerPrice: {
      type: Number,
      required: true,
      min: 0,
    },
    active: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Combo", comboSchema);