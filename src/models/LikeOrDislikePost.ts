import { LikeDislikePostDB, LikeDislikePostModel } from "./LikeOrDislike";

export class LikeOrDislikePost {
  constructor(
    private userId: string,
    private postId: string,
    private like: boolean
  ) {}

  public toDBModel(): LikeDislikePostDB {
    return {
      user_id: this.userId,
      post_id: this.postId,
      like: this.like ? 1 : 0,
    };
  }

  public toBusinessModel(): LikeDislikePostModel {
    return {
      userId: this.userId,
      postId: this.postId,
      like: this.like,
    };
  }
}
