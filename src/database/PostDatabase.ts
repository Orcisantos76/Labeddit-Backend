import { CommentWithCreatorDB } from "../models/Comments";
import { LikeDislikePostDB, POST_LIKE } from "../models/LikeOrDislike";
import { PostDB, PostWithCommentsDB, PostWithCreatorDb } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { UserDatabase } from "./UserDatabase";


export class PostDatabase extends BaseDatabase {
    public static TABLE_POSTS = "posts";
    public static TABLE_COMMENTS = "comments_posts";
    public static TABLE_LIKES_DISLIKES = "likes_dislikes_posts"

    public async getPostsWithCreator(query: string | undefined): Promise<PostWithCreatorDb[]>{

        if (query) {
        const result:PostWithCreatorDb[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .where("content", "LIKE", `%${query}%`)
            .select(
                `${PostDatabase.TABLE_POSTS}.id`,
                `${PostDatabase.TABLE_POSTS}.content`,
                `${PostDatabase.TABLE_POSTS}.comments`,
                `${PostDatabase.TABLE_POSTS}.likes`,
                `${PostDatabase.TABLE_POSTS}.dislikes`,
                `${PostDatabase.TABLE_POSTS}.created_at`,
                `${PostDatabase.TABLE_POSTS}.updated_at`,
                `${PostDatabase.TABLE_POSTS}.creator_id`,
                `${UserDatabase.TABLE_USERS}.name AS creator_name`
            )
            .join(`${UserDatabase.TABLE_USERS}`, `${PostDatabase.TABLE_POSTS}.creator_id`, "=", `${UserDatabase.TABLE_USERS}.id`)

        return result as PostWithCreatorDb[]

        } else {
            const result: PostWithCreatorDb[] = await BaseDatabase
                .connection(PostDatabase.TABLE_POSTS)
                .select(
                    `${PostDatabase.TABLE_POSTS}.id`,
                    `${PostDatabase.TABLE_POSTS}.content`,
                    `${PostDatabase.TABLE_POSTS}.comments`,
                    `${PostDatabase.TABLE_POSTS}.likes`,
                    `${PostDatabase.TABLE_POSTS}.dislikes`,
                    `${PostDatabase.TABLE_POSTS}.create_at`,
                    `${PostDatabase.TABLE_POSTS}.update_at`,
                    `${PostDatabase.TABLE_POSTS}.creator_id`,
                    `${UserDatabase.TABLE_USERS}.name AS creator_name`
                )
                .join(`${UserDatabase.TABLE_USERS}`, `${PostDatabase.TABLE_POSTS}.creator_id`, "=", `${UserDatabase.TABLE_USERS}.id`)

            return result as PostWithCreatorDb[]
        
        }
    }
    public async getPostById(id: string): Promise<PostDB | undefined> {
        const [result]: PostDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .where({ id: id })

        return result as PostDB | undefined
    }

    public async getPostWithCreatorById(id: string): Promise<PostWithCreatorDb | undefined> {

        const [result]: PostWithCreatorDb[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                `${PostDatabase.TABLE_POSTS}.id`,
                `${PostDatabase.TABLE_POSTS}.content`,
                `${PostDatabase.TABLE_POSTS}.comments`,
                `${PostDatabase.TABLE_POSTS}.likes`,
                `${PostDatabase.TABLE_POSTS}.dislikes`,
                `${PostDatabase.TABLE_POSTS}.create_at`,
                `${PostDatabase.TABLE_POSTS}.update_at`,
                `${PostDatabase.TABLE_POSTS}.creator_id`,
                `${UserDatabase.TABLE_USERS}.name AS creator_name`
            )
            .join(`${UserDatabase.TABLE_USERS}`, `${PostDatabase.TABLE_POSTS}.creator_id`, "=", `${UserDatabase.TABLE_USERS}.id`)
            .where({ [`${PostDatabase.TABLE_POSTS}.id`]: id })

        return result as PostWithCreatorDb | undefined

    }

    public async getPostWithCreatorAndCommentsById(id: string): Promise<PostWithCommentsDB | undefined> {

        const [PostWithCreatorDB]: PostWithCommentsDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .select(
                `${PostDatabase.TABLE_POSTS}.id`,
                `${PostDatabase.TABLE_POSTS}.content`,
                `${PostDatabase.TABLE_POSTS}.comments`,
                `${PostDatabase.TABLE_POSTS}.likes`,
                `${PostDatabase.TABLE_POSTS}.dislikes`,
                `${PostDatabase.TABLE_POSTS}.create_at`,
                `${PostDatabase.TABLE_POSTS}.update_at`,
                `${PostDatabase.TABLE_POSTS}.creator_id`,
                `${UserDatabase.TABLE_USERS}.name AS creator_name`
            )
            .join(`${UserDatabase.TABLE_USERS}`, `${PostDatabase.TABLE_POSTS}.creator_id`, "=", `${UserDatabase.TABLE_USERS}.id`)
            .where({ [`${PostDatabase.TABLE_POSTS}.id`]: id })

        const commentsDB: CommentWithCreatorDB[] = await BaseDatabase
            .connection(PostDatabase.TABLE_COMMENTS)
            .select(
                `${PostDatabase.TABLE_COMMENTS}.id`,
                `${PostDatabase.TABLE_COMMENTS}.content`,
                `${PostDatabase.TABLE_COMMENTS}.likes`,
                `${PostDatabase.TABLE_COMMENTS}.dislikes`,
                `${PostDatabase.TABLE_COMMENTS}.create_at`,
                `${PostDatabase.TABLE_COMMENTS}.update_at`,
                `${PostDatabase.TABLE_COMMENTS}.creator_id`,
                `${UserDatabase.TABLE_USERS}.name AS creator_name`
            )
            .join(`${UserDatabase.TABLE_USERS}`, `${PostDatabase.TABLE_COMMENTS}.creator_id`, "=", `${UserDatabase.TABLE_USERS}.id`)
            .where({ [`${PostDatabase.TABLE_COMMENTS}.post_id`]: id })

        const result: PostWithCommentsDB = { ...PostWithCreatorDB, comments_post: commentsDB }

        return result as PostWithCommentsDB | undefined
    }

    public async insertPost(newPostDB: PostDB): Promise<void> {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .insert(newPostDB)
    }

    public async updatePostById(postDB: PostDB): Promise<void> {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .update(postDB)
            .where({ id: postDB.id })
    }

    public async deletePostById(id: string): Promise<void> {
        await BaseDatabase
            .connection(PostDatabase.TABLE_POSTS)
            .del().where({ id: id })
    }

    public async getLikeDislikeFromPostById(likeDislikePostDB: LikeDislikePostDB): Promise<POST_LIKE | undefined> {

        const [result]: LikeDislikePostDB[] | undefined = await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .where({
                user_id: likeDislikePostDB.user_id,
                post_id: likeDislikePostDB.post_id
            })

        return result === undefined ? undefined : result && result.like === 1 ? POST_LIKE.ALREADY_LIKED : POST_LIKE.ALREADY_DISLIKED
    }

    public removeLikeDislikeFromPostById = async (likeDislikePostDB: LikeDislikePostDB): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .delete()
            .where({
                user_id: likeDislikePostDB.user_id,
                post_id: likeDislikePostDB.post_id
            })
    }

    public updateLikeDislikeFromPostById = async (likeDislikePostDB: LikeDislikePostDB): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .update(likeDislikePostDB)
            .where({
                user_id: likeDislikePostDB.user_id,
                post_id: likeDislikePostDB.post_id
            })
    }

    public insertLikeDislikeInPostById = async (likeDislikePostDB: LikeDislikePostDB): Promise<void> => {
        await BaseDatabase
            .connection(PostDatabase.TABLE_LIKES_DISLIKES)
            .insert(likeDislikePostDB)
    }

}