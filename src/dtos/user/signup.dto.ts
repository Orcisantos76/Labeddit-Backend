import z from "zod";

export interface SignupInputDTO {
  nickname: string;
  email: string;
  password: string;
  avatar: string;
}

export interface SignupOutputDTO {
  message: string;
  token: string;
}

export const SignupSchema = z
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
    email: z
      .string({
        required_error: "'email' é obrigatório",
        invalid_type_error: "'email' deve ser do tipo string",
      })
      .email("'email' inválido"),
    password: z
      .string({
        required_error: "'password' é obrigatório",
        invalid_type_error: "'password' deve ser do tipo string",
      })
      .regex(
        /^(?=.*[A-Za-z]{5})(?=.*\d{2}).{7,}$/,
        "'password' deve ter pelo menos 7 caracteres, incluindo pelo menos 2 números e 5 letras."
      ),
    avatar: z
      .string({
        invalid_type_error: "'avatar' deve ser do tipo string",
      })
      .regex(/^(https?:\/\/www\.)/, "'avatar' deve ser um link válido.")
      .optional(),
  })
  .transform((data) => data as SignupInputDTO);
