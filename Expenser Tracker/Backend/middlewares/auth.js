const User = require('../models/user');
var jwt = require('jsonwebtoken');

const authorization = (req, res, next) => {
    try {
        const token = req.header('Authorization');
        const user = jwt.verify(token, 'secretkey');
        User.findByPk(user.userId).then(user => {
            req.user = user;
            next();
        }).catch(err => {
            throw new Error(err);
        })
    }
    catch (err) {
        console.log(err);
        res.status(401).json({ success: false })
    }
}
module.exports = authorization