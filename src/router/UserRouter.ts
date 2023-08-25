import  express  from "express"
import { UserController } from "../controller/UserController"
import { UserBusiness } from "../business/UserBusiness"
import { UserDatabase } from "../database/UserDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { CommentDatabase } from "../database/CommentDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"
import { HashManager } from "../services/HashManager"

export const userRouter = express.Router()

const userController = new UserController(
    new UserBusiness(
        new UserDatabase(),
        new PostDatabase(),
        new CommentDatabase(),
        new IdGenerator(),
        new TokenManager(),
        new HashManager()
    )
)