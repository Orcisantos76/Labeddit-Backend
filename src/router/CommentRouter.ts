import express from "express"
import { CommentController } from "../controller/CommentController"
import { CommentBusiness } from "../business/CommentBusiness"
import { CommentDatabase } from "../database/CommentDatabase"
import { PostDatabase } from "../database/PostDatabase"
import { IdGenerator } from "../services/IdGenerator"
import { TokenManager } from "../services/TokenManager"

export const commentRouter = express.Router()

const commetController = new CommentController(
    new CommentBusiness(
        new CommentDatabase(),
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager()
    )
)

commentRouter.post("/:postId/comments", CommentController.createComment)
commentRouter.put("/:postId/comments/:commentId", CommentController.editCommentById)
commentRouter.put("/:postId/comments/:commentId/like", CommentController.likeOrDislikeComment)
commentRouter.delete("/:postId/comments/:commentId", CommentController.deleteCommentById)