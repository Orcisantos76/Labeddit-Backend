import { BaseDatabase } from "./BaseDatabase"

export class CommentDatabase extends BaseDatabase{
    public static TABLE_USERS = "users"
    public static TABLE_COMMENTS = "comments_posts"
    public static TABLE_LIKES_DISLIKES = "likes_dislikes_comments"
}