import { CommentDatabase } from "../database/CommentDatabase";
import { UserDatabase } from "../database/UserDatabase";
import {
  CreateCommentInputDTO,
  CreateCommentOutputDTO,
} from "../dtos/comment/createComment.dto";
import {
  DeleteCommentInputDTO,
  DeleteCommentOutputDTO,
} from "../dtos/comment/deleteComment.dto";
import {
  EditCommentInputDTO,
  EditCommentOutputDTO,
} from "../dtos/comment/editComment.dto";
import {
  GetCommentsInputDTO,
  GetCommentsOutputDTO,
} from "../dtos/comment/getComments.dto";
import {
  GetCommentsByPostInputDTO,
  GetCommentsByPostOutputDTO,
} from "../dtos/comment/getCommentsByPost.dto";
import {
  GetCommentsByUserNicknameInputDTO,
  GetCommentsByUserNicknameOutputDTO,
} from "../dtos/comment/getCommentsByUserNickname.dto";
import {
  GetCommentsLikesDislikesInputDTO,
  GetCommentsLikesDislikesOutputDTO,
} from "../dtos/comment/getCommentsLikesDislikes.dto";
import {
  LikeOrDislikeCommentInputDTO,
  LikeOrDislikeCommentOutputDTO,
} from "../dtos/comment/likeOrDislikeComment.dto";
import { ConflictError } from "../errors/ConflictError";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import {
  LikeDislikeDB,
  COMMENT_LIKE,
  Comment,
  CommentLikeDislike,
} from "../models/Comment";
import { USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class CommentBusiness {
  constructor(
    private userDatabase: UserDatabase,
    private commentDatabase: CommentDatabase,
    private idGenerator: IdGenerator,
    private tokenManager: TokenManager
  ) {}

  public createComment = async (
    input: CreateCommentInputDTO
  ): Promise<CreateCommentOutputDTO> => {
    const { postId, token, content } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postDB = await this.commentDatabase.findPostById(postId);

    if (!postDB) {
      throw new NotFoundError("'post' com essa id não existe!");
    }

    const id = this.idGenerator.generate();

    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");

    const dateString = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
    
    const user = await this.userDatabase.findUserByNickname(payload.nickname);

    if (user) {
      const comment = new Comment(
        id,
        postId,
        content,
        0,
        0,
        dateString,
        dateString,
        payload.id,
        payload.nickname
      );
      const commentDB = comment.toDBModel();
      await this.commentDatabase.insertComment(commentDB);
    }

    const output: CreateCommentOutputDTO = {
      message: "Comentário criado com sucesso!",
    };

    return output;
  };

  public getComments = async (
    input: GetCommentsInputDTO
  ): Promise<GetCommentsOutputDTO> => {
    const { token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const commentsDBwithCreatorName =
      await this.commentDatabase.getCommentsWithCreatorName();

    const comments = commentsDBwithCreatorName.map((commentWithCreatorName) => {
      const comment = new Comment(
        commentWithCreatorName.id,
        commentWithCreatorName.post_id,
        commentWithCreatorName.content,
        commentWithCreatorName.likes,
        commentWithCreatorName.dislikes,
        commentWithCreatorName.created_at,
        commentWithCreatorName.updated_at,
        commentWithCreatorName.creator_id,
        commentWithCreatorName.creator_nickname
      );

      return comment.toBusinessModel();
    });

    const output: GetCommentsOutputDTO = comments;

    return output;
  };

  public getCommentsByUserNickname = async (
    input: GetCommentsByUserNicknameInputDTO
  ): Promise<GetCommentsByUserNicknameOutputDTO> => {
    const { nickname, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const commentsDBwithCreatorName =
      await this.commentDatabase.getCommentsWithCreatorNameByNickname(nickname);

    const comments = commentsDBwithCreatorName.map((commentWithCreatorName) => {
      const comment = new Comment(
        commentWithCreatorName.id,
        commentWithCreatorName.post_id,
        commentWithCreatorName.content,
        commentWithCreatorName.likes,
        commentWithCreatorName.dislikes,
        commentWithCreatorName.created_at,
        commentWithCreatorName.updated_at,
        commentWithCreatorName.creator_id,
        commentWithCreatorName.creator_nickname
      );

      if (payload.role !== USER_ROLES.ADMIN) {
        if (payload.id !== commentWithCreatorName.creator_id) {
          throw new ForbiddenError(
            "Somente admin e o próprio usuário podem acessar esse endpoint!"
          );
        }
      }

      return comment.toBusinessModel();
    });

    const output: GetCommentsOutputDTO = comments;

    return output;
  };

  public getCommentsByPost = async (
    input: GetCommentsByPostInputDTO
  ): Promise<GetCommentsByPostOutputDTO> => {
    const { postId, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const postDB = await this.commentDatabase.findPostById(postId);

    if (!postDB) {
      throw new NotFoundError("'post' com essa id não existe!");
    }

    const commentsDBwithCreatorName =
      await this.commentDatabase.getCommentsWithCreatorNameById(postDB.id);

    const comments = commentsDBwithCreatorName.map((commentWithCreatorName) => {
      const comment = new Comment(
        commentWithCreatorName.id,
        commentWithCreatorName.post_id,
        commentWithCreatorName.content,
        commentWithCreatorName.likes,
        commentWithCreatorName.dislikes,
        commentWithCreatorName.created_at,
        commentWithCreatorName.updated_at,
        commentWithCreatorName.creator_id,
        commentWithCreatorName.creator_nickname
      );

      return comment.toBusinessModel();
    });

    const output: GetCommentsOutputDTO = comments;

    return output;
  };

  public editComment = async (
    input: EditCommentInputDTO
  ): Promise<EditCommentOutputDTO> => {
    const { idToEdit, token, content } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const commentDB = await this.commentDatabase.findCommentById(idToEdit);

    if (!commentDB) {
      throw new NotFoundError("'comment' com essa id não existe!");
    }

    if (payload.id !== commentDB.creator_id) {
      throw new ForbiddenError("Somente quem criou o 'comment' pode editá-la!");
    }

    const contentDB = await this.commentDatabase.findCommentByContent(
      content,
      commentDB.creator_id
    );

    if (contentDB) {
      throw new ConflictError("Já existe um 'comment' com esse conteúdo!");
    }



    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    const hour = String(date.getHours()).padStart(2, "0");
    const minute = String(date.getMinutes()).padStart(2, "0");
    const second = String(date.getSeconds()).padStart(2, "0");
    const dateString = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

    const comment = new Comment(
      commentDB.id,
      commentDB.post_id,
      commentDB.content,
      commentDB.likes,
      commentDB.dislikes,
      commentDB.created_at,
      commentDB.updated_at,
      commentDB.creator_id,
      payload.nickname
    );

    comment.setContent = content;
    comment.setUpdatedAt = dateString;

    const updatedCommentDB = comment.toDBModel();
    await this.commentDatabase.updateComment(updatedCommentDB);

    const output: EditCommentOutputDTO = {
      message: "'comment' editado com sucesso!",
    };

    return output;
  };

  public deleteComment = async (
    input: DeleteCommentInputDTO
  ): Promise<DeleteCommentOutputDTO> => {
    const { idToDelete, token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const commentDB = await this.commentDatabase.findCommentById(idToDelete);

    if (!commentDB) {
      throw new NotFoundError("'comment' com essa id não existe!");
    }

    if (payload.role !== USER_ROLES.ADMIN) {
      if (payload.id !== commentDB.creator_id) {
        throw new ForbiddenError(
          "Somente quem criou o 'comment' pode deletar!"
        );
      }
    }

    await this.commentDatabase.deleteCommentById(idToDelete);

    const output: DeleteCommentOutputDTO = {
      message: "'comment' deletado com sucesso!",
    };

    return output;
  };

  public likeOrDislikeComment = async (
    input: LikeOrDislikeCommentInputDTO
  ): Promise<LikeOrDislikeCommentOutputDTO> => {
    const { commentId, token, like } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const commentDBWithCreatorName =
      await this.commentDatabase.findCommentWithCreatorNameById(commentId);

    if (!commentDBWithCreatorName) {
      throw new NotFoundError("comment com essa id não existe");
    }

    if (payload && payload.id === commentDBWithCreatorName.creator_id) {
      throw new ConflictError(
        "Você não pode dar like ou deslike no 'comment' que você criou!"
      );
    }

    const comment = new Comment(
      commentDBWithCreatorName.id,
      commentDBWithCreatorName.post_id,
      commentDBWithCreatorName.content,
      commentDBWithCreatorName.likes,
      commentDBWithCreatorName.dislikes,
      commentDBWithCreatorName.created_at,
      commentDBWithCreatorName.updated_at,
      commentDBWithCreatorName.creator_id,
      commentDBWithCreatorName.creator_nickname,
    );

    const likeSQlite = like ? 1 : 0;

    const likeDislikeDB: LikeDislikeDB = {
      user_id: payload.id,
      comment_id: commentId,
      like: likeSQlite,
    };

    const likeDislikeExists = await this.commentDatabase.findLikeDislike(
      likeDislikeDB
    );

    if (likeDislikeExists === COMMENT_LIKE.LIKED) {
      if (like) {
        await this.commentDatabase.removeLikeDislike(likeDislikeDB);
        comment.removeLike();
      } else {
        await this.commentDatabase.updateLikeDislike(likeDislikeDB);
        comment.removeLike();
        comment.addDislike();
      }
    } else if (likeDislikeExists === COMMENT_LIKE.DISLIKED) {
      if (!like) {
        await this.commentDatabase.removeLikeDislike(likeDislikeDB);
        comment.removeDislike();
      } else {
        await this.commentDatabase.updateLikeDislike(likeDislikeDB);
        comment.removeDislike();
        comment.addLike();
      }
    } else {
      await this.commentDatabase.insertLikeDislike(likeDislikeDB);
      like ? comment.addLike() : comment.addDislike();
    }

    const updatedCommentDB = comment.toDBModel();
    await this.commentDatabase.updateComment(updatedCommentDB);

    const output: LikeOrDislikeCommentOutputDTO = undefined;

    return output;
  };

  public getCommentsLikesDislikes = async (
    input: GetCommentsLikesDislikesInputDTO
  ): Promise<GetCommentsLikesDislikesOutputDTO> => {
    const { token } = input;

    const payload = this.tokenManager.getPayload(token);

    if (!payload) {
      throw new UnauthorizedError();
    }

    const comments = await this.commentDatabase.getCommentsLikeDeslike();

    const commentsLikeDislike = comments.map((commentLD) => {
      const commentLikeDislike = new CommentLikeDislike(
        commentLD.user_id,
        commentLD.comment_id,
        commentLD.like
      );

      return commentLikeDislike.toBusinessModel();
    });

    const output: GetCommentsLikesDislikesOutputDTO = commentsLikeDislike;

    return output;
  };
}
