import z from "zod";

export interface LoginInputDTO {
  email: string;
  password: string;
}

export interface LoginOutputDTO {
  message: string;
  token: string;
}

export const LoginSchema = z
  .object({
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
  })
  .transform((data) => data as LoginInputDTO);
