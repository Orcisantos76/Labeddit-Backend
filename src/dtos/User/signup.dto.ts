import z from "zod";

export const SignupSchema = z.object({
    name: z.string().min(2),
    email: z.string().email(),
    password: z.string().min(6),
});

export type SignupInputDTO = z.infer<typeof SignupSchema>;

export const SignupSchemaOutput = z.object({
    message: z.string().min(1),
    token: z.string().min(1)
});

export type SignupOutputDTO = z.infer<typeof SignupSchemaOutput>;
