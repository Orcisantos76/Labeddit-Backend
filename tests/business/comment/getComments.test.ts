import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { GetCommentsSchema } from "../../../src/dtos/comment/getComments.dto";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";

describe("Testando getComments", () => {
  const commentBusiness = new CommentBusiness(
    new UserDatabaseMock(),
    new CommentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Deve retornar os comments com sucesso", async () => {
    const input = GetCommentsSchema.parse({
      token: "token-mock-fulano",
    });
    const output = await commentBusiness.getComments(input);
    expect(output).toBeDefined();
    expect(output).toHaveLength(3);
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
      {
        id: "id-mock-comment2",
        postId: "id-mock-post1",
        content: "Conteúdo do comment 2",
        likes: 1,
        dislikes: 0,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        creator: {
          id: "id-mock-beltrana",
          nickname: "Beltrana",
        },
      },
      {
        id: "id-mock-comment3",
        postId: "id-mock-post2",
        content: "Conteúdo do comment 3",
        likes: 2,
        dislikes: 0,
        createdAt: expect.any(String),
        updatedAt: expect.any(String),
        creator: {
          id: "id-mock-beltrana",
          nickname: "Beltrana",
        },
      },
    ]);
  });

  test("Deve retornar erro de autenticação se o token não for válido", async () => {
    expect.assertions(3);
    const input = GetCommentsSchema.parse({
      token: "token-invalido",
    });
    try {
      await commentBusiness.getComments(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });
});
