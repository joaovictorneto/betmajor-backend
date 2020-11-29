const bcrypt = require('bcryptjs')

module.exports = app => {
    const { existeOuErro, naoExisteOuErro, iguaisOuErro } = app.api.validador

    const encriptarSenha = senha => {
        const salt = bcrypt.genSaltSync(10)
        return bcrypt.hashSync(senha, salt)
    }

    const salvar = async (req, res) => {
        const usuario = { ...req.body }
        if(req.params.id) usuario.id = req.params.id

        if(!req.originalUrl.startsWith('/usuarios')) usuario.admin = false
        if(!req.user || !req.user.admin) usuario.admin = false

        try {
            existeOuErro(usuario.name, 'Nome não informado')
            existeOuErro(usuario.email, 'E-mail não informado')
            existeOuErro(usuario.password, 'Senha não informada')
            existeOuErro(usuario.confirmPassword, 'Confirmação de senha inválida')
            iguaisOuErro(usuario.password, usuario.confirmPassword, 'Senhas não conferem')

            const usuarioDoBD = await app.db('users')
                .where({email: usuario.email}).first()
            if(!usuario.id) {
                naoExisteOuErro(usuarioDoBD, 'Usuário já cadastrado')
            }
        } catch(msg) {
            return res.status(400).send(msg) // Erro do lado do cliente
        }

        usuario.password = encriptarSenha(usuario.password)
        delete usuario.confirmPassword

        if(usuario.id) {
            app.db('users')
                .update(usuario)
                .where({ id: usuario.id })
                .whereNull('deletadoEm')
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err)) // Erro do lado do servidor
        } else {
            app.db('users')
                .insert(usuario)
                .then(_ => res.status(204).send())
                .catch(err => res.status(500).send(err)) // Erro do lado do servidor
        }
    }

    const obter = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull('deletadoEm')
            .then(usuarios => res.json(usuarios))
            .catch(err => res.status(500).send(err))
    }

    const obterPorId = (req, res) => {
        app.db('users')
            .select('id', 'name', 'email', 'admin')
            .whereNull('deletadoEm')
            .where({ id: req.params.id })
            .first()
            .then(usuario => res.json(usuario))
            .catch(err => res.status(500).send(err))
    }

    const remover = async (req, res) => {
        try {
            const artigos = await app.db('articles')
                .where({ userId: req.params.id })
            naoExisteOuErro(artigos, 'Usuário possui artigos.')

            const linhasAtualizadas = await app.db('users')
                .update({deletadoEm: new Date()})
                .where({ id: req.params.id })
            existeOuErro(linhasAtualizadas, 'Usuário não foi encontrado.')

            res.status(204).send()
        } catch(msg) {
            res.status(400).send(msg)
        }
    }
    return { salvar, obter, obterPorId, remover }
}