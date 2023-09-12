import { Request, Response } from "express";
import { PostBusiness } from "../business/PostBusiness";
import { CreatePostSchema } from "../dtos/post/createPost.dto";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { GetPostsSchema } from "../dtos/post/getPosts.dto";
import { EditPostSchema } from "../dtos/post/editPost.dto";
import { DeletePostSchema } from "../dtos/post/deletePost.dto";
import { LikeOrDislikePostSchema } from "../dtos/post/likeOrDislikePost.dto";
import { GetCommentsByUserNicknameSchema } from "../dtos/comment/getCommentsByUserNickname.dto";
import { GetPostsLikesDislikesSchema } from "../dtos/post/getPostsLikesDislikes.dto";

export class PostController {
  constructor(private postBusiness: PostBusiness) {}
  public createPost = async (req: Request, res: Response) => {
    try {
      const input = CreatePostSchema.parse({
        token: req.headers.authorization,
        content: req.body.content,
      });

      const output = await this.postBusiness.createPost(input);

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

  public getPosts = async (req: Request, res: Response) => {
    try {
      const input = GetPostsSchema.parse({
        token: req.headers.authorization,
      });

      const output = await this.postBusiness.getPosts(input);

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

  public getPostsByUserNickname = async (req: Request, res: Response) => {
    try {
      const input = GetCommentsByUserNicknameSchema.parse({
        nickname: req.params.nickname,
        token: req.headers.authorization,
      });

      const output = await this.postBusiness.getPostsByUserNickname(input);

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

  public deletePost = async (req: Request, res: Response) => {
    try {
      const input = DeletePostSchema.parse({
        idToDelete: req.params.id,
        token: req.headers.authorization,
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
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public likeOrDislikePost = async (req: Request, res: Response) => {
    try {
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
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public getPostsLikesDislikes = async (req: Request, res: Response) => {
    try {
      const input = GetPostsLikesDislikesSchema.parse({
        token: req.headers.authorization,
      });

      const output = await this.postBusiness.getPostsLikesDislikes(input);

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
