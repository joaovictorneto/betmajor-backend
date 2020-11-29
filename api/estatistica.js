// module.exports = app => {
//     const Estatistica = app.mongoose.model('Estatistica', {
//         usuarios: Number,
//         categorias: Number,
//         artigos: Number,
//         criadoEm: Date
//     })

//     const obter = (req, res) => {
//         Estatistica.findOne({}, {}, { sort: { 'criadoEm': -1 } })
//             .then(est => {
//                 const estatisticasPadrao = {
//                     usuarios: 0,
//                     categorias: 0,
//                     artigos: 0,
//                 }
//              res.json(est || estatisticasPadrao)
//             })
//     }

//     return { Estatistica, obter }
// }