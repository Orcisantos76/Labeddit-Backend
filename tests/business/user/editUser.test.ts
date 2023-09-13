import { ZodError } from "zod";
import { UserBusiness } from "../../../src/business/UserBusiness";
import { EditUserSchema } from "../../../src/dtos/user/editUser.dto";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { ConflictError } from "../../../src/errors/ConflictError";

describe("Testando getUsers", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("Deve editar usuário corretamente quando dados válidos forem fornecidos por um admin", async () => {
    const input = EditUserSchema.parse({
      idToEdit: "id-mock-fulano",
      token: "token-mock-fulano",
      nickname: "fulanozinho",
      email: "fulanozinho@example.com",
      password: "novaSenha123",
    });

    const output = await userBusiness.editUser(input);

    expect(output).toEqual({
      message: "Cadastro atualizado com sucesso!",
    });
  });

  test("Deve retornar erro ao tentar editar usuário com um token inválido", async () => {
    expect.assertions(3);

    try {
      const input = EditUserSchema.parse({
        idToEdit: "id-mock-fulano",
        token: "token-errado",
        nickname: "fulanozinho",
        email: "fulanozinho@example.com",
      });

      const output = await userBusiness.editUser(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof UnauthorizedError) {
        expect(error.message).toBe("Token inválido");
        expect(error.statusCode).toBe(401);
      }
    }
  });

  test("Deve retornar erro ao tentar editar usuário com um id inválido", async () => {
    expect.assertions(3);

    try {
      const input = EditUserSchema.parse({
        idToEdit: "id-mock-fulano-inválido",
        token: "token-mock-fulano",
        nickname: "fulanozinho",
        email: "fulanozinho@example.com",
      });

      const output = await userBusiness.editUser(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("Não existe usuário com essa  id!");
        expect(error.statusCode).toBe(404);
      }
    }
  });

  test("Deve retornar erro ao tentar editar se não for o próprio usuário ou Admin tentando editar a conta de outra pessoa", async () => {
    expect.assertions(3);

    try {
      const input = EditUserSchema.parse({
        idToEdit: "id-mock-beltrana",
        token: "token-mock-fulano",
        nickname: "fulanozinho",
        email: "fulanozinho@example.com",
      });

      const output = await userBusiness.editUser(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof ForbiddenError) {
        expect(error.message).toBe(
          "Somente o próprio usuário pode editar a conta!"
        );
        expect(error.statusCode).toBe(403);
      }
    }
  });

  test("Deve retornar erro ao tentar editar o nickname para um nickname já cadastrado", async () => {
    expect.assertions(3);

    try {
      const input = EditUserSchema.parse({
        idToEdit: "id-mock-beltrana",
        token: "token-mock-beltrana",
        nickname: "Fulano",
        email: "fulanozinho@example.com",
      });

      const output = await userBusiness.editUser(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof ConflictError) {
        expect(error.message).toBe("Esse 'nickname' já existe!");
        expect(error.statusCode).toBe(409);
      }
    }
  });

  test("Deve retornar erro ao tentar editar o email para um email já cadastrado", async () => {
    expect.assertions(3);

    try {
      const input = EditUserSchema.parse({
        idToEdit: "id-mock-beltrana",
        token: "token-mock-beltrana",
        nickname: "Beltraninha",
        email: "fulano@email.com",
      });

      const output = await userBusiness.editUser(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof ConflictError) {
        expect(error.message).toBe("'email' já cadastrado!");
        expect(error.statusCode).toBe(409);
      }
    }
  });
});
