import { USER_ROLES, UserDB } from "../../src/models/User";
import { BaseDatabase } from "../../src/database/BaseDatabase";

const date = new Date();
const year = date.getFullYear();
const month = String(date.getMonth() + 1).padStart(2, "0");
const day = String(date.getDate()).padStart(2, "0");
const hour = String(date.getHours()).padStart(2, "0");
const minute = String(date.getMinutes()).padStart(2, "0");
const second = String(date.getSeconds()).padStart(2, "0");

export const dateString = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

export const usersMock: UserDB[] = [
  {
    id: "id-mock-fulano",
    nickname: "Fulano",
    email: "fulano@email.com",
    password: "hash-mock-fulano", // senha = "fulano123"
    role: USER_ROLES.NORMAL,
    created_at: dateString,
  },
  {
    id: "id-mock-astrodev",
    nickname: "Astrodev",
    email: "astrodev@email.com",
    password: "hash-mock-astrodev", // senha = "astrodev99"
    role: USER_ROLES.ADMIN,
    created_at: dateString,
  },
  {
    id: "id-mock-beltrana",
    nickname: "Beltrana",
    email: "beltrana@email.com",
    password: "hash-mock-beltrana", // senha = "beltrana555"
    role: USER_ROLES.NORMAL,
    created_at: dateString,
  },
];

export class UserDatabaseMock extends BaseDatabase {
  public static TABLE_USERS = "users";

  public async insertUser(newUserDB: UserDB): Promise<void> {}

  public async findUserByEmail(email: string): Promise<UserDB | undefined> {    
    return usersMock.filter((user) => user.email === email)[0];
  }

  public async findUserByNickname(
    nickname: string
  ): Promise<UserDB | undefined> {
    return usersMock.filter((user) => user.nickname === nickname)[0];
  }

  public async findUserById(id: string): Promise<UserDB | undefined> {
    return usersMock.filter((user) => user.id === id)[0];
  }

  public async findUsers(q: string | undefined): Promise<UserDB[]> {
    if (q) {
      return usersMock.filter((user) =>
        user.nickname.toLocaleLowerCase().includes(q.toLocaleLowerCase())
      );
    } else {
      return usersMock;
    }
  }

  public updateUser = async (userDB: UserDB): Promise<void> => {};
}
