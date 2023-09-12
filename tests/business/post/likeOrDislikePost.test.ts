import { PostBusiness } from "../../../src/business/PostBusiness";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { LikeOrDislikePostSchema } from "../../../src/dtos/post/likeOrDislikePost.dto";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { ConflictError } from "../../../src/errors/ConflictError";

describe("Testando likeOrDislikePost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Deve adicionar um like ao post com sucesso", async () => {
    const input = LikeOrDislikePostSchema.parse({
      postId: "id-mock-post1",
      token: "token-mock-beltrana",
      like: true,
    });
    const output = await postBusiness.likeOrDislikePost(input);
    expect(output).toBeUndefined();
  });

  test("Deve adicionar um dislike ao post com sucesso", async () => {
    const input = LikeOrDislikePostSchema.parse({
      postId: "id-mock-post1",
      token: "token-mock-beltrana",
      like: false,
    });
    const output = await postBusiness.likeOrDislikePost(input);
    expect(output).toBeUndefined();
  });

  test("Deve remover um like do post com sucesso", async () => {
    const input = LikeOrDislikePostSchema.parse({
      postId: "id-mock-post1",
      token: "token-mock-fulano",
      like: true,
    });
    const output = await postBusiness.likeOrDislikePost(input);
    expect(output).toBeUndefined();
  });

  test("Deve remover um like do post com sucesso e adicionar um dislike", async () => {
    const input = LikeOrDislikePostSchema.parse({
      postId: "id-mock-post1",
      token: "token-mock-fulano",
      like: false,
    });
    const output = await postBusiness.likeOrDislikePost(input);
    expect(output).toBeUndefined();
  });

  test("Deve remover um dislike do post com sucesso", async () => {
    const input = LikeOrDislikePostSchema.parse({
      postId: "id-mock-post2",
      token: "token-mock-astrodev",
      like: false,
    });
    const output = await postBusiness.likeOrDislikePost(input);
    expect(output).toBeUndefined();
  });

  test("Deve remover um dislike e adicionar um like no post com sucesso", async () => {
    const input = LikeOrDislikePostSchema.parse({
      postId: "id-mock-post2",
      token: "token-mock-astrodev",
      like: true,
    });
    const output = await postBusiness.likeOrDislikePost(input);
    expect(output).toBeUndefined();
  });

  test("Deve retornar erro de autenticação se o token não for válido", async () => {
    expect.assertions(3);
    const input = LikeOrDislikePostSchema.parse({
      postId: "id-mock-post1",
      token: "token-invalido",
      like: true,
    });
    try {
      await postBusiness.likeOrDislikePost(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });

  test("Deve retornar erro de 'post' não encontrado se o postId for inválido", async () => {
    expect.assertions(3);
    const input = LikeOrDislikePostSchema.parse({
      postId: "id-invalido",
      token: "token-mock-fulano",
      like: true,
    });
    try {
      await postBusiness.likeOrDislikePost(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof NotFoundError) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("post com essa id não existe");
      }
    }
  });

  test("Deve retornar erro de conflito se o usuário tentar dar like ou dislike no próprio post", async () => {
    expect.assertions(3);
    const input = LikeOrDislikePostSchema.parse({
      postId: "id-mock-post1",
      token: "token-mock-astrodev",
      like: true,
    });
    try {
      await postBusiness.likeOrDislikePost(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof ConflictError) {
        expect(error.statusCode).toBe(409);
        expect(error.message).toBe(
          "Você não pode dar like ou deslike no 'post' que você criou!"
        );
      }
    }
  });
});
