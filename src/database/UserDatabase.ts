import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase{
    public static TABLE_USERS = "users";
    public static TABLE_LIKES_DISLIKES_POSTS = "likes_dislikes_posts";
    public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comments";
}