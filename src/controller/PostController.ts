import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { BaseError } from "../errors/BaseError";
import { ZodError } from "zod";
import { CreatePostInputDTO, CreatePostOutputDTO, CreatePostSchema } from "../dtos/Post/createPost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO, GetPostsSchema } from "../dtos/Post/getPosts.dto";
import { LikeOrDislikePostSchema } from "../dtos/Post/likeOrDislikePost.dto";

export class PostController {
    constructor(
        private postBusiness: PostBusiness
    ) { }

    public createPost = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: CreatePostInputDTO = CreatePostSchema.parse({
                content: req.body.content,
                token: req.headers.authorization
            })
            const output: CreatePostOutputDTO = await this.postBusiness.createPost(input)
            res.status(201).send(output)

        } catch (error) {
            console.log(error)

            if (error instanceof ZodError) {
                res.status(400).send(`${error.issues[0].path[0]}: ${error.issues[0].message}`)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado.")
            }
        }
    }
    public getPosts = async (req: Request, res: Response): Promise<void> => {

        try {
            const input = GetPostsSchema.parse({
                
                token: req.headers.authorization
            })

            const output: GetPostsOutputDTO = await this.postBusiness.getPosts(input)
            res.status(200).send(output)

        } catch (error) {
            console.log(error)

            if (error instanceof ZodError) {
                res.status(400).send(error.issues)
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message)
            } else {
                res.status(500).send("Erro inesperado.")
            }
        }
    }
    public likeOrDislikePost = async (req: Request, res: Response) => {
        try {
            const input = LikeOrDislikePostSchema.parse({
                token: req.headers.authorization,
                idToLikeOrDislike: req.params.id,
                like: req.body.like,
            });

            const output = await this.postBusiness.likeOrDislikePost(input);

            res.status(200).send(output);
        } catch (error) {
            console.log(error);

            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send("Unexpected Error");
            }
        }
    };
}