import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { ConflictError } from "../../../src/errors/ConflictError";
import { LikeOrDislikeCommentSchema } from "../../../src/dtos/comment/likeOrDislikeComment.dto";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";

describe("Testando likeOrDislikeComment", () => {
  const commentBusiness = new CommentBusiness(
    new UserDatabaseMock(),
    new CommentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Deve adicionar um like ao comentário com sucesso", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      commentId: "id-mock-comment1",
      token: "token-mock-beltrana",
      like: true,
    });
    const output = await commentBusiness.likeOrDislikeComment(input);
    expect(output).toBeUndefined();
  });

  test("Deve adicionar um dislike ao comentário com sucesso", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      commentId: "id-mock-comment1",
      token: "token-mock-beltrana",
      like: false,
    });
    const output = await commentBusiness.likeOrDislikeComment(input);
    expect(output).toBeUndefined();
  });

  test("Deve remover um like do comentário com sucesso", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      commentId: "id-mock-comment2",
      token: "token-mock-fulano",
      like: true,
    });
    const output = await commentBusiness.likeOrDislikeComment(input);
    expect(output).toBeUndefined();
  });

  test("Deve remover um like do comentário com sucesso e adicionar um deslike", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      commentId: "id-mock-comment2",
      token: "token-mock-fulano",
      like: false,
    });
    const output = await commentBusiness.likeOrDislikeComment(input);
    expect(output).toBeUndefined();
  });

  test("Deve remover um dislike do comentário com sucesso", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      commentId: "id-mock-comment1",
      token: "token-mock-astrodev",
      like: false,
    });
    const output = await commentBusiness.likeOrDislikeComment(input);
    expect(output).toBeUndefined();
  });

  test("Deve remover um dislike do comentário com sucesso e adicionar um like", async () => {
    const input = LikeOrDislikeCommentSchema.parse({
      commentId: "id-mock-comment1",
      token: "token-mock-astrodev",
      like: true,
    });
    const output = await commentBusiness.likeOrDislikeComment(input);
    expect(output).toBeUndefined();
  });

  test("Deve retornar erro de autenticação se o token não for válido", async () => {
    expect.assertions(3);
    const input = LikeOrDislikeCommentSchema.parse({
      commentId: "id-mock-comment1",
      token: "token-invalido",
      like: true,
    });
    try {
      await commentBusiness.likeOrDislikeComment(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });

  test("Deve retornar erro de 'comment' não encontrado se o commentId for inválido", async () => {
    expect.assertions(3);
    const input = LikeOrDislikeCommentSchema.parse({
      commentId: "id-invalido",
      token: "token-mock-fulano",
      like: true,
    });
    try {
      await commentBusiness.likeOrDislikeComment(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof NotFoundError) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("comment com essa id não existe");
      }
    }
  });

  test("Deve retornar erro de conflito se o usuário tentar dar like ou dislike no próprio comentário", async () => {
    expect.assertions(3);
    const input = LikeOrDislikeCommentSchema.parse({
      commentId: "id-mock-comment1",
      token: "token-mock-fulano",
      like: true,
    });
    try {
      await commentBusiness.likeOrDislikeComment(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof ConflictError) {
        expect(error.statusCode).toBe(409);
        expect(error.message).toBe(
          "Você não pode dar like ou deslike no 'comment' que você criou!"
        );
      }
    }
  });
});
