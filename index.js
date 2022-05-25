const express = require('express');
const app = express();
const { Users } = require('./models');
const { Posts } = require('./models');

app.use(express.json());

app.put('/text/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const postsBody = req.body;

        const posts = await Posts.update({
            title: postsBody.title,
            subtitle: postsBody.subtitle,
            text: postsBody.text
        }, {
            where: {
                id: id
            }
        });

        res.status(201).send(postsBody);
    } catch (error) {
        res.status(500).send('Deu errado' + error)
    }
});

app.put('/user/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const userBody = req.body;

        const user = await Users.update({
            name: userBody.name,
            email: userBody.email,
            psw: userBody.psw,
            isAdmin: userBody.isAdmin,   
        }, {
            where: {
                id: id
            }
        });

        res.status(201).send(userBody);
    } catch (error) {
        res.status(500).send('Deu errado' + error);
    }
    
});

app.get('/users', async (req, res) => {
    try {
        const user = await Users.findAll();

        res.status(201).send(user);
    } catch (error) {
        res.status(500).send('Deu errado' + error);
    }
});

app.post('/text', async (req, res) => {
    try {
        const postsBody = req.body;
        const posts = await Posts.create({
            title: postsBody.title,
            subtitle: postsBody.subtitle,
            text: postsBody.text,
            userId: postsBody.userId,
        });
        res.status(201).send(posts);
    } catch (error) {
        console.log(error);
        res.status(500).send('Deu errado' + error);
    }
});

app.post('/user', async (req, res) => {
    try {
        const userBody = req.body;
        const user = await Users.create({
            name: userBody.name,
            email: userBody.email,
            psw: userBody.psw,
            isAdmin: userBody.isAdmin
        });
        res.status(201).send(user);
    } catch (error) {
        console.log(error);
        res.status(500).send('Deu errado' + error);
    }
});

app.listen(6000, () => {
    console.log('Meu servidor esta rodando');
});