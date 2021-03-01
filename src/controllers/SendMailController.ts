import { Request, Response } from "express";
import { getCustomRepository } from "typeorm";

import { SurveyRepository } from "../repositories/SurveyRepository";
import { SurveysUsersRepository } from "../repositories/SurveysUsersRepository";
import { UserRepository } from "../repositories/UserRepository";

import { resolve } from 'path'

import SendmailService from "../services/SendmailService";
import { AppError } from "../errors/AppError";

export class SendMailController {
  async execute(req: Request, res: Response) {
    const { email, survey_id } = req.body

    const usersRepo = getCustomRepository(UserRepository)
    const surveysRepo = getCustomRepository(SurveyRepository)
    const surveysUsersRepo = getCustomRepository(SurveysUsersRepository)

    const user = await usersRepo.findOne({ email });

    if (!user) {
      throw new AppError("User does not exists!")
    }

    const survey = await surveysRepo.findOne({ id: survey_id })

    if (!survey) {
      throw new AppError("Survey does not exists!")
    }

    const surveyuserAlreadyExists = await surveysUsersRepo.findOne({
      where: { user_id: user.id, value: null },
      relations: ['user', 'survey']
    })

    const variables = {
      name: user.name,
      title: survey.title,
      description: survey.description,
      id: "",
      link: process.env.URL_MAIL
    }

    const npsPath = resolve(__dirname, '..', 'views', 'emails', 'npsMail.hbs')

    if(surveyuserAlreadyExists) {
      variables.id = surveyuserAlreadyExists.id
      await SendmailService.execute(email, survey.title, variables, npsPath)
      return res.json(surveyuserAlreadyExists)
    }

    const surveyUser = surveysUsersRepo.create({
      user_id: user.id,
      survey_id,
    })

    await surveysUsersRepo.save(surveyUser)
    variables.id = surveyUser.id

    await SendmailService.execute(email, survey.title, variables, npsPath)

    return res.json(surveyUser)
  }
}