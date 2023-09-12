import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { CreateCommentSchema } from "../../../src/dtos/comment/createComment.dto";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";

describe("Testando createComment", () => {
  const commentBusiness = new CommentBusiness(
    new UserDatabaseMock(),
    new CommentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Deve criar um comment com sucesso", async () => {
    const input = CreateCommentSchema.parse({
      postId: "id-mock-post1",
      token: "token-mock-fulano",
      content: "Conteúdo do comment",
    });
    const response = await commentBusiness.createComment(input);

    expect(response).toBeDefined();
    expect(response.message).toBe("Comentário criado com sucesso!");
  });

  test("Deve retornar erro de autenticação se o token não for válido", async () => {
    expect.assertions(3);
    const input = CreateCommentSchema.parse({
      postId: "id-mock-post1",
      token: "token-invalido",
      content: "Conteúdo do comment",
    });
    try {
      await commentBusiness.createComment(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });

  test("Deve retornar erro se o id do post não existir", async () => {
    expect.assertions(3);
    const input = CreateCommentSchema.parse({
      postId: "id-mock-post-inexistente",
      token: "token-mock-fulano",
      content: "Conteúdo do comment",
    });
    try {
      await commentBusiness.createComment(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof NotFoundError) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("'post' com essa id não existe!");
      }
    }
  });
});
