import z from "zod";
import { CommentModel } from "../../models/Comment";

export interface GetCommentsByPostInputDTO {
  postId: string;
  token: string;
}

export type GetCommentsByPostOutputDTO = CommentModel | CommentModel[];

export const GetCommentsByPostSchema = z
  .object({
    postId: z
      .string({
        required_error: "'postId' é obrigatório",
        invalid_type_error: "'postId' deve ser do tipo string",
      })
      .min(1, "'postId' deve possuir no mínimo 1 caractere"),
    token: z
      .string({
        required_error: "'token' é obrigatória",
        invalid_type_error: "'token' deve ser do tipo string",
      })
      .min(1, "'token' deve possuir no mínimo 1 caractere"),
  })
  .transform((data) => data as GetCommentsByPostInputDTO);
