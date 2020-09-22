const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const morgan = require('morgan')
const config = require('./utils/config')

const planetRouter = require('./routers/planet.router')

mongoose.connect(config.MONGODB_URL, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false
})

const app = express()

app.use(express.json())
app.use(cors())
app.use(morgan('dev'))
app.use('/api/planets', planetRouter)

module.exports = app