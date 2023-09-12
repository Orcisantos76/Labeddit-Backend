export interface CommentDB {
  id: string;
  creator_id: string;
  post_id: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
}

export interface CommentDBWithCreatorName {
  id: string;
  creator_id: string;
  post_id: string;
  content: string;
  likes: number;
  dislikes: number;
  created_at: string;
  updated_at: string;
  creator_nickname: string;
}

export interface CommentModel {
  id: string;
  postId: string;
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
  comment_id: string;
  like: number;
}

export interface CommentLikeDislikeModel {
  userId: string;
  commentId: string;
  like: number;
}

export class CommentLikeDislike {
  constructor(
    private userId: string,
    private commentId: string,
    private like: number
  ) {}

  public toBusinessModel(): CommentLikeDislikeModel {
    return {
      userId: this.userId,
      commentId: this.commentId,
      like: this.like,
    };
  }
}

export enum COMMENT_LIKE {
  LIKED = "already like",
  DISLIKED = "already dislike",
}

export class Comment {
  constructor(
    private id: string,
    private postId: string,
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

  public toDBModel(): CommentDB {
    return {
      id: this.id,
      post_id: this.postId,
      creator_id: this.creatorId,
      content: this.content,
      likes: this.likes,
      dislikes: this.dislikes,
      created_at: this.createdAt,
      updated_at: this.updatedAt,
    };
  }

  public toBusinessModel(): CommentModel {
    return {
      id: this.id,
      postId: this.postId,
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
