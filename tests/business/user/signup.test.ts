import { ZodError } from "zod";
import { UserBusiness } from "../../../src/business/UserBusiness";
import { SignupSchema } from "../../../src/dtos/user/signup.dto";
import { HashManagerMock } from "../../mocks/HashManagerMock";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { ConflictError } from "../../../src/errors/ConflictError";

describe("Testando signup", () => {
  const userBusiness = new UserBusiness(
    new UserDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock(),
    new HashManagerMock()
  );

  test("deve gerar token ao cadastrar", async () => {
    const input = SignupSchema.parse({
      nickname: "Ciclana",
      email: "ciclana@email.com",
      password: "ciclana321",
    });

    const output = await userBusiness.signup(input);

    expect(output).toEqual({
      message: "Cadastro realizado com sucesso",
      token: "token-mock",
    });
  });

  test("Deve cadastrar um usuário com sucesso", async () => {
    const input = SignupSchema.parse({
      nickname: "Fulanoteste",
      email: "fulano@teste.com",
      password: "fulano123",
    });
    const response = await userBusiness.signup(input);

    expect(response).toBeDefined();
    expect(response.message).toBe("Cadastro realizado com sucesso");
    expect(response.token).toBe("token-mock");
  });

  test("Deve retornar um erro de conflito se o nickname já estiver cadastrado", async () => {
    expect.assertions(3);
    const input = SignupSchema.parse({
      nickname: "Fulano",
      email: "fulano@teste.com",
      password: "fulano123",
    });
    try {
      await userBusiness.signup(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof ConflictError) {
        expect(error.statusCode).toBe(409);
        expect(error.message).toBe("'nickname' já existe!");
      }
    }
  });

  test("Deve retornar um erro de conflito se o email já estiver cadastrado", async () => {
    expect.assertions(3);
    const input = SignupSchema.parse({
      nickname: "FulanoZ",
      email: "fulano@email.com",
      password: "fulano123",
    });
    try {
      await userBusiness.signup(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof ConflictError) {
        expect(error.statusCode).toBe(409);
        expect(error.message).toBe("'email' já existe!");
      }
    }
  });

  test("deve disparar erro se o nickname não possuir pelo menos 2 caracteres", async () => {
    expect.assertions(1);

    try {
      const input = SignupSchema.parse({
        nickname: "",
        email: "ciclana@email.com",
        password: "ciclana321",
      });

      await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "'nickname' deve ter pelo menos 5 caracteres, sem espaços e sem caracteres especiais."
        );
      }
    }
  });

  test("deve disparar erro se o email não for válido", async () => {
    expect.assertions(1);

    try {
      const input = SignupSchema.parse({
        nickname: "Ciclana",
        email: "email-invalido",
        password: "ciclana321",
      });

      await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe("'email' inválido");
      }
    }
  });

  test("deve disparar erro se a senha não possuir pelo menos 7 caracteres", async () => {
    expect.assertions(1);

    try {
      const input = SignupSchema.parse({
        nickname: "Ciclana",
        email: "email@ciclana.com",
        password: "12345",
      });

      await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "'password' deve ter pelo menos 7 caracteres, incluindo pelo menos 2 números e 5 letras."
        );
      }
    }
  });

  test("deve disparar erro se a senha não conter números", async () => {
    expect.assertions(1);

    try {
      const input = SignupSchema.parse({
        nickname: "Ciclana",
        email: "email@ciclana.com",
        password: "ciclana",
      });

      await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe(
          "'password' deve ter pelo menos 7 caracteres, incluindo pelo menos 2 números e 5 letras."
        );
      }
    }
  });

  test("Deve disparar erro se o o nickname não  for válido", async () => {
    expect.assertions(1);

    try {
      const input = SignupSchema.parse({
        name: "",
        email: "ciclana@email.com",
        password: "ciclana123",
      });

      const output = await userBusiness.signup(input);
    } catch (error) {
      if (error instanceof ZodError) {
        expect(error.issues[0].message).toBe("'nickname' é obrigatório");
      }
    }
  });
});
