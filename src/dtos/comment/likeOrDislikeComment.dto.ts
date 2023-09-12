import z from "zod";

export interface LikeOrDislikeCommentInputDTO {
  commentId: string;
  token: string;
  like: boolean;
}

export type LikeOrDislikeCommentOutputDTO = undefined;

export const LikeOrDislikeCommentSchema = z
  .object({
    commentId: z
      .string({
        required_error: "'id' é obrigatória",
        invalid_type_error: "'id' deve ser do tipo string",
      })
      .min(1, "'id' deve possuir no mínimo 1 caractere"),
    token: z
      .string({
        required_error: "'token' é obrigatória",
        invalid_type_error: "'token' deve ser do tipo string",
      })
      .min(1, "'token' deve possuir no mínimo 1 caractere"),
    like: z.boolean().refine((value) => typeof value === "boolean", {
      message: "'like' deve ser um valor booleano",
    }),
  })
  .transform((data) => data as LikeOrDislikeCommentInputDTO);
