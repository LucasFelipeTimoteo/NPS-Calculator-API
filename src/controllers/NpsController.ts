import { Request, Response } from "express";
import { getCustomRepository, Not, IsNull } from "typeorm";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";

export class NpsController {
  async execute(req: Request, res: Response) {
    const { survey_id } = req.params

    const surveyUserRepo = getCustomRepository(SurveysUsersRepository)

    const surveysUsers = await surveyUserRepo.find({
      survey_id,
      value: Not(IsNull())
    })

    const detractors = surveysUsers.filter(survey => (
      survey.value >= 0 && survey.value <= 6
    )).length

    const promoters = surveysUsers.filter(survey => (
      survey.value >= 9 && survey.value <= 10
    )).length

    //passives não serão utilizados no calculo final, nós apenas mostraremos eles
    const passives = surveysUsers.filter(survey => (
      survey.value >= 7 && survey.value <= 8
    )).length

    const totalAnswers = surveysUsers.length;

    const calculateNps = ((promoters - detractors) / totalAnswers) * 100;
    const nps = Number(calculateNps.toFixed(2))

    return res.json({
      detractors,
      passives,
      promoters,
      totalAnswers,
      nps
    })
  }
}