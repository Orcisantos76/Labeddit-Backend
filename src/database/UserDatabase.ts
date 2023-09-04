import { LikeDislikeCommentDB, LikeDislikePostDB } from "../models/LikeOrDislike";
import { UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
    public static TABLE_USERS = "users";
    public static TABLE_LIKES_DISLIKES_POSTS = "likes_dislikes_posts";
    public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comments";
    public async getUsers(q: string | undefined): Promise<UserDB[]> {
        if (q) {
            const usersDB: UserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)
                .where("name", "LIKE", `%${q}%`)
            return usersDB as UserDB[]
        } else {
            const usersDB: UserDB[] = await BaseDatabase
                .connection(UserDatabase.TABLE_USERS)
            return usersDB as UserDB[]
        }
    }

    public async getUserByName( name: string): Promise<UserDB | undefined> {
        const [result]: UserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where({ name: name })

        return result as UserDB | undefined
    }

    public async getUserByEmail(email: string): Promise<UserDB | undefined> {
        const [result]: UserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where({ email: email })

        return result as UserDB | undefined
    }

    public async getUserById(id: string): Promise<UserDB | undefined> {
        const [result]: UserDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .where({ id: id })

        return result as UserDB | undefined
    }

    public async getLikesDislikesFromPostsByUserId(id: string): Promise<LikeDislikePostDB[]> {

        const result: LikeDislikePostDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_LIKES_DISLIKES_POSTS)
            .where({
                user_id: id
            })

        return result as LikeDislikePostDB[]
    }

    public async getLikesDislikesFromCommentsByUserId(id: string): Promise<LikeDislikeCommentDB[]> {

        const result: LikeDislikePostDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
            .where({
                user_id: id
            })

        return result as LikeDislikeCommentDB[]
    }

    public async getLikesDislikesFromCommentsOnPostIdByUserId(id: string, postId: string): Promise<LikeDislikeCommentDB[]> {

        const result: LikeDislikePostDB[] = await BaseDatabase
            .connection(UserDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
            .where({
                user_id: id,
                post_id: postId
            })

        return result as LikeDislikeCommentDB[]
    }

    public async insertUser(newUserDB: UserDB): Promise<void> {
        await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .insert(newUserDB)
    }

    public async editUserById(userDB: UserDB): Promise<void> {
        await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .update(userDB)
            .where({ id: userDB.id })
    }

    public async deleteUserById(id: string): Promise<void> {
        await BaseDatabase
            .connection(UserDatabase.TABLE_USERS)
            .del().where({ id: id })
    }
}