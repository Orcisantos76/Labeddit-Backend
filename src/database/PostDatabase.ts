import { BaseDatabase } from "./BaseDatabase";

export class PostDatabase extends BaseDatabase{
    public static TABLE_POSTS = "posts";
    public static TABLE_COMMENTS = "comments_posts";
    public static TABLE_LIKES_DISLIKES = "likes_dislikes_posts"
}