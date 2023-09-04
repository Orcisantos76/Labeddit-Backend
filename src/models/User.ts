export enum USER_ROLES {
    NORMAL = "NORMAL",
    ADMIN = "ADMIN"
} // realocar para o arquivo da entidade User
export interface TokenPayload {
    id: string,
    name: string,
    role: USER_ROLES
} // realocar para o arquivo da entidade User

export interface UserDB{
    id : string,
    name : string,
    email : string,
    password : string,
    role : USER_ROLES,
    create_at : string
}

export interface UserModel{
    id : string,
    name : string,
    email : string,
    role : USER_ROLES,
    createAt : string
}

export class User {
    constructor (
        private id : string,
        private name : string,
        private email : string,
        private password : string,
        private role : USER_ROLES,
        private createAt : string
    ){}

    public getId(): string{
        return this.id;
    }

    public getName(): string{
        return this.name;
    }
    public setName(newName: string){
        this.name = newName
    }

    public getEmail(): string {
        return this.email;
    }
    public setEmail(newEmail: string) {
        this.email = newEmail;
    }
    public setPassword(newPassword: string){
        this.password = newPassword
    }

    public toDBModel(): UserDB{
        return{
            id: this.id,
            name: this.name,
            email: this.email,
            password: this.password,
            role: this.role,
            create_at: this.createAt
        }
    }
    public toBusinessModel(): UserModel{
        return{
            id: this.id,
            name: this.name,
            email: this.email,
            role: this.role,
            createAt: this.createAt
        }
    }
    public toTokenPayload(): TokenPayload{
        return{
            id: this.id,
            name: this.name,
            role: this.role
        }
    }
}