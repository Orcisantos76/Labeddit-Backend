import {
  COMMENT_LIKE,
  CommentDB,
  CommentDBWithCreatorName,
  LikeDislikeDB,
} from "../models/Comment";
import { PostDB } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";
import { PostDatabase } from "./PostDatabase";
import { UserDatabase } from "./UserDatabase";

export class CommentDatabase extends BaseDatabase {
  public static TABLE_COMMENTS = "comments";
  public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comments";
  public static TABLE_POSTS = "posts";

  public findPostById = async (id: string): Promise<PostDB | undefined> => {
    const [result] = await BaseDatabase.connection(PostDatabase.TABLE_POSTS)
      .select()
      .where({ id });

    return result as PostDB | undefined;
  };

  public insertComment = async (commentDB: CommentDB): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS).insert(
      commentDB
    );
  };

  public getCommentsWithCreatorName = async (): Promise<
    CommentDBWithCreatorName[]
  > => {
    const result = await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
      .select(
        `${CommentDatabase.TABLE_COMMENTS}.id`,
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
        `${CommentDatabase.TABLE_COMMENTS}.post_id`,
        `${CommentDatabase.TABLE_COMMENTS}.content`,
        `${CommentDatabase.TABLE_COMMENTS}.likes`,
        `${CommentDatabase.TABLE_COMMENTS}.dislikes`,
        `${CommentDatabase.TABLE_COMMENTS}.created_at`,
        `${CommentDatabase.TABLE_COMMENTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.nickname as creator_nickname`,
        `${UserDatabase.TABLE_USERS}.avatar as creator_avatar`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      );

    return result as CommentDBWithCreatorName[];
  };

  public getCommentsWithCreatorNameByNickname = async (
    nickname: string
  ): Promise<CommentDBWithCreatorName[]> => {
    const result = await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
      .select(
        `${CommentDatabase.TABLE_COMMENTS}.id`,
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
        `${CommentDatabase.TABLE_COMMENTS}.post_id`,
        `${CommentDatabase.TABLE_COMMENTS}.content`,
        `${CommentDatabase.TABLE_COMMENTS}.likes`,
        `${CommentDatabase.TABLE_COMMENTS}.dislikes`,
        `${CommentDatabase.TABLE_COMMENTS}.created_at`,
        `${CommentDatabase.TABLE_COMMENTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.nickname as creator_nickname`,
        `${UserDatabase.TABLE_USERS}.avatar as creator_avatar`
      )
      .where(`${UserDatabase.TABLE_USERS}.nickname`, nickname)
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      );

    return result as CommentDBWithCreatorName[];
  };

  public getCommentsWithCreatorNameById = async (
    postId: string
  ): Promise<CommentDBWithCreatorName[]> => {
    const result = await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
      .select(
        `${CommentDatabase.TABLE_COMMENTS}.id`,
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
        `${CommentDatabase.TABLE_COMMENTS}.post_id`,
        `${CommentDatabase.TABLE_COMMENTS}.content`,
        `${CommentDatabase.TABLE_COMMENTS}.likes`,
        `${CommentDatabase.TABLE_COMMENTS}.dislikes`,
        `${CommentDatabase.TABLE_COMMENTS}.created_at`,
        `${CommentDatabase.TABLE_COMMENTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.nickname as creator_nickname`,
        `${UserDatabase.TABLE_USERS}.avatar as creator_avatar`
      )
      .where({ post_id: postId })
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      );

    return result as CommentDBWithCreatorName[];
  };

  public findCommentById = async (
    id: string
  ): Promise<CommentDB | undefined> => {
    const [result] = await BaseDatabase.connection(
      CommentDatabase.TABLE_COMMENTS
    )
      .select()
      .where({ id });

    return result as CommentDB | undefined;
  };

  public findCommentByContent = async (
    content: string,
    creatorId: string
  ): Promise<CommentDB | undefined> => {
    const [result] = await BaseDatabase.connection(
      CommentDatabase.TABLE_COMMENTS
    )
      .select()
      .where({ content, creator_id: creatorId });

    return result as CommentDB | undefined;
  };

  public updateComment = async (commentDB: CommentDB): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
      .update(commentDB)
      .where({ id: commentDB.id });
  };

  public deleteCommentById = async (id: string): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_COMMENTS)
      .delete()
      .where({ id });
  };

  public findCommentWithCreatorNameById = async (
    id: string
  ): Promise<CommentDBWithCreatorName | undefined> => {
    const [result] = await BaseDatabase.connection(
      CommentDatabase.TABLE_COMMENTS
    )
      .select(
        `${CommentDatabase.TABLE_COMMENTS}.id`,
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
        `${CommentDatabase.TABLE_COMMENTS}.post_id`,
        `${CommentDatabase.TABLE_COMMENTS}.content`,
        `${CommentDatabase.TABLE_COMMENTS}.likes`,
        `${CommentDatabase.TABLE_COMMENTS}.dislikes`,
        `${CommentDatabase.TABLE_COMMENTS}.created_at`,
        `${CommentDatabase.TABLE_COMMENTS}.updated_at`,
        `${UserDatabase.TABLE_USERS}.nickname as creator_nickname`,
        `${UserDatabase.TABLE_USERS}.avatar as creator_avatar`
      )
      .join(
        `${UserDatabase.TABLE_USERS}`,
        `${CommentDatabase.TABLE_COMMENTS}.creator_id`,
        "=",
        `${UserDatabase.TABLE_USERS}.id`
      )
      .where({ [`${CommentDatabase.TABLE_COMMENTS}.id`]: id });

    return result as CommentDBWithCreatorName | undefined;
  };

  public findLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<COMMENT_LIKE | undefined> => {
    const [result]: Array<LikeDislikeDB | undefined> =
      await BaseDatabase.connection(
        CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS
      )
        .select()
        .where({
          user_id: likeDislikeDB.user_id,
          comment_id: likeDislikeDB.comment_id,
        });

    if (result === undefined) {
      return undefined;
    } else if (result.like === 1) {
      return COMMENT_LIKE.LIKED;
    } else {
      return COMMENT_LIKE.DISLIKED;
    }
  };

  public removeLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .delete()
      .where({
        user_id: likeDislikeDB.user_id,
        comment_id: likeDislikeDB.comment_id,
      });
  };

  public updateLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase.connection(CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS)
      .update(likeDislikeDB)
      .where({
        user_id: likeDislikeDB.user_id,
        comment_id: likeDislikeDB.comment_id,
      });
  };

  public insertLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {
    await BaseDatabase.connection(
      CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS
    ).insert(likeDislikeDB);
  };

  public getCommentsLikeDeslike = async (): Promise<LikeDislikeDB[]> => {
    const result = await BaseDatabase.connection(
      CommentDatabase.TABLE_LIKES_DISLIKES_COMMENTS
    );
    return result as LikeDislikeDB[];
  };
}
