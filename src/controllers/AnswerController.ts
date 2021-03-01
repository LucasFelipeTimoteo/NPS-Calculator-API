import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";
import { AppError } from "../errors/AppError";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

export class AnswerController {
  async execute(req: Request, res: Response) {
    const { value } = req.params
    const { u } = req.query

    const surveyuserRepo = getCustomRepository(SurveysUsersRepository)

    const surveyuser = await surveyuserRepo.findOne({
      id: String(u),
    })

    if(!surveyuser) {
      throw new AppError("Survey User does not exists!")
    }

    surveyuser.value = Number(value)

    await surveyuserRepo.save(surveyuser)

    return res.json(surveyuser)
  }
}