import express from 'express'
import { IdGenerator } from '../services/IdGenerator'
import { TokenManager } from '../services/TokenManager'
import { PostDatabase } from '../database/PostDatabase'
import { PostBusiness } from '../business/PostBusiness'
import { PostController } from '../controller/PostController'

export const postRouter = express.Router()

const postController = new PostController(
    new PostBusiness(
        new PostDatabase(),
        new IdGenerator(),
        new TokenManager()
    )
)

postRouter.post("/", postController.createPost);

postRouter.get("/", postController.getPosts);
postRouter.get("/:nickname", postController.getPostsByUserNickname);

postRouter.put("/:id", postController.editPost);
postRouter.delete("/:id", postController.deletePost);

postRouter.put("/:id/like", postController.likeOrDislikePost);

postRouter.get("/likes/post", postController.getPostsLikesDislikes);
