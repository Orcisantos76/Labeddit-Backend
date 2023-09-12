import { CommentBusiness } from "../../../src/business/CommentBusiness";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { CommentDatabaseMock } from "../../mocks/CommentDatabaseMock";
import { GetCommentsByPostSchema } from "../../../src/dtos/comment/getCommentsByPost.dto";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { UserDatabaseMock } from "../../mocks/UserDatabaseMock";

describe("Testando getCommentsByPost", () => {
  const commentBusiness = new CommentBusiness(
    new UserDatabaseMock(),
    new CommentDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Deve retornar os comentários do post com sucesso", async () => {
    const input = GetCommentsByPostSchema.parse({
      postId: "id-mock-post1",
      token: "token-mock-fulano",
    });
    const output = await commentBusiness.getCommentsByPost(input);

    expect(output).toBeDefined();
    expect(output).toHaveLength(2);
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
          avatar:
            "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
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
          avatar:
            "https://www.gravatar.com/avatar/00000000000000000000000000000000?d=mp&f=y",
        },
      },
    ]);
  });

  test("Deve retornar erro de autenticação se o token não for válido", async () => {
    expect.assertions(3);
    const input = GetCommentsByPostSchema.parse({
      postId: "id-mock-post1",
      token: "token-invalido",
    });
    try {
      await commentBusiness.getCommentsByPost(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });

  test("Deve retornar erro de 'post' não encontrado se o post não existir", async () => {
    expect.assertions(3);
    const input = GetCommentsByPostSchema.parse({
      postId: "id-inexistente",
      token: "token-mock-fulano",
    });
    try {
      await commentBusiness.getCommentsByPost(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof NotFoundError) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("'post' com essa id não existe!");
      }
    }
  });
});
