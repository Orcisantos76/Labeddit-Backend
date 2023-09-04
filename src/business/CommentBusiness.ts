import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { CreateCommentInputDTo, CreateCommentOutputDTo } from "../dtos/Comment/createComment.dto";
import { DeleteCommentByIdInputDTO, DeleteCommentByIdOutputDTO } from "../dtos/Comment/deleteComment.dto";
import { EditCommentByIdInputDTO, EditCommentByIdOutputDTO } from "../dtos/Comment/editComment.dtos";
import { LikeOrDislikeCommentInputDTO, LikeOrDislikeCommentOutputDTO } from "../dtos/Comment/likeOrDislikeComment.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { Comment, CommentDB, CommentWithCreatorDB } from "../models/Comments";
import { COMMENT_LIKE, LikeOrDislikeComment } from "../models/LikeOrDislike";
import { Post, PostDB, PostWithCreatorDb } from "../models/Post";
import { TokenPayload, USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class CommentBusiness {
    constructor(
        private commentDatabase: CommentDatabase,
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }
    public createComment = async (input: CreateCommentInputDTo): Promise<CreateCommentOutputDTo> => {

        const { postId, content, token } = input

        const payload: TokenPayload | null = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const postDB: PostDB | undefined = await this.postDatabase.getPostById(postId)

        if (!postDB) {
            throw new NotFoundError("Post não encontrado. Verifique o id e tente novamente.")
        }

        const post = new Post(
            postDB.id,
            postDB.content,
            postDB.comments,
            postDB.likes,
            postDB.dislikes,
            postDB.create_at,
            postDB.update_at,
            postDB.creator_id,
            payload.name
        )

        const id: string = this.idGenerator.generate()

        const newComment = new Comment(
            id,
            postId,
            content,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.name
        )

        const newCommentDB: CommentDB = newComment.toDBModel()
        await this.commentDatabase.insertComment(newCommentDB)

        post.addComment()
        const updatePostDB: PostDB = post.toDBModel()
        await this.postDatabase.updatePostById(updatePostDB)

        const output: CreateCommentOutputDTo = {
            message: "Comentário criado com sucesso!"
        }

        return output as CreateCommentOutputDTo
    }
    public editCommentById = async (input: EditCommentByIdInputDTO): Promise<EditCommentByIdOutputDTO> => {
        const { postId, commentId, content, token } = input

        const payload: TokenPayload | null = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const postDB: PostDB | undefined = await this.postDatabase.getPostById(postId)

        if (!postDB) {
            throw new NotFoundError("Post não encontrado. Verifique o id e tente novamente.")
        }

        const commentDB: CommentDB | undefined = await this.commentDatabase.getCommentById(commentId)

        if (!commentDB) {
            throw new NotFoundError("Comentário não encontrado. Verifique o id e tente novamente.")
        }

        if (payload.role !== USER_ROLES.ADMIN) {
            if (payload.id !== commentDB.creator_id) {
                throw new ForbiddenError("Somente o criador do comentário ou um ADMIN podem editá-lo. Caso não tenha acesso a sua conta, entre em contato com nosso suporte.")
            }
        }

        const comment = new Comment(
            commentDB.id,
            commentDB.post_id,
            commentDB.content,
            commentDB.likes,
            commentDB.dislikes,
            commentDB.create_at,
            commentDB.update_at,
            commentDB.creator_id,
            payload.name
        )

        comment.CONTENT = content
        comment.UPDATE_AT = new Date().toISOString()

        const updateCommentDB: CommentDB = comment.toDBModel()
        await this.commentDatabase.updateCommentById(updateCommentDB)

        const output: EditCommentByIdOutputDTO = {
            message: "Comentário atualizado com sucesso!",
        }

        return output
    }
    public deleteCommentById = async (input: DeleteCommentByIdInputDTO): Promise<DeleteCommentByIdOutputDTO> => {

        const { postId, commentId, token } = input

        const payload: TokenPayload | null = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const commentDB: CommentDB | undefined = await this.commentDatabase.getCommentById(commentId)

        if (!commentDB) {
            throw new NotFoundError("Comentário não encontrado. Verifique o id e tente novamente.")
        }

        const postWithCreatorDB: PostWithCreatorDb | undefined = await this.postDatabase.getPostWithCreatorById(postId)

        if (!postWithCreatorDB) {
            throw new NotFoundError("Post não encontrado. Verifique o id e tente novamente.")
        }

        if (payload.role !== USER_ROLES.ADMIN) {
            if (payload.id !== postWithCreatorDB.creator_id) {
                if (payload.id !== commentDB.creator_id) {
                    throw new ForbiddenError("Somente o autor do comentário, o autor do post ou um ADMIN podem excluir o comentário. Caso não tenha acesso a sua conta, entre em contato com nosso suporte.")
                }
            }
        }

        await this.commentDatabase.deleteCommentById(commentId)

        const post = new Post(
            postWithCreatorDB.id,
            postWithCreatorDB.content,
            postWithCreatorDB.comments,
            postWithCreatorDB.likes,
            postWithCreatorDB.dislikes,
            postWithCreatorDB.create_at,
            postWithCreatorDB.update_at,
            postWithCreatorDB.creator_id,
            postWithCreatorDB.creator_name,
        )

        post.removeComment()
        const updatePostDB: PostDB = post.toDBModel()
        await this.postDatabase.updatePostById(updatePostDB)

        const output: DeleteCommentByIdOutputDTO = {
            message: "Comentário excluído com sucesso!",
        }

        return output as DeleteCommentByIdOutputDTO
    }

    public likeOrDislikeComment = async (input: LikeOrDislikeCommentInputDTO): Promise<LikeOrDislikeCommentOutputDTO> => {

        const { postId, commentId, token, like } = input

        const payload: TokenPayload | null = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const commentWithCreatorDB: CommentWithCreatorDB | undefined = await this.commentDatabase.getCommentWithCreatorById(commentId)

        if (!commentWithCreatorDB) {
            throw new NotFoundError("Comentário não encontrado. Verifique o id e tente novamente.")
        }

        const postDB: PostDB | undefined = await this.postDatabase.getPostById(postId)

        if (!postDB) {
            throw new NotFoundError("Post não encontrado. Verifique o id e tente novamente.")
        }

        if (payload.id === commentWithCreatorDB.creator_id) {
            throw new ForbiddenError("Não dar like no seu proprio post.")
        }

        const comment = new Comment(
            commentWithCreatorDB.id,
            commentWithCreatorDB.post_id,
            commentWithCreatorDB.content,
            commentWithCreatorDB.likes,
            commentWithCreatorDB.dislikes,
            commentWithCreatorDB.create_at,
            commentWithCreatorDB.update_at,
            commentWithCreatorDB.creator_id,
            commentWithCreatorDB.creator_name
        )

        const likeDislikeComment = new LikeOrDislikeComment(
            payload.id,
            postId,
            commentId,
            like
        )

        const likeDislikeCommentDB = likeDislikeComment.toDBModel()

        const likeDislikeExists: COMMENT_LIKE | undefined = await this.commentDatabase.getLikeDislikeFromCommentById(likeDislikeCommentDB)

        likeDislikeExists === COMMENT_LIKE.ALREADY_LIKED && like ?
            (await this.commentDatabase.removeLikeDislikeFromCommentById(likeDislikeCommentDB), comment.removeLike())
            : likeDislikeExists === COMMENT_LIKE.ALREADY_LIKED && !like ?
                (await this.commentDatabase.updateLikeDislikeFromCommentById(likeDislikeCommentDB), comment.removeLike(), comment.addDislike())
                : likeDislikeExists === COMMENT_LIKE.ALREADY_DISLIKED && !like ?
                    (await this.commentDatabase.removeLikeDislikeFromCommentById(likeDislikeCommentDB), comment.removeDislike())
                    : likeDislikeExists === COMMENT_LIKE.ALREADY_DISLIKED && like ?
                        (await this.commentDatabase.updateLikeDislikeFromCommentById(likeDislikeCommentDB), comment.removeDislike(), comment.addLike())
                        : likeDislikeExists === undefined && like ?
                            (await this.commentDatabase.insertLikeDislikeInCommentById(likeDislikeCommentDB), comment.addLike())
                            : (await this.commentDatabase.insertLikeDislikeInCommentById(likeDislikeCommentDB), comment.addDislike())

        const updateCommentDB: CommentDB = comment.toDBModel()

        await this.commentDatabase.updateCommentById(updateCommentDB)

        const output: LikeOrDislikeCommentOutputDTO = undefined
        return output as LikeOrDislikeCommentOutputDTO

    }

}