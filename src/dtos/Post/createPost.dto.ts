import z from "zod";

export interface CreatePostInputDTO {
  token: string;
  content: string;
}

export type CreatePostOutputDTO = {
  message: string;
}

export const CreatePostSchema = z
  .object({
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
  .transform((data) => data as CreatePostInputDTO);
