import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { BaseError } from "../errors/BaseError";
import { ZodError } from "zod";
import { CreatePostInputDTO, CreatePostOutputDTO, CreatePostSchema } from "../dtos/Post/createPost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO, GetPostsSchema } from "../dtos/Post/getPosts.dto";
import { LikeOrDislikePostSchema } from "../dtos/Post/likeOrDislikePost.dto";
import { EditPostSchema } from "../dtos/Post/editPost.dto";
import { DeletePostSchema } from "../dtos/Post/deletePost.dto";

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
                res.status(400).send(error.issues)
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
    public editPost = async (req: Request, res: Response) => {
        try {
            const input = EditPostSchema.parse({
                idToEdit: req.params.id,
                token: req.headers.authorization,
                content: req.body.content,
            });

            const output = await this.postBusiness.editPost(input);

            res.status(200).send(output);
        } catch (error) {
            console.log(error);

            if (error instanceof ZodError) {
                res.status(400).send(error.issues);
            } else if (error instanceof BaseError) {
                res.status(error.statusCode).send(error.message);
            } else {
                res.status(500).send("Erro inesperado");
            }
        }
    };
    public likeOrDislikePost = async (req: Request, res: Response) => {
        try {
            console.log(req.params.id)
            const input = LikeOrDislikePostSchema.parse({
                postId: req.params.id,
                token: req.headers.authorization,
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
    public detelePost = async (req: Request, res: Response) => {
        try {
            const input = DeletePostSchema.parse({
                token: req.headers.authorization,
                idToDelete: req.params.id,
            });

            const output = await this.postBusiness.deletePost(input);

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