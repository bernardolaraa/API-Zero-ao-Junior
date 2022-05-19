const express = require('express');
const app = express();
const { Users } = require('./models');

app.use(express.json());

app.get('/users', async (req, res) => {
    try {
        const adminValue = req.query.isAdmin;
        let user;
    
        if(adminValue === true) user = await Users.findAll();
        else user = "Você não tem acesso a essa informação";

        res.send(user);
    } catch (error) {
        res.status(500).send('Error');
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
        res.status(500).send('Error');
    }
});

app.listen(6000, () => {
    console.log('Meu servidor esta rodando');
});