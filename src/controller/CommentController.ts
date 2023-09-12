import { Request, Response } from "express";
import { CommentBusiness } from "../business/CommentBusiness";
import { CreateCommentSchema } from "../dtos/comment/createComment.dto";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { GetCommentsSchema } from "../dtos/comment/getComments.dto";
import { EditCommentSchema } from "../dtos/comment/editComment.dto";
import { DeleteCommentSchema } from "../dtos/comment/deleteComment.dto";
import { LikeOrDislikeCommentSchema } from "../dtos/comment/likeOrDislikeComment.dto";
import { GetCommentsByUserNicknameSchema } from "../dtos/comment/getCommentsByUserNickname.dto";
import { GetCommentsByPostSchema } from "../dtos/comment/getCommentsByPost.dto";
import { GetCommentsLikesDislikesSchema } from "../dtos/comment/getCommentsLikesDislikes.dto";

export class CommentController {
  constructor(private commentBusiness: CommentBusiness) {}
  public createComment = async (req: Request, res: Response) => {
    try {
      const input = CreateCommentSchema.parse({
        postId: req.params.id,
        token: req.headers.authorization,
        content: req.body.content,
      });

      const output = await this.commentBusiness.createComment(input);

      res.status(201).send(output);
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

  public getComments = async (req: Request, res: Response) => {
    try {
      const input = GetCommentsSchema.parse({
        token: req.headers.authorization,
      });

      const output = await this.commentBusiness.getComments(input);

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

  public getCommentsByUserNickname = async (req: Request, res: Response) => {
    try {
      const input = GetCommentsByUserNicknameSchema.parse({
        nickname: req.params.nickname,
        token: req.headers.authorization,
      });

      const output = await this.commentBusiness.getCommentsByUserNickname(
        input
      );

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

  public getCommentsByPost = async (req: Request, res: Response) => {
    try {
      const input = GetCommentsByPostSchema.parse({
        postId: req.params.id,
        token: req.headers.authorization,
      });

      const output = await this.commentBusiness.getCommentsByPost(input);

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

  public editComment = async (req: Request, res: Response) => {
    try {
      const input = EditCommentSchema.parse({
        idToEdit: req.params.id,
        token: req.headers.authorization,
        content: req.body.content,
      });

      const output = await this.commentBusiness.editComment(input);

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

  public deleteComment = async (req: Request, res: Response) => {
    try {
      const input = DeleteCommentSchema.parse({
        idToDelete: req.params.id,
        token: req.headers.authorization,
      });

      const output = await this.commentBusiness.deleteComment(input);

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

  public likeOrDislikeComment = async (req: Request, res: Response) => {
    try {
      const input = LikeOrDislikeCommentSchema.parse({
        commentId: req.params.id,
        token: req.headers.authorization,
        like: req.body.like,
      });

      const output = await this.commentBusiness.likeOrDislikeComment(input);

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

  public getCommentsLikesDislikes = async (req: Request, res: Response) => {
    try {
      const input = GetCommentsLikesDislikesSchema.parse({
        token: req.headers.authorization,
      });

      const output = await this.commentBusiness.getCommentsLikesDislikes(input);

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
}
