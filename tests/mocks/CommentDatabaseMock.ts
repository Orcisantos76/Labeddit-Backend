import {
  COMMENT_LIKE,
  CommentDB,
  CommentDBWithCreatorName,
  LikeDislikeDB,
} from "../../src/models/Comment";
import { PostDB } from "../../src/models/Post";
import { BaseDatabase } from "../../src/database/BaseDatabase";
import { usersMock, dateString } from "./UserDatabaseMock";
import { postsMock } from "./PostDatabaseMock";

const commentsMock: CommentDB[] = [
  {
    id: "id-mock-comment1",
    creator_id: "id-mock-fulano",
    post_id: "id-mock-post1",
    content: "Conteúdo do comment 1",
    likes: 1,
    dislikes: 2,
    created_at: dateString,
    updated_at: dateString,
  },
  {
    id: "id-mock-comment2",
    creator_id: "id-mock-beltrana",
    post_id: "id-mock-post1",
    content: "Conteúdo do comment 2",
    likes: 1,
    dislikes: 0,
    created_at: dateString,
    updated_at: dateString,
  },
  {
    id: "id-mock-comment3",
    creator_id: "id-mock-beltrana",
    post_id: "id-mock-post2",
    content: "Conteúdo do comment 3",
    likes: 2,
    dislikes: 0,
    created_at: dateString,
    updated_at: dateString,
  },
];

const commentLikesDislikesMock: LikeDislikeDB[] = [
  {
    user_id: "id-mock-fulano",
    comment_id: "id-mock-comment2",
    like: 1,
  },
  {
    user_id: "id-mock-astrodev",
    comment_id: "id-mock-comment1",
    like: 0,
  },
];

export class CommentDatabaseMock extends BaseDatabase {
  public static TABLE_COMMENTS = "comments";
  public static TABLE_LIKES_DISLIKES_COMMENTS = "likes_dislikes_comments";
  public static TABLE_POSTS = "posts";

  public findPostById = async (id: string): Promise<PostDB | undefined> => {
    return postsMock.filter((post) => post.id === id)[0];
  };

  public insertComment = async (commentDB: CommentDB): Promise<void> => {};

  public getCommentsWithCreatorName = async (): Promise<
    CommentDBWithCreatorName[]
  > => {
    const commentsWithCreatorName: CommentDBWithCreatorName[] =
      commentsMock.map((comment) => {
        const creator = usersMock.find(
          (user) => user.id === comment.creator_id
        );
        return {
          ...comment,
          creator_nickname: creator!.nickname,
        };
      });

    return commentsWithCreatorName;
  };

  public getCommentsWithCreatorNameByNickname = async (
    nickname: string
  ): Promise<CommentDBWithCreatorName[]> => {
    const commentsWithCreatorName: CommentDBWithCreatorName[] = commentsMock
      .filter((comment) => {
        const creator = usersMock.find(
          (user) => user.id === comment.creator_id
        );
        return creator && creator.nickname === nickname;
      })
      .map((comment) => ({
        ...comment,
        creator_nickname: nickname,
      }));

    return commentsWithCreatorName;
  };

  public getCommentsWithCreatorNameById = async (
    postId: string
  ): Promise<CommentDBWithCreatorName[]> => {
    const commentsWithCreatorName: CommentDBWithCreatorName[] = commentsMock
      .filter((comment) => comment.post_id === postId)
      .map((comment) => {
        const post = postsMock.find((post) => post.id === comment.post_id);
        const creator = usersMock.find(
          (user) => user.id === comment.creator_id
        );

        return {
          ...comment,
          creator_nickname: creator!.nickname,
        };
      });

    return commentsWithCreatorName;
  };

  public findCommentById = async (
    id: string
  ): Promise<CommentDB | undefined> => {
    return commentsMock.find((comment) => comment.id === id);
  };

  public findCommentByContent = async (
    content: string,
    creatorId: string
  ): Promise<CommentDB | undefined> => {
    return commentsMock.find(
      (comment) =>
        comment.content === content && comment.creator_id === creatorId
    );
  };

  public updateComment = async (commentDB: CommentDB): Promise<void> => {};

  public deleteCommentById = async (id: string): Promise<void> => {};

  public findCommentWithCreatorNameById = async (
    id: string
  ): Promise<CommentDBWithCreatorName | undefined> => {
    const comment = commentsMock.find((comment) => comment.id === id);
    if (comment) {
      const creator = usersMock.find((user) => user.id === comment.creator_id);
      if (creator) {
        return {
          ...comment,
          creator_nickname: creator.nickname,
        };
      }
    }
  };

  public findLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<COMMENT_LIKE | undefined> => {
    const result: LikeDislikeDB | undefined = commentLikesDislikesMock.find(
      (likeDislike) =>
        likeDislike.user_id === likeDislikeDB.user_id &&
        likeDislike.comment_id === likeDislikeDB.comment_id
    );
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
  ): Promise<void> => {};

  public updateLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {};

  public insertLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {};

  public getCommentsLikeDeslike = async (): Promise<LikeDislikeDB[]> => {
    return commentLikesDislikesMock;
  };
}
