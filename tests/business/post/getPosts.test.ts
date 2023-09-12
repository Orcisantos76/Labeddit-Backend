import { PostBusiness } from "../../../src/business/PostBusiness";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { GetPostsSchema } from "../../../src/dtos/post/getPosts.dto";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";

describe("Testando getPosts", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );
  test("Deve retornar os posts com sucesso", async () => {
    const input = GetPostsSchema.parse({
      token: "token-mock-fulano",
    });
    const output = await postBusiness.getPosts(input);
    expect(output).toBeDefined();
    expect(output).toHaveLength(3);
    expect(output).toEqual([
      {
        id: "id-mock-post1",
        content: "Conteúdo do post 1",
        likes: 10,
        dislikes: 2,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        creator: { id: "id-mock-astrodev", nickname: "Astrodev" },
      },
      {
        id: "id-mock-post2",
        content: "Conteúdo do post 2",
        likes: 5,
        dislikes: 1,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        creator: { id: "id-mock-fulano", nickname: "Fulano" },
      },
      {
        id: "id-mock-post3",
        content: "Conteúdo do post 3",
        likes: 3,
        dislikes: 0,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        creator: { id: "id-mock-beltrana", nickname: "Beltrana" },
      },
    ]);
  });

  test("Deve retornar erro de autenticação se o token não for válido", async () => {
    expect.assertions(3);
    const input = GetPostsSchema.parse({
      token: "token-invalido",
    });
    try {
      await postBusiness.getPosts(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });
});
