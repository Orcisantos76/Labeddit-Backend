import z from "zod";

export interface CreateCommentInputDTO {
  postId: string;
  token: string;
  content: string;
}

export type CreateCommentOutputDTO = {
  message: string;
};

export const CreateCommentSchema = z
  .object({
    postId: z
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
    content: z
      .string({
        required_error: "'content' é obrigatória",
        invalid_type_error: "'content' deve ser do tipo string",
      })
      .min(1, "'content' deve possuir no mínimo 1 caractere"),
  })
  .transform((data) => data as CreateCommentInputDTO);
