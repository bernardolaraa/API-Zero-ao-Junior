const express = require('express');
const app = express();
const { Users } = require('./models');
const { Posts } = require('./models');
const { Audios } = require('./models');
const session = require('express-session');
const passport = require('passport');
const cloudinary = require('cloudinary').v2;

require('dotenv').config();
require('./config/auth')(passport);

cloudinary.config({ 
    cloud_name: process.env.CLOUD_NAME, 
    api_key: process.env.CLOUD_API_KEY, 
    api_secret: process.env.CLOUD_API_SECRET
});

app.use(session({
    secret: "PassportLogin",
    resave: false,
    saveUninitialized: false,
    cookie: {maxAge: 2 * 60 * 1000}
}));

app.use(express.json());

app.use(passport.initialize());
app.use(passport.session());

const login = function(req, res, next){
    res.locals.Users = req.Users || null
    console.log('LOGGED')
    next();
};

app.use(login);

function userAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.id == req.params.id){
            return next()
        }else{
            return res.status(401).json({msg: "Você precisa estar logado com o proprio usuario para acessar essa rota!"});
        };
    }else{
        return res.json({msg: "O usuario precisa estar logado para acessar essa rota!"});
    };
};

function adminAuthenticated(req, res, next){
    if(req.isAuthenticated()){
        if(req.user.isAdmin){
            return next()
        }else{
            return res.status(403).json({msg: "Você precisa ser um admin para acessar essa rota"});
        };
    }else{
        return res.json({msg: "O usuario precisa estar logado para acessar essa rota!"});
    };
};

app.get('/success', async (req, res) => {
    res.status(200).send('Usuario foi logado com Sucesso!');
});

app.get('/failure', async (req, res) => {
    res.status(403).send('Credenciais Inválidas!');
});

app.post('/auth', async (req, res, next) => {
    passport.authenticate('local', {
        successRedirect: "/success",
        failureRedirect: "/failure",
    })(req, res, next);
});

app.delete('/text/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const post = await Posts.destroy({
            where: {
                id: id
            }
        });

        res.status(200).send('Texto Deletado');
    } catch (error) {
        res.status(500).send('Deu errado ' + error);
    }
});

app.put('/text/:id/audio/', async (req, res) => {
    try {
        const postId = req.params.id;
        const text = await Posts.findOne({
            where: {
                id: postId
            }
        });

        const url = await cloudinary.uploader.upload("http://api.voicerss.org/?key=" + `${process.env.RSS_KEY}` + "&hl=pt-br&src=" + `${text.text}`, 
            { resource_type: "video" },
            function(error, result) {
                console.log(result, error); 
            });

        const audio = await Audios.update({
            url: url.url
        }, {
            where: {
                postId: postId
            }
        });

        res.status(200).send(audio);
    } catch (error) {
        res.status(500).send('Deu errado ' + error);
    }
});

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

        res.status(200).send(posts);
    } catch (error) {
        res.status(500).send('Deu errado ' + error);
    }
});

app.put('/user/:id', userAuthenticated, async  (req, res) => {
    try {
        const id = req.params.id;
        const userBody = req.body;
        const user = await Users.findByPk(id);
        console.log(user);

        if(!user) {
            return res.status(400).send('Usuario não encontrado!');
        }else{
            user.name = userBody.name;
            user.email = userBody.email;
            user.psw = userBody.psw;
        
            await user.save();
        }
        res.status(200).send(user);
    } catch (error) {
        res.status(500).send('Deu errado ' + error);
    }
});

app.get('/text/:id/audio/', async(req, res) => {
    try {
        const postId = req.params.id;
        let audio;

        if(audio = await Audios.findOne({where: {postId: postId}})){
            res.status(200).redirect(audio.url);
        }else{
            const text = await Posts.findOne({
                where: {
                    id: postId
                }
            });

            const url = await cloudinary.uploader.upload("http://api.voicerss.org/?key=" + `${process.env.RSS_KEY}` + "&hl=pt-br&src=" + `${text.text}`, 
            { resource_type: "video" },
            function(error, result) {
                console.log(result, error); 
            });

            const audioCreate = await Audios.create({
                url: url.url,
                postId: postId,
                userId: text.userId
            });

            res.status(201).redirect(audioCreate.url);
        };
    } catch (error) {
        res.status(500).send('Deu errado ' + error);
    }
});

app.get('/user/:id/texts', async (req, res) => {
    try {
        const id = req.params.id;

        const post = await Posts.findAll({
            where: {
                userId: id
            }
        });

        res.status(200).send(post);
    } catch (error) {
        res.status(500).send('Deu errado ' + error);
    }
});

app.get('/text/:id', async (req, res) => {
    try {
        const id = req.params.id;

        const post = await Posts.findOne({
            where: {
                id: id
            } 
        });
        
        res.status(200).send(post);
    } catch (error) {
        res.status(500).send('Deu errado ' + error);
    }
});

app.get('/users', adminAuthenticated, async (req, res) => {
    try {
        const user = await Users.findAll();

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send('Deu errado' + error);
    }
});



app.post('/text/:id/audio', async (req, res) => {
    try {
        const id = req.params.id;
        const text = await Posts.findOne({
            where: {
                id: id
            }
        });

        const url = await cloudinary.uploader.upload("http://api.voicerss.org/?key=" + `${process.env.RSS_KEY}` + "&hl=pt-br&src=" + `${text.text}`, 
            { resource_type: "video" },
            function(error, result) {
                console.log(result, error); 
            });

        const audios = await Audios.create({
            url: url.url,
            postId: id,
            userId: text.userId
        });

        res.status(201).send(audios);
    } catch (error) {
        res.status(500).send('Deu errado ' + error);
    }
});

app.post('/text', async (req, res) => {
    try {
        const postsBody = req.body;
        const post = await Posts.create({
            title: postsBody.title,
            subtitle: postsBody.subtitle,
            text: postsBody.text,
            userId: postsBody.userId
        });
        res.status(201).send(post);
    } catch (error) {
        console.log(error);
        res.status(500).send('Deu errado ' + error);
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
        res.status(500).send('Deu errado ' + error);
    }
});



app.listen(6000, () => {
    console.log('Meu servidor esta rodando');
});