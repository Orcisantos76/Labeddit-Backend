export interface CommentDB{ //referencia o banco de dados
    id: string,
    post_id: string,
    content: string,
    likes: number,
    dislikes: number,
    create_at: string,
    update_at: string,
    creator_id: string
}

export interface CommentWithCreatorDB extends CommentDB{
    creator_name: string
}

export interface CommentModel { // referencia o front end
    id: string,
    content: string,
    likes: number,
    dislikes: number,
    createAt: string,
    updateAt: string,
    creator: {
        id: string,
        name: string
    }
}

export class Comment {
    constructor(
        private id: string,
        private postId: string,
        private content: string,
        private likes: number,
        private dislikes: number,
        private createAt: string,
        private updateAt: string,
        private creatorId: string,
        private creatorName: string
        
    ){}

    public set CONTENT (newContent: string){
        this.content = newContent;
    }

    public set UPDATE_AT (newUpdateAte: string){
        this.updateAt = newUpdateAte
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

    public toDBModel(): CommentDB{ // modelo para banco de dados
        return{
            id: this.id,
            creator_id: this.creatorId,
            post_id: this.postId,
            content: this.content,
            likes: this.likes,
            dislikes: this.dislikes,
            create_at: this.createAt,
            update_at: this.updateAt
        }
    }

    public toBusinessModel(): CommentModel {// modelo para regra de negocio
        return {
            id: this.id,
            content: this.content,
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
}