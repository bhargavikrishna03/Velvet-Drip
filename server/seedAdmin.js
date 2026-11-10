require("dotenv").config();
const mongoose=require("mongoose");
const bcrypt=require("bcryptjs");
const Admin=require("./models/Admin");

(async ()=>{
    await mongoose.connect(process.env.MONGO_URI);
    await Admin.create({
        username:"owner",
        password:await bcrypt.hash("KrishnaEku@2425",10),
    })
    console.log("Admin created!");
    process.exit(0);
})();
