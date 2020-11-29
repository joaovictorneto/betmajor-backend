const admin = require('./admin')

module.exports = app => {
    app.post('/cadastrar', app.api.usuario.salvar)
    app.post('/entrar', app.api.autenticacao.entrar)
    app.post('/validarToken', app.api.autenticacao.validarToken)

    app.route('/usuarios')
        .all(app.config.passaporte.autenticador())
        .post(admin(app.api.usuario.salvar))
        .get(admin(app.api.usuario.obter))

    app.route('/usuarios/:id')
        .all(app.config.passaporte.autenticador())
        .put(admin(app.api.usuario.salvar))
        .get(admin(app.api.usuario.obterPorId))
        .delete(admin(app.api.usuario.remover))

    app.route('/categorias')
        .all(app.config.passaporte.autenticador())
        .get(admin(app.api.categoria.obter))
        .post(admin(app.api.categoria.salvar))

    // A ordem importa! URL específica tem que vir antes de /categorias/:id
    app.route('/categorias/arvore')
        .all(app.config.passaporte.autenticador())
        .get(app.api.categoria.obterArvore)

    app.route('/categorias/:id')
        .all(app.config.passaporte.autenticador())
        .get(app.api.categoria.obterPorId)
        .put(admin(app.api.categoria.salvar))
        .delete(admin(app.api.categoria.remover))

    app.route('/artigos')
        .all(app.config.passaporte.autenticador())
        .get(admin(app.api.artigo.obter))
        .post(admin(app.api.artigo.salvar))

    app.route('/artigos/:id')
        .all(app.config.passaporte.autenticador())
        .get(app.api.artigo.obterPorId)
        .put(admin(app.api.artigo.salvar))
        .delete(admin(app.api.artigo.remover))

    app.route('/categorias/:id/artigos')
        .all(app.config.passaporte.autenticador())
        .get(app.api.artigo.obterPorCategoria)

    // app.route('/estatisticas')
    //     .all(app.config.passaporte.autenticador())
    //     .get(app.api.estatistica.obter)
}