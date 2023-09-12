import z from "zod";
import { CommentLikeDislikeModel } from "../../models/Comment";

export interface GetCommentsLikesDislikesInputDTO {    
  token: string;
}

export type GetCommentsLikesDislikesOutputDTO = CommentLikeDislikeModel[];

export const GetCommentsLikesDislikesSchema = z
  .object({
    token: z
      .string({
        required_error: "'token' é obrigatória",
        invalid_type_error: "'token' deve ser do tipo string",
      })
      .min(1, "'token' deve possuir no mínimo 1 caractere"),
  })
  .transform((data) => data as GetCommentsLikesDislikesInputDTO);
