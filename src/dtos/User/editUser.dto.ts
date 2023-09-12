import z from "zod";

export interface EditUserInputDTO {
  idToEdit: string;
  token: string;
  nickname: string;
  email: string;
  password: string;
  avatar: string;
}

export interface EditUserOutputDTO {
  message: string;
}

export const EditUserSchema = z
  .object({
    idToEdit: z
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
    nickname: z
      .string({        
        invalid_type_error: "'nickname' deve ser do tipo string",
      })
      .regex(
        /^[a-zA-Z]{5,}$/,
        "'nickname' deve ter pelo menos 5 caracteres, sem espaços e sem caracteres especiais."
      )
      .optional(),
    email: z
      .string({
        invalid_type_error: "'email' deve ser do tipo string",
      })
      .email("'email' inválido")
      .optional(),
    password: z
      .string({
        invalid_type_error: "'password' deve ser do tipo string",
      })
      .regex(
        /^(?=.*[A-Za-z]{5})(?=.*\d{2}).{7,}$/,
        "'password' deve ter pelo menos 7 caracteres, incluindo pelo menos 2 números e 5 letras."
      )
      .optional(),
    avatar: z
      .string({
        invalid_type_error: "'avatar' deve ser do tipo string",
      })
      .regex(/^https?:\/\/(www\.)?[\w-]+\.[\w.-]{2,}(\/\S*)?$/
      , "'avatar' deve ser um link válido.")
      .optional(),
  })
  .transform((data) => data as EditUserInputDTO);
