import { PostBusiness } from "../../../src/business/PostBusiness";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { ConflictError } from "../../../src/errors/ConflictError";
import { CreatePostSchema } from "../../../src/dtos/post/createPost.dto";

describe("Testando createPost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Deve criar um post com sucesso", async () => {
    const input = CreatePostSchema.parse({
      token: "token-mock-fulano",
      content: "Conteúdo do post",
    });
    const response = await postBusiness.createPost(input);

    expect(response).toBeDefined();
    expect(response.message).toBe("Post criado com sucesso!");
  });

  test("Deve retornar erro de autenticação se o token não for válido", async () => {
    expect.assertions(3);
    const input = CreatePostSchema.parse({
      token: "token-invalido",
      content: "Conteúdo do post",
    });
    try {
      await postBusiness.createPost(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });

  test("Deve retornar erro de conflito se já existir um post com o mesmo conteúdo", async () => {
    expect.assertions(3);
    const input = CreatePostSchema.parse({
      token: "token-mock-fulano",
      content: "Conteúdo do post 2",
    });
    try {
      await postBusiness.createPost(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof ConflictError) {
        expect(error.statusCode).toBe(409);
        expect(error.message).toBe("Já existe um 'post' com esse conteúdo!");
      }
    }
  });
});
