import z from "zod";
import { PostLikeDislikeModel } from "../../models/Post";

export interface GetPostsLikesDislikesInputDTO {    
  token: string;
}

export type GetPostsLikesDislikesOutputDTO = PostLikeDislikeModel[];

export const GetPostsLikesDislikesSchema = z
  .object({
    token: z
      .string({
        required_error: "'token' é obrigatória",
        invalid_type_error: "'token' deve ser do tipo string",
      })
      .min(1, "'token' deve possuir no mínimo 1 caractere"),
  })
  .transform((data) => data as GetPostsLikesDislikesInputDTO);
