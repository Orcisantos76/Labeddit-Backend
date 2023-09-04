export interface LikeDislikePostDB {
    user_id: string,
    post_id: string,
    like: number
}

export interface LikeDislikePostModel {
    userId: string,
    postId: string,
    like: boolean
}

export enum POST_LIKE {
    ALREADY_LIKED = "ALREADY LIKED",
    ALREADY_DISLIKED = "ALREADY DISLIKED"
}

export interface LikeDislikeCommentDB {
    user_id: string,
    post_id: string,
    comment_id: string,
    like: number
}

export interface LikeDislikeCommentModel {
    userId: string,
    postId: string,
    commentId: string,
    like: boolean
}

export enum COMMENT_LIKE {
    ALREADY_LIKED = "ALREADY LIKED",
    ALREADY_DISLIKED = "ALREADY DISLIKED"
}

export class LikeOrDislikePost {
    constructor(
        private userId: string,
        private postId: string,
        private like: boolean
    ) { }

    public toDBModel(): LikeDislikePostDB {
        return {
            user_id: this.userId,
            post_id: this.postId,
            like: this.like ? 1 : 0
        }
    }

    public toBusinessModel(): LikeDislikePostModel {
        return {
            userId: this.userId,
            postId: this.postId,
            like: this.like
        }
    }
}

export class LikeOrDislikeComment {
    constructor(
        private userId: string,
        private postId: string,
        private commentId: string,
        private like: boolean
    ) { }

    public toDBModel(): LikeDislikeCommentDB {
        return {
            user_id: this.userId,
            post_id: this.postId,
            comment_id: this.commentId,
            like: this.like ? 1 : 0
        }
    }

    public toBusinessModel(): LikeDislikeCommentModel {
        return {
            userId: this.userId,
            postId: this.postId,
            commentId: this.commentId,
            like: this.like
        }
    }
}