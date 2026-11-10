require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const orderRoutes = require("./routes/orderRoutes");
const comboRoutes = require("./routes/comboRoutes");

app.use(cors());
app.use(express.json());

app.use("/api/menu", require("./routes/menu"));
app.use("/api/auth", require("./routes/auth"));
app.use("/api/orders", orderRoutes);
app.use("/api/combos", comboRoutes);

const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => console.log(`Server running on ${PORT}`));
  })
  .catch((err) => console.error("MongoDB error:", err.message));