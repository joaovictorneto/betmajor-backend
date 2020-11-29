const mongoose = require('mongoose')
mongoose.connect('mongodb://localhost/betmajor_estatisticas', { useNewUrlParser: true, useUnifiedTopology: true })
    .catch(e => {
        const msg = 'ERRO: Não foi possível se conectar ao MONGODB'
        console.log(msg)
    })