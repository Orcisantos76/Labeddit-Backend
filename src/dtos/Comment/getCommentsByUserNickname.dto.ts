import z from "zod";
import { CommentModel } from "../../models/Comment";

export interface GetCommentsByUserNicknameInputDTO {
  nickname: string;
  token: string;
}

export type GetCommentsByUserNicknameOutputDTO =  CommentModel | CommentModel[];

export const GetCommentsByUserNicknameSchema = z
  .object({
    nickname: z
      .string({
        required_error: "'nickname' é obrigatório",
        invalid_type_error: "'nickname' deve ser do tipo string",
      })
      .regex(
        /^[a-zA-Z]{5,}$/,
        "'nickname' deve ter pelo menos 5 caracteres, sem espaços e sem caracteres especiais."
      ),
    token: z
      .string({
        required_error: "'token' é obrigatória",
        invalid_type_error: "'token' deve ser do tipo string",
      })
      .min(1, "'token' deve possuir no mínimo 1 caractere"),
  })
  .transform((data) => data as GetCommentsByUserNicknameInputDTO);
