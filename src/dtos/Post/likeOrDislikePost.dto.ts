import z from "zod";

export const LikeOrDislikePostSchema = z.object({
    token: z.string().min(1),
    postId: z.string().min(1),
    like: z.boolean(),
});

export type LikeOrDislikePostInputDTO = z.infer<typeof LikeOrDislikePostSchema>;

export type LikeOrDislikePostOutputDTO = undefined