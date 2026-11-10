const router=require("express").Router();
const bcrypt=require("bcryptjs");
const jwt=require("jsonwebtoken");
const Admin=require("../models/Admin");

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (typeof username !== "string" || typeof password !== "string") {
      return res.status(400).json({ message: "Invalid input" });
    }

    const admin = await Admin.findOne({ username });
    if (!admin || !(await bcrypt.compare(password, admin.password))) {
      return res.status(401).json({ message: "Invalid credentials!" });
    }

    const token = jwt.sign({ id: admin._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports=router;
