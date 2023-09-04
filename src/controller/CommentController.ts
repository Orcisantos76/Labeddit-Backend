import { Request, Response } from "express";
import { ZodError } from "zod";
import { CommentBusiness } from "../business/CommentBusiness";
import { BaseError } from "../errors/BaseError";
import { CreateCommentInputDTo, CreateCommentSchema } from "../dtos/Comment/createComment.dto";
import { EditCommentByIdInputDTO, EditCommentByIdOutputDTO, EditCommentByIdSchema } from "../dtos/Comment/editComment.dtos";
import { LikeOrDislikeCommentInputDTO, LikeOrDislikeCommentOutputDTO, LikeOrDislikeCommentSchema } from "../dtos/Comment/likeOrDislikeComment.dto";
import { DeleteCommentByIdInputDTO, DeleteCommentByIdOutputDTO, DeleteCommentByIdSchema } from "../dtos/Comment/deleteComment.dto";

export class CommentController {
    static deleteCommentById(arg0: string, deleteCommentById: any) {
        throw new Error("Method not implemented.");
    }
    static likeOrDislikeComment(arg0: string, likeOrDislikeComment: any) {
        throw new Error("Method not implemented.");
    }
    static editCommentById(arg0: string, editCommentById: any) {
        throw new Error("Method not implemented.");
    }
    static createComment(arg0: string, createComment: any) {
        throw new Error("Method not implemented.");
    }
    constructor(
        private commentBusiness: CommentBusiness
    ) { }

    public createComment = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: CreateCommentInputDTo = CreateCommentSchema.parse({
                postId: req.params.postId,
                content: req.body.content,
                token: req.headers.authorization
            })
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
    }
    public editCommentById = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: EditCommentByIdInputDTO = EditCommentByIdSchema.parse({
                postId: req.params.postId,
                commentId: req.params.commentId,
                content: req.body.content,
                token: req.headers.authorization
            })

            const output: EditCommentByIdOutputDTO = await this.commentBusiness.editCommentById(input)
            res.status(200).send(output)

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
    public deleteCommentById = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: DeleteCommentByIdInputDTO = DeleteCommentByIdSchema.parse({
                postId: req.params.postId,
                commentId: req.params.commentId,
                token: req.headers.authorization
            })

            const output: DeleteCommentByIdOutputDTO = await this.commentBusiness.deleteCommentById(input)
            res.status(200).send(output)

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
    public likeOrDislikeComment = async (req: Request, res: Response): Promise<void> => {
        try {
            const input: LikeOrDislikeCommentInputDTO = LikeOrDislikeCommentSchema.parse({
                postId: req.params.postId,
                commentId: req.params.commentId,
                token: req.headers.authorization,
                like: req.body.like
            })

            const output: LikeOrDislikeCommentOutputDTO = await this.commentBusiness.likeOrDislikeComment(input)
            res.status(200).send(output)

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
}