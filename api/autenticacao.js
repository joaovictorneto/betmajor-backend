// const { segredoAutenticacao } = require('../.env2')
require('dotenv').config();
const jwt = require('jwt-simple')
const bcrypt = require('bcryptjs')

module.exports = app => {
    const entrar = async (req, res) => {
        if (!req.body.email || !req.body.password) {
            return res.status(400).send('Digite o usuário e a senha.')
        }

        const usuario = await app.db('users')
            .where({ email: req.body.email })
            .first()

        if (!usuario) return res.status(400).send('Usuário não encontrado.')

        const eCombinacao = bcrypt.compareSync(req.body.password, usuario.password)
        if (!eCombinacao) return res.status(401).send('E-mail ou senha inválidos.')

        const agora = Math.floor(Date.now() / 1000) // Dividido por mil para pegar o valor em segundos

        const payload = {
            id: usuario.id,
            name: usuario.name,
            email: usuario.email,
            admin: usuario.admin,
            iat: agora,
            exp: agora + (60 * 60 * 24 * 3) //3 dias para expirar
            // exp: agora + 10
        }

        res.json({
            ...payload,
            token: jwt.encode(payload, process.env.segredoAutenticacao)
        })
    }

    const validarToken = async (req, res) => {
        const dadosUsuario = req.body || null
        try {
            if (dadosUsuario) {
                const token = jwt.decode(dadosUsuario.token, process.env.segredoAutenticacao)
                if (new Date(token.exp * 1000) > new Date()) {
                    return res.send(true)
                }
            }
        } catch (e) {
            // problema com o token
        }
        res.send(false)
    }
    return { entrar, validarToken }
}