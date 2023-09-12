import { Request, Response } from "express";
import { UserBusiness } from "../business/UserBusiness";
import { SignupSchema } from "../dtos/user/signup.dto";
import { ZodError } from "zod";
import { BaseError } from "../errors/BaseError";
import { LoginSchema } from "../dtos/user/login.dto";
import { GetUsersSchema } from "../dtos/user/getUsers.dto";
import { EditUserSchema } from "../dtos/user/editUser.dto";

export class UserController {
  constructor(private userBusiness: UserBusiness) {}
  public signup = async (req: Request, res: Response) => {
    try {
      const input = SignupSchema.parse({
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.password,
      });

      const output = await this.userBusiness.signup(input);

      res.status(201).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public login = async (req: Request, res: Response) => {
    try {
      const input = LoginSchema.parse({
        email: req.body.email,
        password: req.body.password,
      });

      const output = await this.userBusiness.login(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public getUsers = async (req: Request, res: Response) => {
    try {
      const input = GetUsersSchema.parse({
        q: req.query.q,
        token: req.headers.authorization,
      });

      const output = await this.userBusiness.getUsers(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };

  public editUser = async (req: Request, res: Response) => {
    try {
      const input = EditUserSchema.parse({
        idToEdit: req.params.id,
        token: req.headers.authorization,
        nickname: req.body.nickname,
        email: req.body.email,
        password: req.body.password,
      });

      const output = await this.userBusiness.editUser(input);

      res.status(200).send(output);
    } catch (error) {
      console.log(error);

      if (error instanceof ZodError) {
        res.status(400).send(error.issues);
      } else if (error instanceof BaseError) {
        res.status(error.statusCode).send(error.message);
      } else {
        res.status(500).send("Erro inesperado");
      }
    }
  };
}
