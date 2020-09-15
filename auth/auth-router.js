const router = require('express').Router()
const bcryptjs = require('bcryptjs')
const Users = require('../users/user-model')

router.post('/register', (req, res) => {
    const userInfo = req.body
    const isValid = validateUser(userInfo)

    if (isValid) {
        const rounds = process.env.BCRYPT_ROUNDS || 4
        const hash = bcryptjs.hashSync(userInfo.password, rounds)
        userInfo.password = hash

        Users.add(userInfo)
            .then(inserted => {
                res.status(201).json({ data: inserted })
            })
            .catch(err => {
                res.status(500).json({ error: err })
            })
    } else {
        res.status(400).json.apply({ message: 'Invalid information.' })
    }
})

router.post('/login', (req, res) => {
    const creds = req.body
    const isValid = validateUser(creds)

    if (isValid) {
        Users.findBy({ username: creds.username })
            .then(([user]) => {
                if (user && bcryptjs.compareSync(creds.password, user.password)) {
                    req.session.username = user.username

                    res.status(200).json({ message: 'Welcome!' })
                } else {
                    res.status(401).json({ message: 'You cannot pass!' })
                }
            })
            .catch(err => {
                res.status(500).json({ message: err.message })
            })
    } else {
        res.status(400).json({ message: 'Invalid info, try again' })
    }
})

router.get('/users', protected, (req, res) => {
Users.getUsers()
    .then(users => {
        res.status(200).json({ data: users})
    })
    .catch(err => {
        res.status(500).json({error: err.message})
    })
        
})

function validateUser(user) {
    return user.username && user.password ? true : false
}

function protected(req, res, next) {
    if (req.session && req.session.username) {
      next();
    } else {
      res.status(401).json({ message: 'you shall not pass!!' });
    }
  }


module.exports = router
