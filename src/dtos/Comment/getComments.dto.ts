import z from "zod";
import { CommentModel } from "../../models/Comment";

export interface GetCommentsInputDTO {
  q:  string;
  token: string;
}

export type GetCommentsOutputDTO = CommentModel[];

export const GetCommentsSchema = z
  .object({
    q: z
    .string({
      invalid_type_error: "'q' deve ser do tipo string",
    })
    .min(1, "'q' deve possuir no mínimo 1 caractere")
    .optional(),
    token: z
      .string({
        required_error: "'token' é obrigatória",
        invalid_type_error: "'token' deve ser do tipo string",
      })
      .min(1, "'token' deve possuir no mínimo 1 caractere"),
  })
  .transform((data) => data as GetCommentsInputDTO);
