import { Request, Response } from "express";
import * as yup from 'yup'

import { getCustomRepository } from "typeorm";
import { UserRepository } from '../repositories/UserRepository';
import { AppError } from "../errors/AppError";

class UserController {
  async create(req: Request, res: Response) {
    const { name, email } = req.body;

    const schema = yup.object().shape({
      name: yup.string().required(),
      email: yup.string().email().required()
    });
    
    try {
      await schema.validate(req.body, { abortEarly: false })
    }
    catch (err) {
      throw new AppError(err)
    }

    const usersRepo = getCustomRepository(UserRepository)

    const userAlreadyExists = await usersRepo.findOne({ email })

    if (userAlreadyExists) {
      throw new AppError("User already exists!")
    }

    const user = usersRepo.create({
      name,
      email
    })
    await usersRepo.save(user)

    return res.status(201).json(user);
  }
}

export { UserController };
