import { Request, response, Response } from "express";
import { getCustomRepository } from "typeorm";
import { Survey } from "../models/Survey";
import { SurveyRepository } from "../repositories/SurveyRepository";

class SurveyController {
  async create(req: Request, res: Response) {
    const { title, description } = req.body

    const surveyRepo = getCustomRepository(SurveyRepository)

    const survey = surveyRepo.create({
      title,
      description
    });

    await surveyRepo.save(survey)

    return res.status(201).json(survey)
  }

  async show(req: Request, res: Response) {
    const surveyRepo = getCustomRepository(SurveyRepository)

    const all = await surveyRepo.find()

    return res.status(200).json(all)
  }
}

export { SurveyController }