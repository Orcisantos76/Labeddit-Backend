import z from "zod";

export const LoginSchema = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});

export type LoginInputDTO = z.infer<typeof LoginSchema>;

export const LoginSchemaOutput = z.object({
    message: z.string().min(1),
    token: z.string().min(6)
});

export type loginOutputDTO = z.infer<typeof LoginSchemaOutput>