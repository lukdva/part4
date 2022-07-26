const usersRouter = require('express').Router()
const bcrypt = require('bcrypt')
const logger = require('../utils/logger')
const User = require('../models/user')

usersRouter.post('/', async (req, res) => {
    const { username, name, password } = req.body;
    if (!password || password.length < 3)
    {
        throw new Error('bad request - Password too short');
    }
    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(password, saltRounds);
    const user = new User({ username, name, passwordHash })
    const savedUser = await user.save();
    res.status(201).send(savedUser);
})

usersRouter.get('/', async (req, res) => {
    const users = await User.find({}).populate('blogs', {url:1, title:1, author:1, id:1});
    res.json(users);
})

module.exports = usersRouter;
