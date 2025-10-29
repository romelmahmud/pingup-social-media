import express from "express";
import { getUserData } from "../controllers/userController.js";
import { protect } from "../middleware/auth.js";

const userRouter = express.Router();

userRouter.get("/data", protect, getUserData);
