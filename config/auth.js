const { Users } = require('../models');
const bcrypt = require('bcryptjs');
const LocalStrategy = require('passport-local').Strategy;

module.exports = function(passport){
    passport.use(new LocalStrategy({usernameField:"email", passwordField:"psw"},(email, psw, done) => {
        Users.findOne({where: {email: email}}).then((users) => {
            if(!users){
                return done(null, false, {msg: "Usuario não encontrado"});
            }
            const res = bcrypt.compare(psw, users.psw, (err, resposta) => {
                if(resposta){
                    return done(null, users);
                }else{
                    return done(null, false, {msg: "Erro ao Logar", err});
                }
            });
        });
    }));
    passport.serializeUser((users, done) => {
        const userSession = {
            id: users.dataValues.id,
            name: users.dataValues.name,
            psw: users.dataValues.psw,
            isAdmin: users.dataValues.isAdmin
        }
        done(null, userSession);
    });

    passport.deserializeUser((userSession, done) => {
        done(null, userSession);
    });
}