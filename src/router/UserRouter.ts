import express from "express";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";
import { UserBusiness } from "../business/UserBusiness";
import { UserDatabase } from "../database/UserDatabase";
import { UserController } from "../controller/UserController";

export const userRouter = express.Router();

const userController = new UserController(
  new UserBusiness(
    new UserDatabase(),
    new IdGenerator(),
    new TokenManager(),
    new HashManager()
  )
);

  userRouter.get("/", userController.getUsers)
  userRouter.post("/signup", userController.signup)
  userRouter.post("/login", userController.login)
  userRouter.put("/:id", userController.editUser)