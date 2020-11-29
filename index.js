require('dotenv').config();
const app = require('express')()
const consign = require('consign')
const db = require('./config/bd')
// const mongoose = require('mongoose')

require('./config/mongodb')

app.db = db
// app.mongoose = mongoose

consign()
    .include('./config/passaporte.js')
    .then('./config/middlewares.js')
    .then('./api/validador.js')
    .then('./api')
    // .then('./agendador')
    .then('./config/rotas.js')
    .into(app)

app.listen(process.env.PORT || 4000, () => {
    console.log('Backend executando...')
})