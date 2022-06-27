const request = require('supertest');
const app = require('../index');
const { faker } = require('@faker-js/faker');

describe('Test of routes', () => {
    test('Should successfully create new user', async () => {
        const newUser = {
            name: faker.lorem.words(2),
            email: faker.internet.email(),
            psw: faker.lorem.words(1),
            isAdmin: faker.datatype.boolean()
        };
        const {body, statusCode} = await request(app).post('/user').send(newUser);

        expect(body.name).toBe(newUser.name);
    });
});