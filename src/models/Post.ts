export interface PostDB {
  id: string;
  creator_id: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
}

export interface PostDBWithCreatorName {
  id: string;
  creator_id: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
  creator_nickname: string;
}

export interface PostModel {
  id: string;
  content: string;
  likes: number;
  dislikes: number;
  createdAt: string;
  updatedAt: string;
  creator: {
    id: string;
    nickname: string;
  };
}

export interface LikeDislikeDB {
  user_id: string;
  post_id: string;
  like: number;
}

export interface PostLikeDislikeModel {
  userId: string;
  postId: string;
  like: number;
}

export class PostLikeDislike {
  constructor(
    private userId: string,
    private postId: string,
    private like: number
  ) {}

  public toBusinessModel(): PostLikeDislikeModel {
    return {
      userId: this.userId,
      postId: this.postId,
      like: this.like,
    };
  }
}

export enum POST_LIKE {
  LIKED = "already like",
  DISLIKED = "already dislike",
}

export class Post {
  constructor(
    private id: string,
    private content: string,
    private likes: number,
    private dislikes: number,
    private createdAt: string,
    private updatedAt: string,
    private creatorId: string,
    private creatorNickname: string
  ) {}

  set setContent(value: string) {
    this.content = value;
  }

  set setUpdatedAt(value: string) {
    this.updatedAt = value;
  }

  public addLike(): void {
    this.likes += 1;
  }

  public removeLike(): void {
    this.likes -= 1;
  }

  public addDislike() {
    this.dislikes += 1;
  }

  public removeDislike() {
    this.dislikes -= 1;
  }

  public toDBModel(): PostDB {
    return {
      id: this.id,
      creator_id: this.creatorId,
      content: this.content,
      likes: this.likes,
      dislikes: this.dislikes,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  public toBusinessModel(): PostModel {
    return {
      id: this.id,
      content: this.content,
      likes: this.likes,
      dislikes: this.dislikes,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      creator: {
        id: this.creatorId,
        nickname: this.creatorNickname,
      },
    };
  }
}
