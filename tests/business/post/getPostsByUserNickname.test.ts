import { PostBusiness } from "../../../src/business/PostBusiness";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { GetPostsByUserNicknameSchema } from "../../../src/dtos/post/getPostsByUserNickname.dto";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";

describe("Testando getPostsByUserNickname", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Deve retornar os posts do usuário com sucesso", async () => {
    const input = GetPostsByUserNicknameSchema.parse({
      nickname: "Fulano",
      token: "token-mock-fulano",
    });
    const output = await postBusiness.getPostsByUserNickname(input);
    expect(output).toBeDefined();
    expect(output).toHaveLength(1);
    expect(output).toEqual([
      {
        id: "id-mock-post2",
        content: "Conteúdo do post 2",
        likes: 5,
        dislikes: 1,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        creator: { id: "id-mock-fulano", nickname: "Fulano" },
      },
    ]);
  });

  test("Deve retornar erro de autenticação se o token não for válido", async () => {
    expect.assertions(3);
    const input = GetPostsByUserNicknameSchema.parse({
      nickname: "Fulano",
      token: "token-invalido",
    });
    try {
      await postBusiness.getPostsByUserNickname(input);
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
    const input = GetPostsByUserNicknameSchema.parse({
      nickname: "Astrodev",
      token: "token-mock-fulano",
    });
    try {
      await postBusiness.getPostsByUserNickname(input);
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
