import { z } from "zod"

export const CreatePostSchema = z.object({
    content: z.string().min(1),
    token: z.string().min(1)
})

export type CreatePostInputDTO = z.infer<typeof CreatePostSchema>

export const CreatePostSchemaOutput = z.object({
    message: z.string().min(1)
})

export type CreatePostOutputDTO = z.infer<typeof CreatePostSchemaOutput>
