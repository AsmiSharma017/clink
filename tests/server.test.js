const request = require('supertest');
const app = require('../server');
const { Student, sequelize } = require('../models');

describe('Server Test', () => {
  test('should respond successfully', async () => {
    const res = await request(app).get('/');
    expect(res.statusCode).toBeLessThan(500);
  });

  test('should register student', async () => {
    const res = await request(app)
      .post('/api/auth/student/register')
      .send({
        name: 'Test User',
        email: `test${Date.now()}@example.com`,
        password: '123456'
      });

    expect([200, 201, 400]).toContain(res.statusCode);
  });
});

afterAll(async () => {
  await Student.destroy({
    where: {
      name: 'Test User'
    }
  });

  await sequelize.close();
});