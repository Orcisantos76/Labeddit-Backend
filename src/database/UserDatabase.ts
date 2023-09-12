import { UserDB } from "../models/User";
import { BaseDatabase } from "./BaseDatabase";

export class UserDatabase extends BaseDatabase {
  public static TABLE_USERS = "users";

  public async insertUser(newUserDB: UserDB): Promise<void> {
    await BaseDatabase.connection(UserDatabase.TABLE_USERS).insert(newUserDB);
  }

  public async findUserByEmail(email: string): Promise<UserDB | undefined> {
    const [userDB]: UserDB[] | undefined[] = await BaseDatabase.connection(
      UserDatabase.TABLE_USERS
    ).where({ email });
    return userDB;
  }

  public async findUserByNickname(
    nickname: string
  ): Promise<UserDB | undefined> {
    const [userDB]: UserDB[] | undefined[] = await BaseDatabase.connection(
      UserDatabase.TABLE_USERS
    ).where({ nickname });
    return userDB;
  }

  public async findUserById(id: string): Promise<UserDB | undefined> {
    const [userDB]: UserDB[] | undefined[] = await BaseDatabase.connection(
      UserDatabase.TABLE_USERS
    ).where({ id });
    return userDB;
  }

  public async findUsers(q: string | undefined): Promise<UserDB[]> {
    let usersDB;
    if (q) {
      const result: UserDB[] = await BaseDatabase.connection(
        UserDatabase.TABLE_USERS
      ).where("email", "LIKE", `${q}`);

      usersDB = result;
    } else {
      const result: UserDB[] = await BaseDatabase.connection(
        UserDatabase.TABLE_USERS
      );
      usersDB = result;
    }
    return usersDB;
  }

  public updateUser = async (userDB: UserDB): Promise<void> => {
    await BaseDatabase.connection(UserDatabase.TABLE_USERS)
      .update(userDB)
      .where({ id: userDB.id });
  };
}
