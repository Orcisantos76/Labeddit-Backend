import { PostBusiness } from "../../../src/business/PostBusiness";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { DeletePostSchema } from "../../../src/dtos/post/deletePost.dto";

describe("Testando deletePost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Deve deletar o post com sucesso", async () => {
    const input = DeletePostSchema.parse({
      idToDelete: "id-mock-post1",
      token: "token-mock-astrodev",
    });
    const output = await postBusiness.deletePost(input);
    expect(output).toBeDefined();
    expect(output.message).toBe("'post' deletado com sucesso!");
  });

  test("Deve retornar erro de autenticação se o token não for válido", async () => {
    expect.assertions(3);
    const input = DeletePostSchema.parse({
      idToDelete: "id-mock-post1",
      token: "token-invalido",
    });
    try {
      await postBusiness.deletePost(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });

  test("Deve retornar erro de 'post' não encontrado se o idToDelete for inválido", async () => {
    expect.assertions(3);
    const input = DeletePostSchema.parse({
      idToDelete: "id-invalido",
      token: "token-mock-astrodev",
    });
    try {
      await postBusiness.deletePost(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof NotFoundError) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("'post' com essa id não existe!");
      }
    }
  });

  test("Deve retornar erro de permissão se o usuário não for o criador ou administrador", async () => {
    expect.assertions(3);
    const input = DeletePostSchema.parse({
      idToDelete: "id-mock-post1",
      token: "token-mock-fulano",
    });
    try {
      await postBusiness.deletePost(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof ForbiddenError) {
        expect(error.statusCode).toBe(403);
        expect(error.message).toBe("Somente quem criou o 'post' pode deletar!");
      }
    }
  });
});
