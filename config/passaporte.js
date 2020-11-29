// const { segredoAutenticacao } = require('../.env2')
require('dotenv').config()
const passport = require('passport')
const passportJwt = require('passport-jwt')
const { Strategy, ExtractJwt } = passportJwt

module.exports = app => {
    const params = {
        secretOrKey: process.env.segredoAutenticacao,
        jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken()
    }

    const strategy = new Strategy(params, (payload, done) => {
        app.db('users')
            .where({ id: payload.id })
            .first()
            .then(usuario => done(null, usuario ? { ...payload } : false)) // Se o payload estiver setado vai ser colocado na req e retornar
            .catch(erro => done(erro, false))
    })

    passport.use(strategy)

    return {
        autenticador: () => passport.authenticate('jwt', { session: false })
    }
}