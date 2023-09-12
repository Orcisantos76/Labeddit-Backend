import { PostBusiness } from "../../../src/business/PostBusiness";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { GetPostsLikesDislikesSchema } from "../../../src/dtos/post/getPostsLikesDislikes.dto";

describe("Testando getPostsLikesDislikes", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );
  test("Deve retornar os posts de like e  deslike com sucesso", async () => {
    const input = GetPostsLikesDislikesSchema.parse({
      token: "token-mock-fulano",
    });
    const output = await postBusiness.getPostsLikesDislikes(input);
    expect(output).toBeDefined();
    expect(output).toHaveLength(2);
    expect(output).toEqual([
      { userId: "id-mock-fulano", postId: "id-mock-post1", like: 1 },
      { userId: "id-mock-astrodev", postId: "id-mock-post2", like: 0 },
    ]);
  });

  test("Deve retornar erro de autenticação se o token não for válido", async () => {
    expect.assertions(3);
    const input = GetPostsLikesDislikesSchema.parse({
      token: "token-invalido",
    });
    try {
      await postBusiness.getPostsLikesDislikes(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });
});
