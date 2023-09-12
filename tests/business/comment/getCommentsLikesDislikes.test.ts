import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";
import { GetCommentsLikesDislikesSchema } from "../../../src/dtos/comment/getCommentsLikesDislikes.dto";

describe("Testando getCommentsLikesDislikes", () => {
  const commentBusiness = new CommentBusiness(
    new UserDatabaseMock(),
    new CommentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );
  test("Deve retornar os posts de like e  deslike com sucesso", async () => {
    const input = GetCommentsLikesDislikesSchema.parse({
      token: "token-mock-fulano",
    });
    const output = await commentBusiness.getCommentsLikesDislikes(input);
    expect(output).toBeDefined();
    expect(output).toHaveLength(2);
    expect(output).toEqual([
      {
        userId: "id-mock-fulano",
        commentId: "id-mock-comment2",
        like: 1,
      },
      {
        userId: "id-mock-astrodev",
        commentId: "id-mock-comment1",
        like: 0,
      },
    ]);
  });

  test("Deve retornar erro de autenticação se o token não for válido", async () => {
    expect.assertions(3);
    const input = GetCommentsLikesDislikesSchema.parse({
      token: "token-invalido",
    });
    try {
      await commentBusiness.getCommentsLikesDislikes(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });
});
