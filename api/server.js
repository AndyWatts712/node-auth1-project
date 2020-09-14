const express = require('express')
const router = require('../auth/auth-router')
const authRouter = require('../auth/auth-router')
const server = express()

server.use(express.json())

server.use('/api/', authRouter)


module.exports = server