const request = require('supertest');
const app = require('../index');
const { faker } = require('@faker-js/faker');
const { Users } = require('../models');
const { Posts } = require('../models');
const { Audios } = require('../models');
const cloudinary = require('cloudinary').v2;
require('dotenv').config();

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
});

describe('User route tests', () => {
    test('Should successfully create new user', async () => {
        const newUser = {
            name: faker.lorem.words(2),
            email: faker.internet.email(),
            psw: faker.lorem.words(1),
            isAdmin: faker.datatype.boolean()
        };
        const { body, statusCode } = await request(app).post('/user').send(newUser);
        
        expect(body.name).toBe(newUser.name);
    });
});

describe('Text route tests', () => {
    test('Should successfully create new text', async () => {
        const newUser = {
            name: faker.lorem.words(2),
            email: faker.internet.email(),
            psw: faker.lorem.words(1),
            isAdmin: faker.datatype.boolean()
        };

        let randomUser = await Users.create(newUser);
        const newText = {
            title: faker.lorem.words(2),
            subtitle: faker.lorem.words(4),
            text: faker.lorem.words(10),
            userId: randomUser.id
        };

        const { body, statusCode } = await request(app).post('/text').send(newText);

        expect(body.title).toBe(newText.title);
    });

    test('Should update a text successfully', async () => {
        const newUser = {
            name: faker.lorem.words(2),
            email: faker.internet.email(),
            psw: faker.lorem.words(1),
            isAdmin: faker.datatype.boolean()
        };

        let randomUser = await Users.create(newUser);
        const newText = {
            title: faker.lorem.words(2),
            subtitle: faker.lorem.words(4),
            text: faker.lorem.words(10),
            userId: randomUser.id
        };

        let randomText = await Posts.create(newText);
        const updateText = {
            title: faker.lorem.words(2),
            subtitle: faker.lorem.words(4),
            text: faker.lorem.words(10)
        };
        const { body, statusCode } = await request(app).put(`/text/${randomText.id}`).send(updateText);
        
        expect(`${body}`).toBe('1');
    });

    test('Should get text object successfully', async () => {
        const newUser = {
            name: faker.lorem.words(2),
            email: faker.internet.email(),
            psw: faker.lorem.words(1),
            isAdmin: faker.datatype.boolean()
        };

        let randomUser = await Users.create(newUser);
        const newText = {
            title: faker.lorem.words(2),
            subtitle: faker.lorem.words(4),
            text: faker.lorem.words(10),
            userId: randomUser.id
        };
        
        let randomText = await Posts.create(newText);
        const { body, statusCode } = await request(app).get(`/text/${randomText.id}`);

        expect(body.id).toBe(randomText.id);
    });

    test('Should get all texts of user successfully', async () => {
        const newUser = {
            name: faker.lorem.words(2),
            email: faker.internet.email(),
            psw: faker.lorem.words(1),
            isAdmin: faker.datatype.boolean()
        };

        let randomUser = await Users.create(newUser);
        
        const { body, statusCode } = await request(app).get(`/user/${randomUser.id}/texts`);

        for(let i = 0; i < body.length; i++){
            expect(body[i].userId).toBe(process.env.ID_TEST);
        }
    });

    test('Should delete text object successfully', async () => {
        const newUser = {
            name: faker.lorem.words(2),
            email: faker.internet.email(),
            psw: faker.lorem.words(1),
            isAdmin: faker.datatype.boolean()
        };
        let randomUser = await Users.create(newUser);

        const newText = {
            title: faker.lorem.words(2),
            subtitle: faker.lorem.words(4),
            text: faker.lorem.words(10),
            userId: randomUser.id
        };
        let randomText = await Posts.create(newText);
        const { body, statusCode } = await request(app).delete(`/text/${randomText.id}`);

        expect(statusCode).toBe(200);
    });
});

describe('Audio route tests', () => {
    test('Should convert the text to audio successfully', async () => {
        const newUser = {
            name: faker.lorem.words(2),
            email: faker.internet.email(),
            psw: faker.lorem.words(1),
            isAdmin: faker.datatype.boolean()
        };
        let randomUser = await Users.create(newUser);

        const newText = {
            title: faker.lorem.words(2),
            subtitle: faker.lorem.words(4),
            text: faker.lorem.words(10),
            userId: randomUser.id
        };
        let randomText = await Posts.create(newText);

        const { body, statusCode } = await request(app).post(`/text/${randomText.id}/audio`);

        expect(body.postId).toBe(randomText.id);
    });

    test('Should get the audio successfully', async () => {
        const newUser = {
            name: faker.lorem.words(2),
            email: faker.internet.email(),
            psw: faker.lorem.words(1),
            isAdmin: faker.datatype.boolean()
        };
        let randomUser = await Users.create(newUser);

        const newText = {
            title: faker.lorem.words(2),
            subtitle: faker.lorem.words(4),
            text: faker.lorem.words(10),
            userId: randomUser.id
        };
        let randomText = await Posts.create(newText);

        const { body, statusCode } = await request(app).get(`/text/${randomText.id}/audio`);

        expect(statusCode).toBe(302);
    });

    test('Should successfully force a new conversion', async () => {
        const newUser = {
            name: faker.lorem.words(2),
            email: faker.internet.email(),
            psw: faker.lorem.words(1),
            isAdmin: faker.datatype.boolean()
        };
        let randomUser = await Users.create(newUser);

        const newText = {
            title: faker.lorem.words(2),
            subtitle: faker.lorem.words(4),
            text: faker.lorem.words(10),
            userId: randomUser.id
        };
        let randomText = await Posts.create(newText);

        const url = await cloudinary.uploader.upload(`http://api.voicerss.org/?key=${process.env.RSS_KEY}&hl=pt-br&src=${newText.text}`, 
            { resource_type: "video" },
            function(error, result) {
                console.log(result, error); 
            });
        
        const newAudio = {
            url: url.url,
            postId: randomText.id,
            userId: randomUser.id
        };
        let randomAudio = await Audios.create(newAudio);

        const { body, statusCode } = await request(app).put(`/text/${randomText.id}/audio/`);

        expect(`${body}`).toBe('1');
    });
});