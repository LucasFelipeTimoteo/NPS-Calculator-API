import request from 'supertest'
import { getConnection } from 'typeorm'
import { app } from '../app'

import createConnection from '../database'

describe('Users', () => {
  beforeAll(async () => {
    const connection = await createConnection()
    await connection.runMigrations()
  })

  afterAll(async () => {
    const connection = getConnection();
    await connection.dropDatabase();
    await connection.close()
  })

  test('should be able to create a new user', async () => {
    const response = await request(app).post('/users').send({
      email: 'TESTE1@example.com',
      name: '123'
    })
    expect(response.status).toBe(201)
  })

  test('should not be able to create user with email that already exists', async () => {
    const response = await request(app).post('/users').send({
      email: 'TESTE1@example.com',
      name: '123'
    })
    expect(response.status).toBe(400)
  })
})
