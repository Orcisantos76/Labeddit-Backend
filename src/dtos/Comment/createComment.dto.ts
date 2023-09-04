import { z } from "zod"

export const CreateCommentSchema = z.object({
    postId: z.string().min(1),
    content: z.string().min(1),
    token: z.string().min(1)
})

export type CreateCommentInputDTo = z.infer<typeof CreateCommentSchema>

export const CreateCommentOutputDTo = z.object({
    message: z.string().min(1)
})

export type CreateCommentOutputDTo = z.infer<typeof CreateCommentOutputDTo>