import { CommentModel, CommentWithCreatorDB } from "./Comments";

export interface PostDB{
    id: string;
    content: string;
    comments: number;
    likes: number;
    dislikes: number;
    create_at: string;
    update_at: string;
    creator_id: string;
}

export interface PostWithCreatorDb{
    id:string;
    content: string;
    comments: number;
    likes: number;
    dislikes: number;
    create_at: string;
    update_at: string;
    creator_id: string;
    creator_name: string;
}

export interface PostModel{
    id: string,
    content: string,
    comments: number,
    likes: number,
    dislikes: number,
    createAt: string,
    updateAt: string,
    creator: {
        id: string,
        name: string
    }
}

export interface PostWithCommentsDB{
    id: string,
    content: string,
    comments: number,
    likes: number,
    dislikes: number,
    create_at: string,
    update_at: string,
    creator_id: string,
    creator_name: string,
    comments_post: CommentWithCreatorDB[]
}

export interface PostWithCommentsModel{
    id: string,
    content: string,
    comments: number,
    likes: number,
    dislikes: number,
    createAt: string,
    updateAt: string,
    creator: {
        id: string,
        username: string,
    },
    commentsPost: CommentModel[]
}

export class Post{
    constructor(
    private id: string,
    private content: string,
    private comments: number,
    private likes: number,
    private dislikes: number,
    private createAt: string,
    private updateAt: string,
    private creatorId: string,
    private creatorName: string    
    ){}

    public set CONTENT(newContent: string){
        this.content = newContent;
    }
    public set UPDATE_AT(newUpdateAt: string){
        this.updateAt = newUpdateAt;
    }
    public addComment():void {
        this.comments += 1
    }
    public removeComment():void {
        this.comments -= 1
    }
    public addLike():void {
        this.likes += 1
    }
    public removeLike():void {
        this.likes -= 1
    }
    public addDislike():void {
        this.dislikes += 1
    }
    public removeDislike():void {
        this.dislikes -= 1
    }
    set setContent(value: string) {
        this.content = value;
        }

    public toDBModel(): PostDB{
        return{
            id: this.id,
            creator_id: this.creatorId,
            content: this.content,
            comments: this.comments,
            likes: this.likes,
            dislikes: this.dislikes,
            create_at: this.createAt,
            update_at: this.updateAt,            
        }
    }

    public toBusinessModel(): PostModel{
        return{
            id: this.id,
            content: this.content,
            comments: this.comments,
            likes: this.likes,
            dislikes: this.dislikes,
            createAt: this.createAt,
            updateAt: this.updateAt,
            creator: {
                id: this.creatorId,
                name: this.creatorName
            }
        }
    }

    public toBusinessModelWithComments(commentsPost:CommentModel[]): PostWithCommentsModel {
        return {
            id: this.id,
            content: this.content,
            comments: this.comments,
            likes: this.likes,
            dislikes: this.dislikes,
            createAt: this.createAt,
            updateAt: this.updateAt,
            creator: {
                id: this.creatorId,
                username: this.creatorName
            },
            commentsPost: commentsPost
        }
    }
}