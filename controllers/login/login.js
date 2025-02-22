const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt');
const loginRouter = require('express').Router();
const User = require('../../models/users/User');

loginRouter.post('/', async (req, res) => {
    
    const { body } = req;
    const { username, password } = body;
    const user = await User.findOne({ username });
    const passwordCheck = user === null 
        ? false
        : await bcrypt.compare(password, user.passwordHash);

    if(!(user && passwordCheck)) { // if user and passwordCheck were true it wouldn't go into if.
        res.status(401).json({
            error: 'Invalid user or password'
        })
    }

    const userToToken = {
        id: user._id,
        username: user.username
    }

    const userToken = jwt.sign(userToToken, process.env.SECRET_KEY) // and third parameter could be { expiresIn: '1h' }

    res.send({
        name: user.name,
        username: user.username,
        tokenId: userToken
    })  //this parses into jwt 
})

module.exports = loginRouter;