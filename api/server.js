const express = require('express')
const router = require('../auth/auth-router')
const authRouter = require('../auth/auth-router')
const bcryptjs = require('bcryptjs')
const session = require('express-session')
const KnexSessionStore = require('connect-session-knex')(session)
const server = express()
const connection = require('../database/connection')

server.use(express.json())

server.use('/api/', authRouter)

const sessionConfig = {
    name: "monster",
    secret: process.env.SESSION_SECRET || "keep it secret, keep it safe!",
    resave: false,
    saveUninitialized: true, // ask the client if it's ok to save cookies (GDPR compliance)
    cookie: {
        maxAge: 1000 * 60 * 60, // in milliseconds
        secure: process.env.USE_SECURE_COOKIES || false, // true means use only over https connections
        httpOnly: true, // true means the JS code on the clients CANNOT access this cookie
    },
    store: new KnexSessionStore({
        knex: connection, // knex connection to the database
        tablename: "sessions",
        sidfieldname: "sid",
        createtable: true,
        clearInterval: 1000 * 60 * 60, // remove expired sessions every hour
    }),
};

server.use(session(sessionConfig))


server.get('/', (req, res) => {
    const password = req.headers.password;

    // the higher the rounds number the more secure the password is
    const rounds = process.env.BCRYPT_ROUNDS || 4; // as high as possible in production
    const hash = bcryptjs.hashSync(password, rounds);
    res.json({ api: "up", password, hash });
})

module.exports = server