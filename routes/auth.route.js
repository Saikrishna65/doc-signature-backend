import express from "express";
import {
  isAuthencated,
  login,
  logout,
  register,
} from "../controllers/auth.controller.js";
import userAuth from "../middleware/userAuth.middleware.js";

const authRouter = express.Router();

authRouter.post("/register", register);
authRouter.post("/login", login);
authRouter.post("/logout", logout);
authRouter.get("/is-auth", userAuth, isAuthencated);

export default authRouter;
