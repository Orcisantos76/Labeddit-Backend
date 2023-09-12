import { PostBusiness } from "../../../src/business/PostBusiness";
import { IdGeneratorMock } from "../../mocks/IdGeneratorMock";
import { TokenManagerMock } from "../../mocks/TokenManagerMock";
import { PostDatabaseMock } from "../../mocks/PostDatabaseMock";
import { EditPostSchema } from "../../../src/dtos/post/editPost.dto";
import { UnauthorizedError } from "../../../src/errors/UnauthorizedError";
import { NotFoundError } from "../../../src/errors/NotFoundError";
import { ForbiddenError } from "../../../src/errors/ForbiddenError";
import { ConflictError } from "../../../src/errors/ConflictError";

describe("Testando editPost", () => {
  const postBusiness = new PostBusiness(
    new PostDatabaseMock(),
    new IdGeneratorMock(),
    new TokenManagerMock()
  );

  test("Deve editar o post com sucesso", async () => {
    const input = EditPostSchema.parse({
      idToEdit: "id-mock-post1",
      token: "token-mock-astrodev",
      content: "Novo conteúdo do post 1",
    });
    const output = await postBusiness.editPost(input);
    expect(output).toBeDefined();
    expect(output.message).toBe("'post' editado com sucesso!");
  });

  test("Deve retornar erro de autenticação se o token não for válido", async () => {
    expect.assertions(3);
    const input = EditPostSchema.parse({
      idToEdit: "id-mock-post1",
      token: "token-invalido",
      content: "Novo conteúdo do post 1",
    });
    try {
      await postBusiness.editPost(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof UnauthorizedError) {
        expect(error.statusCode).toBe(401);
        expect(error.message).toBe("Token inválido");
      }
    }
  });

  test("Deve retornar erro de 'post' não encontrado se o idToEdit for inválido", async () => {
    expect.assertions(3);
    const input = EditPostSchema.parse({
      idToEdit: "id-invalido",
      token: "token-mock-astrodev",
      content: "Novo conteúdo do post 1",
    });
    try {
      await postBusiness.editPost(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof NotFoundError) {
        expect(error.statusCode).toBe(404);
        expect(error.message).toBe("'post' com essa id não existe!");
      }
    }
  });

  test("Deve retornar erro de permissão se o usuário não for o criador do post", async () => {
    expect.assertions(3);
    const input = EditPostSchema.parse({
      idToEdit: "id-mock-post1",
      token: "token-mock-fulano",
      content: "Novo conteúdo do post 1",
    });
    try {
      await postBusiness.editPost(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof ForbiddenError) {
        expect(error.statusCode).toBe(403);
        expect(error.message).toBe("Somente quem criou o 'post' pode editar!");
      }
    }
  });

  test("Deve retornar erro de conflito se o conteúdo já existir em outro post do mesmo criador", async () => {
    expect.assertions(3);
    const input = EditPostSchema.parse({
      idToEdit: "id-mock-post1",
      token: "token-mock-astrodev",
      content: "Conteúdo do post 1",
    });
    try {
      await postBusiness.editPost(input);
    } catch (error) {
      expect(error).toBeDefined();
      if (error instanceof ConflictError) {
        expect(error.statusCode).toBe(409);
        expect(error.message).toBe("Já existe um 'post' com esse conteúdo!");
      }
    }
  });
});
