import { PostDatabase } from "../database/PostDatabase";
import {
    CreatePostInputDTO,
    CreatePostOutputDTO,
} from "../dtos/Post/createPost.dto";
import { DeletePostInputDTO, DeletePostOutputDTO } from "../dtos/Post/deletePost.dto";
import { EditPostInputDTO, EditPostOutputDTO } from "../dtos/Post/editPost.dto";
import { GetPostsInputDTO, GetPostsOutputDTO } from "../dtos/Post/getPosts.dto";
import {
    LikeOrDislikePostInputDTO,
    LikeOrDislikePostOutputDTO,
} from "../dtos/Post/likeOrDislikePost.dto";
import { ForbiddenError } from "../errors/ForbiddenError";
import { NotFoundError } from "../errors/NotFoundError";
import { UnauthorizedError } from "../errors/UnauthorizedError";
import { LikeDislikePostDB, LikeOrDislikePost, POST_LIKE } from "../models/LikeOrDislike";
import { Post, PostDB, PostModel, PostWithCreatorDb } from "../models/Post";
import { TokenPayload, USER_ROLES } from "../models/User";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class PostBusiness {
    constructor(
        private postDatabase: PostDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager
    ) { }

    public createPost = async (
        input: CreatePostInputDTO
    ): Promise<CreatePostOutputDTO> => {
        const { content, token } = input;

        const payload: TokenPayload | null = this.tokenManager.getPayload(token);

        if (!payload) {
            throw new UnauthorizedError();
        }
        const id: string = this.idGenerator.generate();

        const newPost = new Post(
            id,
            content,
            0,
            0,
            0,
            new Date().toISOString(),
            new Date().toISOString(),
            payload.id,
            payload.name
        );
        const newPostDB: PostDB = newPost.toDBModel();
        await this.postDatabase.insertPost(newPostDB);

        const output: CreatePostOutputDTO = {
            message: "Post criado com sucesso!",
        };
        return output as CreatePostOutputDTO;
    };
    public getPosts = async (input: GetPostsInputDTO): Promise<GetPostsOutputDTO> => {

        const { query, token } = input

        const payload: TokenPayload | null = this.tokenManager.getPayload(token)

        if (!payload) {
            throw new UnauthorizedError()
        }

        const postsDB: PostWithCreatorDb[] = await this.postDatabase.getPostsWithCreator(query)

        const posts: PostModel[] = postsDB.map((postDB) => {

            const post = new Post(
                postDB.id,
                postDB.content,
                postDB.comments,
                postDB.likes,
                postDB.dislikes,
                postDB.create_at,
                postDB.update_at,
                postDB.creator_id,
                postDB.creator_name
            )

            return post.toBusinessModel()

        })

        const output: GetPostsOutputDTO = posts
        return output as GetPostsOutputDTO
    }
    public likeOrDislikePost = async (input: LikeOrDislikePostInputDTO): Promise<LikeOrDislikePostOutputDTO> => {

        const { postId, token, like } = input

        const payload = this.tokenManager.getPayload(token)  

        if (!payload) {
            throw new UnauthorizedError()
        }

        

        const postDB: PostDB | undefined = await this.postDatabase.getPostById(postId)

        if (!postDB) {
            throw new NotFoundError("Post não encontrado.")
        }

        if (payload.id === postDB.creator_id) {
            throw new ForbiddenError("Não é possível interagir no próprio post.")
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

        const likeDislikePost = new LikeOrDislikePost(
            payload.id,
            postId,
            like
        )

        const likeDislikePostDB: LikeDislikePostDB = likeDislikePost.toDBModel()
        const likeDislikeExists: POST_LIKE | undefined = await this.postDatabase.getLikeDislikeFromPostById(likeDislikePostDB)
        likeDislikeExists === POST_LIKE.ALREADY_LIKED && like ?
        (await this.postDatabase.removeLikeDislikeFromPostById(likeDislikePostDB), post.removeLike())
        : likeDislikeExists === POST_LIKE.ALREADY_LIKED && !like ?
        (await this.postDatabase.updateLikeDislikeFromPostById(likeDislikePostDB), post.removeLike(), post.addDislike())
        : likeDislikeExists === POST_LIKE.ALREADY_DISLIKED && !like ?
        (await this.postDatabase.removeLikeDislikeFromPostById(likeDislikePostDB), post.removeDislike())
        : likeDislikeExists === POST_LIKE.ALREADY_DISLIKED && like ?
        (await this.postDatabase.updateLikeDislikeFromPostById(likeDislikePostDB), post.removeDislike(), post.addLike())
        : likeDislikeExists === undefined && like ?
        (await this.postDatabase.insertLikeDislikeInPostById(likeDislikePostDB), post.addLike())
        : (await this.postDatabase.insertLikeDislikeInPostById(likeDislikePostDB), post.addDislike())

        const updatePostDB: PostDB = post.toDBModel()

        await this.postDatabase.updatePostById(updatePostDB)

        const output: LikeOrDislikePostOutputDTO = undefined
        return output as LikeOrDislikePostOutputDTO

    }
    public editPost = async (input: EditPostInputDTO): Promise<EditPostOutputDTO> => {
        const { idToEdit, token, content } = input;
        const payload = this.tokenManager.getPayload(token);

        if (!payload) {  // validando payload
            throw new UnauthorizedError();
        }

        const postDB = await this.postDatabase.findPostById(idToEdit);
        // buscando no banco de dados pra ver se existe

        if (!postDB) {
            throw new NotFoundError("Post com este ID não existe.")
        }

        if (payload.id !== postDB.creator_id) {
            throw new ForbiddenError("Somente quem criuou o Post pode editá-lo")
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
        );
        post.setContent = content

        const updatedPostDB = post.toDBModel();
        await this.postDatabase.updatePost(updatedPostDB);

        const output: EditPostOutputDTO = undefined;

        return output;
    }
    public deletePost = async (
        input: DeletePostInputDTO
    ): Promise<DeletePostOutputDTO> => {
        const { token, idToDelete } = input;

        const payload = this.tokenManager.getPayload(token);

        if (!payload) {
            throw new UnauthorizedError("Token inválido");
        }

        const postDBExists = await this.postDatabase.findPostById(idToDelete);

        if (!postDBExists) {
            throw new NotFoundError("Post não encontrado");
        }

        if (payload.role !== USER_ROLES.ADMIN) {
            if (payload.id !== postDBExists.creator_id) {
                throw new ForbiddenError("Only the creator of the post can delete it");
            }
        }

        await this.postDatabase.deletePost(idToDelete);

        const output: DeletePostOutputDTO = undefined;

        return output;
    };


}
