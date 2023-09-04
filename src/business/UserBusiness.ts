import { CommentDatabase } from "../database/CommentDatabase";
import { PostDatabase } from "../database/PostDatabase";
import { UserDatabase } from "../database/UserDatabase";
import { LoginInputDTO, loginOutputDTO } from "../dtos/User/login.dto";
import { SignupInputDTO, SignupOutputDTO } from "../dtos/User/signup.dto";
import { BadRequestError } from "../errors/BadRequestError";
import { ConflictError } from "../errors/ConflictError";
import { TokenPayload, USER_ROLES, User, UserDB } from "../models/User";
import { HashManager } from "../services/HashManager";
import { IdGenerator } from "../services/IdGenerator";
import { TokenManager } from "../services/TokenManager";

export class UserBusiness {
    constructor(
        private userDatabase: UserDatabase,
        private postsDatabase: PostDatabase,
        private commentDatabase: CommentDatabase,
        private idGenerator: IdGenerator,
        private tokenManager: TokenManager,
        private hashManager: HashManager
    ) { }
    public signup = async (input: SignupInputDTO): Promise<SignupOutputDTO> => {

        const { name, email, password } = input

        const nameExist: UserDB | undefined = await this.userDatabase.getUserByName(name)

        if (nameExist) {
            throw new ConflictError("Não é possível criar mais de uma conta com o mesmo usuario. ")
        }

        const userEmailExist: UserDB | undefined = await this.userDatabase.getUserByEmail(email)

        if (userEmailExist) {
            throw new ConflictError("Não é possível criar mais de uma conta com o mesmo e-mail.")
        }

        const id: string = this.idGenerator.generate()
        const hashedPassword: string = await this.hashManager.hash(password)

        const newUser = new User(
            id,
            name,
            email,
            hashedPassword,
            USER_ROLES.NORMAL,
            new Date().toISOString()
        )

        const newUserDB: UserDB = newUser.toDBModel()
        await this.userDatabase.insertUser(newUserDB)

        const tokenPayload: TokenPayload = newUser.toTokenPayload()
        const token = this.tokenManager.createToken(tokenPayload)

        const output: SignupOutputDTO = {
            message: "Cadastro realizado.",
            token: token
        }

        return output as SignupOutputDTO
    }

    public login = async (input: LoginInputDTO): Promise<loginOutputDTO> => {

        const { email, password } = input

        const userDB: UserDB | undefined = await this.userDatabase.getUserByEmail(email)

        if (!userDB) {
            throw new BadRequestError("'Email' ou 'Password' ")
        }

        const hashedPassword: string = userDB.password
        const isPasswordCorrect: boolean = await this.hashManager.compare(password, hashedPassword)

        if (!isPasswordCorrect) {
            throw new BadRequestError("'Email' ou 'Password' ")
        }

        const user = new User(
            userDB.id,
            userDB.name,
            userDB.email,
            userDB.password,
            userDB.role,
            userDB.create_at
        )

        const tokenPayload: TokenPayload = user.toTokenPayload()
        const token: string = this.tokenManager.createToken(tokenPayload)

        const output: loginOutputDTO = {
            message: "Login realizado !",
            token: token
        }

        return output as loginOutputDTO
    }
}

