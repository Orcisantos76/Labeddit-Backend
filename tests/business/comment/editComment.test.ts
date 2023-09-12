import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { EditCommentSchema } from "../../../src/dtos/comment/editComment.dto";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { ConflictError } from "../../../src/errors/ConflictError";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";

describe("Testando editComment", () => {
  const commentBusiness = new CommentBusiness(
    new UserDatabaseMock(),
    new CommentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Deve editar o comentário com sucesso", async () => {
    const input = EditCommentSchema.parse({
      idToEdit: "id-mock-comment1",
      token: "token-mock-fulano",
      content: "Novo conteúdo do comment 1",
    });
    const output = await commentBusiness.editComment(input);

    expect(output).toBeDefined();
    expect(output.message).toBe("'comment' editado com sucesso!");
  });

  test("Deve retornar erro de autenticação se o token não for válido", async () => {
    expect.assertions(3);
    const input = EditCommentSchema.parse({
      idToEdit: "id-mock-comment1",
      token: "token-invalido",
      content: "Novo conteúdo do comment 1",
    });
    try {
      await commentBusiness.editComment(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });

  test("Deve retornar erro de 'comment' não encontrado se o comentário não existir", async () => {
    expect.assertions(3);
    const input = EditCommentSchema.parse({
      idToEdit: "id-inexistente",
      token: "token-mock-fulano",
      content: "Novo conteúdo do comment 1",
    });
    try {
      await commentBusiness.editComment(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof NotFoundError) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("'comment' com essa id não existe!");
      }
    }
  });

  test("Deve retornar erro de permissão se o usuário não for o criador do comentário", async () => {
    expect.assertions(3);
    const input = EditCommentSchema.parse({
      idToEdit: "id-mock-comment1",
      token: "token-mock-beltrana",
      content: "Novo conteúdo do comment 1",
    });
    try {
      await commentBusiness.editComment(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof ForbiddenError) {
        expect(error.statusCode).toBe(403);
        expect(error.message).toBe(
          "Somente quem criou o 'comment' pode editá-la!"
        );
      }
    }
  });

  test("Deve retornar erro de conflito se já existir um comentário com o mesmo conteúdo", async () => {
    expect.assertions(3);
    const input = EditCommentSchema.parse({
      idToEdit: "id-mock-comment1",
      token: "token-mock-fulano",
      content: "Conteúdo do comment 1",
    });
    try {
      await commentBusiness.editComment(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof ConflictError) {
        expect(error.statusCode).toBe(409);
        expect(error.message).toBe("Já existe um 'comment' com esse conteúdo!");
      }
    }
  });
});
