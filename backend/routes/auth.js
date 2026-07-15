import express from "express";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

import user from "../models/User.js";
import { protect} from "../middleware/auth.js";

const router = express.Router();

function createToken (user){
  return jwt.sign({ id: user._id }, { role: user.role }, process.env.JWT_SECRET, {
    expiresIn: "7d"
  });
}

function sendAuth(res ,user){
  res.json({
    token:createToken(user),
    user: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role
    }
  });
}

router.post("/register", async (req, res)=>{
  try{
    const { name, email, passsword} = req.body;
    const exists = await user.findOne({ email });
    if(exists){
      return res.status(400).json({ message: "User already exists" });
    }
    const hashedPassword = await bcrypt.hash(passsword, 10);
    const user = await user.create({ name, email, password: hashedPassword });
    sendAuth(res, user);
  }
  catch(error){
    console.error("Error in /register route:", error);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/me", protect , (req,res) => {
  res.json({ user: req.user });
});

export default router;


