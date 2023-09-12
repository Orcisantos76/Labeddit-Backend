export enum USER_ROLES {
  NORMAL = "NORMAL",
  ADMIN = "ADMIN",
}

export interface TokenPayload {
  id: string;
  nickname: string;
  role: USER_ROLES;
}

export interface UserDB {
  id: string;
  nickname: string;
  email: string;
  password: string;
  role: USER_ROLES;
  created_at: string;
}

export interface UserModel {
  id: string;
  nickname: string;
  email: string;
  role: USER_ROLES;
  createdAt: string;
}

export class User {
  constructor(
    private id: string,
    private nickname: string,
    private email: string,
    private password: string,
    private role: USER_ROLES,    
    private createdAt: string
  ) {}

  get getId(): string {
    return this.id;
  }

  get getNickname(): string {
    return this.nickname;
  }

  set setNickname(value: string) {
    this.nickname = value;
  }

  set setEmail(value: string) {
    this.email = value;
  }

  set setPassword(value: string) {
    this.password = value;
  }

  get getRole(): USER_ROLES {
    return this.role;
  }

  public toDBModel(): UserDB {
    return {
      id: this.id,
      nickname: this.nickname,
      email: this.email,
      password: this.password,
      role: this.role,
      created_at: this.createdAt,
    };
  }

  public toBusinessModel(): UserModel {
    return {
      id: this.id,
      nickname: this.nickname,
      email: this.email,
      role: this.role,
      createdAt: this.createdAt,
    };
  }
}
