import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { GetCommentsByUserNicknameSchema } from "../../../src/dtos/comment/getCommentsByUserNickname.dto";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";

describe("Testando getCommentsByUserNickname", () => {
  const commentBusiness = new CommentBusiness(
    new UserDatabaseMock(),
    new CommentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Deve retornar os comentários do usuário com sucesso", async () => {
    const input = GetCommentsByUserNicknameSchema.parse({
      nickname: "Fulano",
      token: "token-mock-fulano",
    });
    const output = await commentBusiness.getCommentsByUserNickname(input);
    expect(output).toBeDefined();
    expect(output).toHaveLength(1);
    expect(output).toEqual([
      {
        id: "id-mock-comment1",
        postId: "id-mock-post1",
        content: "Conteúdo do comment 1",
        likes: 1,
        dislikes: 2,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        creator: {
          id: "id-mock-fulano",
          nickname: "Fulano",
          },
      },
    ]);
  });

  test("Deve retornar erro de autenticação se o token não for válido", async () => {
    expect.assertions(3);
    const input = GetCommentsByUserNicknameSchema.parse({
      nickname: "Fulano",
      token: "token-invalido",
    });
    try {
      await commentBusiness.getCommentsByUserNickname(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });

  test("Deve retornar erro de autenticação se o token não for de admin ou da mesma pessoa do nickname", async () => {
    expect.assertions(3);
    const input = GetCommentsByUserNicknameSchema.parse({
      nickname: "Fulano",
      token: "token-mock-beltrana",
    });
    try {
      await commentBusiness.getCommentsByUserNickname(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof ForbiddenError) {
        expect(error.statusCode).toBe(403);
        expect(error.message).toBe(
          "Somente admin e o próprio usuário podem acessar esse endpoint!"
        );
      }
    }
  });
});
