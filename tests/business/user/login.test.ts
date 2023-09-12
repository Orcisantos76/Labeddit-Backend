import { ZodError } from "zod";
import { UserBusiness } from "../../../src/business/UserBusiness";
import { LoginSchema } from "../../../src/dtos/user/login.dto";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { BadRequestError } from "../../../src/errors/BadRequestError";

describe("Testando login", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("1. deve gerar token ao logar", async () => {
    const input = LoginSchema.parse({
      email: "fulano@email.com",
      password: "fulano123",
    });

    const output = await userBusiness.login(input);

    expect(output).toEqual({
      message: "Login realizado com sucesso",
      token: "token-mock-fulano",
    });
  });

  test("2. deve gerar token ao logar", async () => {
    const input = LoginSchema.parse({
      email: "astrodev@email.com",
      password: "astrodev99",
    });

    const output = await userBusiness.login(input);

    expect(output).toEqual({
      message: "Login realizado com sucesso",
      token: "token-mock-astrodev",
    });
  });

  test("3. deve gerar token ao logar", async () => {
    const input = LoginSchema.parse({
      email: "beltrana@email.com",
      password: "beltrana555",
    });

    const output = await userBusiness.login(input);

    expect(output).toEqual({
      message: "Login realizado com sucesso",
      token: "token-mock-beltrana",
    });
  });

  test("deve retornar erro quando email não for string", () => {
    expect.assertions(3);

    try {
      const input = LoginSchema.parse({
        email: 123,
        password: "fulano123",
      });
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe("'email' deve ser do tipo string");

        expect(error.issues[0].path[0]).toBe("email");

        expect(error.issues).toEqual([
          {
            code: "invalid_type",
            expected: "string",
            received: "number",
            path: ["email"],
            message: "'email' deve ser do tipo string",
          },
        ]);
      }
    }
  });

  test("deve retornar erro ao fazer login com um e-mail não registrado", async () => {
    expect.assertions(2);

    try {
      const input = LoginSchema.parse({
        email: "fulano@email-errado.com",
        password: "fulano123",
      });

      const output = await userBusiness.login(input);
    } catch (error) {
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("'email' ou 'senha' incorretos!");
        expect(error.statusCode).toBe(400);
      }
    }
  });

  test("deve retornar erro ao fazer login com uma senha incorreta", async () => {
    expect.assertions(3);

    try {
      const input = LoginSchema.parse({
        email: "fulano@email.com",
        password: "senhaIncorreta123",
      });

      const output = await userBusiness.login(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof BadRequestError) {
        expect(error.message).toBe("'email' ou 'senha' incorretos!");
        expect(error.statusCode).toBe(400);
      }
    }
  });
});
