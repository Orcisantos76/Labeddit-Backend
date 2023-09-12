import {
  LikeDislikeDB,
  POST_LIKE,
  PostDB,
  PostDBWithCreatorName,
} from "../../src/models/Post";
import { BaseDatabase } from "../../src/database/BaseDatabase";
import { usersMock, dateString } from "../mocks/UserDatabaseMock";

export const postsMock: PostDB[] = [
  {
    id: "id-mock-post1",
    creator_id: "id-mock-astrodev",
    content: "Conteúdo do post 1",
    likes: 10,
    dislikes: 2,
    created_at: dateString,
    updated_at: dateString,
  },
  {
    id: "id-mock-post2",
    creator_id: "id-mock-fulano",
    content: "Conteúdo do post 2",
    likes: 5,
    dislikes: 1,
    created_at: dateString,
    updated_at: dateString,
  },
  {
    id: "id-mock-post3",
    creator_id: "id-mock-beltrana",
    content: "Conteúdo do post 3",
    likes: 3,
    dislikes: 0,
    created_at: dateString,
    updated_at: dateString,
  },
];

const postLikesDislikesMock: LikeDislikeDB[] = [
  {
    user_id: "id-mock-fulano",
    post_id: "id-mock-post1",
    like: 1,
  },
  {
    user_id: "id-mock-astrodev",
    post_id: "id-mock-post2",
    like: 0,
  },
];

export class PostDatabaseMock extends BaseDatabase {
  public static TABLE_POSTS = "posts";
  public static TABLE_LIKES_DISLIKES_POSTS = "likes_dislikes_posts";

  public insertPost = async (postDB: PostDB): Promise<void> => {};

  public getPostsWithCreatorName = async (): Promise<
    PostDBWithCreatorName[]
  > => {
    const postsWithCreatorName: PostDBWithCreatorName[] = postsMock.map(
      (post) => {
        const creator = usersMock.find((user) => user.id === post.creator_id);
        return {
          ...post,
          creator_nickname: creator?.nickname || "",
        };
      }
    );

    return postsWithCreatorName;
  };

  public getPostsWithCreatorNameByNickname = async (
    nickname: string
  ): Promise<PostDBWithCreatorName[]> => {
    const postsWithCreatorName: PostDBWithCreatorName[] = postsMock
      .filter((post) => {
        const creator = usersMock.find((user) => user.id === post.creator_id);
        return creator && creator.nickname === nickname;
      })
      .map((post) => ({
        ...post,
        creator_nickname: nickname,
      }));

    return postsWithCreatorName;
  };

  public findPostById = async (id: string): Promise<PostDB | undefined> => {
    return postsMock.filter((post) => post.id === id)[0];
  };

  public async findPostByContent(
    content: string,
    creatorId: string
  ): Promise<PostDB | undefined> {
    return postsMock.find(
      (post) => post.content === content && post.creator_id === creatorId
    );
  }

  public updatePost = async (postDB: PostDB): Promise<void> => {};

  public deletePostById = async (id: string): Promise<void> => {};

  public async findPostWithCreatorNameById(
    id: string
  ): Promise<PostDBWithCreatorName | undefined> {
    const post = postsMock.find((post) => post.id === id);
    if (post) {
      const creator = usersMock.find((user) => user.id === post.creator_id);
      if (creator) {
        return {
          ...post,
          creator_nickname: creator.nickname,
        };
      }
    }
  }

  public async findLikeDislike(
    likeDislikeDB: LikeDislikeDB
  ): Promise<POST_LIKE | undefined> {
    const result: LikeDislikeDB | undefined = postLikesDislikesMock.find(
      (likeDislike) =>
        likeDislike.user_id === likeDislikeDB.user_id &&
        likeDislike.post_id === likeDislikeDB.post_id
    );

    if (result === undefined) {
      return undefined;
    } else if (result.like === 1) {
      return POST_LIKE.LIKED;
    } else {
      return POST_LIKE.DISLIKED;
    }
  }

  public async removeLikeDislike(likeDislikeDB: LikeDislikeDB): Promise<void> {}

  public updateLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {};

  public insertLikeDislike = async (
    likeDislikeDB: LikeDislikeDB
  ): Promise<void> => {};

  public getPostsLikeDeslike = async (): Promise<LikeDislikeDB[]> => {
    return postLikesDislikesMock;
  };
}
