const schedule = require('node-schedule')

module.exports = app => {
    schedule.scheduleJob('*/1 * * * *', async function () {
        const contadorUsuarios = await app.db('users').count('id').first()
        const contadorCategorias = await app.db('categories').count('id').first()
        const contadorArtigos = await app.db('articles').count('id').first()

        const { Estatistica } = app.api.estatistica

        const ultimaEstatistica = await Estatistica.findOne({}, {}, 
            { sort: { 'criadoEm' : -1 } })

        const estatistica = new Estatistica({
            usuarios: contadorUsuarios.count,
            categorias: contadorCategorias.count,
            artigos: contadorArtigos.count,
            criadoEm: new Date()
        })

        const alterouUsuarios = !ultimaEstatistica || estatistica.usuarios !== ultimaEstatistica.usuarios
        const alterouCategorias = !ultimaEstatistica || estatistica.categorias !== ultimaEstatistica.categorias
        const alterouArtigos = !ultimaEstatistica || estatistica.artigos !== ultimaEstatistica.artigos

        if(alterouUsuarios || alterouCategorias || alterouArtigos) {
            estatistica.save().then(() => console.log('Estatísticas atualizadas!'))
        }
    })
}