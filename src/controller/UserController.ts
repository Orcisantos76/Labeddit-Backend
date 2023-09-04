import { Request, Response } from "express";
import { ZodError } from "zod";
import { UserBusiness } from "../business/UserBusiness";
import { SignupInputDTO, SignupOutputDTO, SignupSchema } from "../dtos/User/signup.dto";
import { BaseError } from "../errors/BaseError";
import { LoginInputDTO, LoginSchema, loginOutputDTO } from "../dtos/User/login.dto";

export class UserController{
    constructor(
        private userBusiness: UserBusiness
    ){}
    public signup = async (req: Request, res: Response):Promise<void> => {
        try {
          const input:SignupInputDTO = SignupSchema.parse({
            name: req.body.name,
            email: req.body.email,
            password: req.body.password
          })
    
          const output:SignupOutputDTO = await this.userBusiness.signup(input)
          res.status(201).send(output)
  
        } catch (error) {
          console.log(error)
    
          if (error instanceof ZodError) {
            res.status(400).send(error.issues)
          } else if (error instanceof BaseError) {
            res.status(error.statusCode).send(error.message)
          } else {
            res.status(500).send("Erro inesperado 2.")
          }
        }
    }
  
    public login = async (req: Request, res: Response):Promise<void> => {
      try {
        const input:LoginInputDTO = LoginSchema.parse({
          email: req.body.email,
          password: req.body.password
        })
  
        const output:loginOutputDTO = await this.userBusiness.login(input)
        res.status(200).send(output)
  
      } catch (error) {
        console.log(error)
  
        if (error instanceof ZodError) {
          res.status(400).send(error.issues)
        } else if (error instanceof BaseError) {
          res.status(error.statusCode).send(error.message)
        } else {
          res.status(500).send("Erro inesperado.")
        }
      }
    }
  
}