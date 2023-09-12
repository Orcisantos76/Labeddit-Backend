import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { DeleteCommentSchema } from "../../../src/dtos/comment/deleteComment.dto";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";

describe("Testando deleteComment", () => {
  const commentBusiness = new CommentBusiness(
    new UserDatabaseMock(),
    new CommentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Deve deletar o comentário com sucesso", async () => {
    const input = DeleteCommentSchema.parse({
      idToDelete: "id-mock-comment1",
      token: "token-mock-fulano",
    });

    const output = await commentBusiness.deleteComment(input);

    expect(output).toBeDefined();
    expect(output.message).toBe("'comment' deletado com sucesso!");
  });

  test("Deve retornar erro de autenticação se o token não for válido", async () => {
    expect.assertions(3);
    const input = DeleteCommentSchema.parse({
      idToDelete: "id-mock-comment1",
      token: "token-invalido",
    });

    try {
      await commentBusiness.deleteComment(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });

  test("Deve retornar erro de 'comment' não encontrado se o 'comment' não existir", async () => {
    expect.assertions(2);
    const input = DeleteCommentSchema.parse({
      idToDelete: "id-inexistente",
      token: "token-mock-fulano",
    });

    try {
      await commentBusiness.deleteComment(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof NotFoundError) {
        expect(error.message).toBe("'comment' com essa id não existe!");
      }
    }
  });

  test("Deve retornar erro de permissão se o usuário não for o criador nem o administrador", async () => {
    expect.assertions(3);
    const input = DeleteCommentSchema.parse({
      idToDelete: "id-mock-comment2",
      token: "token-mock-fulano",
    });

    try {
      await commentBusiness.deleteComment(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof ForbiddenError) {
        expect(error.statusCode).toBe(403);
        expect(error.message).toBe(
          "Somente quem criou o 'comment' pode deletar!"
        );
      }
    }
  });
});
