
const router = require("express").Router();
const crypto = require("crypto");
const mongoose = require("mongoose");

const Order = require("../models/Order");
const Dish = require("../models/Dish");
const Combo = require("../models/Combo");
const auth = require("../middleware/auth");

// ========================================
// POST: Create a new customer order
// ========================================
router.post("/", async (req, res) => {
  try {
    const {
      customerName,
      phone,
      address,
      items,
      instructions,
    } = req.body;

    if (!customerName || !phone || !address) {
      return res.status(400).json({
        message: "Please provide customer name, phone and address.",
      });
    }

    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Please enter a valid 10-digit phone number.",
      });
    }

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "Your order must contain at least one item.",
      });
    }

    const dishIds = [];
    const comboIds = [];

    // Validate IDs and quantities
    for (const item of items) {
      const type =
        item.itemType || (item.comboId ? "combo" : "dish");

      if (
        !Number.isInteger(item.quantity) ||
        item.quantity < 1
      ) {
        return res.status(400).json({
          message: "Invalid item quantity.",
        });
      }

      if (type === "dish") {
        if (
          !item.dishId ||
          !mongoose.Types.ObjectId.isValid(item.dishId)
        ) {
          return res.status(400).json({
            message: "Invalid dish ID.",
          });
        }

        dishIds.push(item.dishId);
      } else if (type === "combo") {
        if (
          !item.comboId ||
          !mongoose.Types.ObjectId.isValid(item.comboId)
        ) {
          return res.status(400).json({
            message: "Invalid combo ID.",
          });
        }

        comboIds.push(item.comboId);
      } else {
        return res.status(400).json({
          message: "Invalid item type.",
        });
      }
    }

    // Fetch actual dishes from MongoDB
    const dishes = await Dish.find({
      _id: { $in: dishIds },
    });

    const dishMap = new Map(
      dishes.map((dish) => [dish._id.toString(), dish])
    );

    // Fetch actual combos and their included dishes
    const combos = await Combo.find({
      _id: { $in: comboIds },
    }).populate("dishes", "name available");

    const comboMap = new Map(
      combos.map((combo) => [combo._id.toString(), combo])
    );

    const orderItems = [];

    // Build trusted order items
    for (const item of items) {
      const type =
        item.itemType || (item.comboId ? "combo" : "dish");

      if (type === "dish") {
        const dish = dishMap.get(item.dishId.toString());

        if (!dish) {
          return res.status(404).json({
            message: "Dish not found.",
          });
        }

        if (!dish.available) {
          return res.status(400).json({
            message: `${dish.name} is currently unavailable.`,
          });
        }

        orderItems.push({
          itemType: "dish",
          dishId: dish._id,
          name: dish.name,
          price: dish.price,
          quantity: item.quantity,
        });
      }

      if (type === "combo") {
        const combo = comboMap.get(item.comboId.toString());

        if (!combo) {
          return res.status(404).json({
            message: "Combo offer not found.",
          });
        }

        if (!combo.active) {
          return res.status(400).json({
            message: `${combo.name} is currently unavailable.`,
          });
        }

        if (
          !combo.dishes ||
          combo.dishes.length === 0 ||
          combo.dishes.some((dish) => !dish.available)
        ) {
          return res.status(400).json({
            message: `${combo.name} contains an unavailable dish.`,
          });
        }

        orderItems.push({
          itemType: "combo",
          comboId: combo._id,
          name: combo.name,
          price: combo.offerPrice,
          quantity: item.quantity,
        });
      }
    }

    // Calculate total using database prices
    const totalAmount = orderItems.reduce(
      (total, item) =>
        total + item.price * item.quantity,
      0
    );

    // Generate tracking token
    const trackingToken = crypto.randomBytes(24).toString("hex");

    // Save order
    const newOrder = await Order.create({
      customerName: customerName.trim(),
      phone,
      address: address.trim(),
      items: orderItems,
      totalAmount,
      trackingToken,
      instructions: instructions || "",
    });

    return res.status(201).json({
      message: "Order placed successfully!",
      order: newOrder,
    });

  } catch (error) {
    console.error("Create order error:", error);

    return res.status(500).json({
      message: "Unable to place order.",
      error: error.message,
    });
  }
});

// ========================================
// GET: Retrieve all orders (Admin)
// ========================================
router.get("/", auth, async (req, res) => {
  try {
    const orders = await Order.find().sort({
      createdAt: -1,
    });

    return res.status(200).json(orders);
  } catch (error) {
    console.error("Fetch orders error:", error);

    return res.status(500).json({
      message: "Unable to fetch orders.",
    });
  }
});

// ========================================
// GET: Track customer order using token
// ========================================
router.get("/track/:token", async (req, res) => {
  try {
    const token = req.params.token.trim();

    const order = await Order.findOne({
      trackingToken: token,
    }).select("items totalAmount status paymentStatus createdAt");

    if (!order) {
      return res.status(404).json({
        message: "Order not found. Please check your tracking token.",
      });
    }

    return res.status(200).json({
      message: "Order retrieved successfully!",
      order: {
        items: order.items,
        totalAmount: order.totalAmount,
        status: order.status,
        paymentStatus: order.paymentStatus,
        createdAt: order.createdAt,
      },
    });
  } catch (error) {
    console.error("Tracking error:", error);

    return res.status(500).json({
      message: "Unable to track this order.",
    });
  }
});

// ========================================
// PATCH: Update order status (Admin)
// ========================================
router.patch("/:id/status", auth, async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = [
      "Pending",
      "Confirmed",
      "Preparing",
      "Ready",
      "Delivered",
      "Cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        message: "Invalid order status.",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!order) {
      return res.status(404).json({
        message: "Order not found.",
      });
    }

    return res.status(200).json({
      message: "Order status updated successfully!",
      order,
    });
  } catch (error) {
    console.error("Update order status error:", error);

    return res.status(500).json({
      message: "Unable to update order status.",
    });
  }
});

module.exports = router;
