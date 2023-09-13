import { UserBusiness } from "../../../src/business/UserBusiness";
import { GetUsersSchema } from "../../../src/dtos/user/getUsers.dto";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { USER_ROLES } from "../../../src/models/User";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";

describe("Testando getUsers", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("deve retornar lista de todos users", async () => {
    const input = GetUsersSchema.parse({
      token: "token-mock-astrodev",
    });

    const output = await userBusiness.getUsers(input);

    expect(output).toHaveLength(3);
    expect(output).toEqual([
      {
        id: "id-mock-fulano",
        nickname: "Fulano",
        email: "fulano@email.com",
        role: USER_ROLES.NORMAL,
        createdAt: expect.any(String),
      },
      {
        id: "id-mock-astrodev",
        nickname: "Astrodev",
        email: "astrodev@email.com",
        role: USER_ROLES.ADMIN,
        createdAt: expect.any(String),
      },
      {
        id: "id-mock-beltrana",
        nickname: "Beltrana",
        email: "beltrana@email.com",
        role: USER_ROLES.NORMAL,
        createdAt: expect.any(String),
      },
    ]);
  });

  test("Deve retornar usuários que o q for igual  ao nome encontrado", async () => {
    const input = GetUsersSchema.parse({
      q: "Astro",
      token: "token-mock-astrodev",
    });

    const output = await userBusiness.getUsers(input);

    expect(output).toHaveLength(1);
    expect(output).toEqual([
      {
        id: "id-mock-astrodev",
        nickname: "Astrodev",
        email: "astrodev@email.com",
        role: USER_ROLES.ADMIN,
        createdAt: expect.any(String),
      },
    ]);
  });

  test("deve retornar erro ao acessar getUsers sem um token válido", async () => {
    expect.assertions(2);

    try {
      const input = GetUsersSchema.parse({
        token: "token-invalido",
      });

      const output = await userBusiness.getUsers(input);
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido");
        expect(error.statusCode).toBe(401);
      }
    }
  });

  // test("deve retornar erro ao acessar getUsers sem permissão de administrador", async () => {
  //   expect.assertions(2);

  //   try {
  //     const input = GetUsersSchema.parse({
  //       token: "token-mock-fulano",
  //     });

  //     const output = await userBusiness.getUsers(input);
  //   } catch (error) {
  //     if (error instanceof BadRequestError) {
  //       expect(error.message).toBe("Somente admins podem acessar getUsers!");
  //       expect(error.statusCode).toBe(400);
  //     }
  //   }
  // });
});
