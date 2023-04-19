const User = require('../models/user');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const saltRounds = 10;
const sequelize = require('../util/database');


const generateToken = (user) => {
  return jwt.sign({ userId: user.id }, 'secretkey');
}

exports.createUser = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const user = await User.findOne({
      where: { email: req.body.email }
    });
    if (!user) {
      bcrypt.hash(req.body.password, saltRounds, async function (err, hash) {
        if (!err) {
          const user = await User.create({
            name: req.body.name,
            email: req.body.email,
            password: hash
          }, { transaction: t });
          if (user) {
            await t.commit();
            res.status(200).json({ message: 'User created successfully' });
          } else {
            res.status(401).json({ message: 'Error while creating user' });
          }
        }
        else {
          res.status(500).json({ message: 'Internal server error' });
        }

      });
    }
    else {
      res.status(401).json({ message: 'Duplicate User is found' });
    }
  }
  catch (err) {
    console.log(err);
    await t.rollback();
    res.status(500).json({ message: 'Internal server error' });
  }
}
exports.loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email }
    });
    if (user) {
      const match = await bcrypt.compare(req.body.password, user.password);
      if (match) {
        const token = generateToken(user);
        res.status(200).json({
          message: "User login successful",
          token: token
        })
      }
      else {
        res.status(401).json({
          message: "User not authorized"
        })
      }
    }
    else {
      res.status(404).json({
        message: "User not found"
      });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal server error'
    })
  }
}

exports.isPremiumUser = async (req, res, next) => {
  try {
    res.status(200).json({
      isPremiumUser: req.user.isPremiumUser
    })
  }
  catch (err) {
    console.log(err);
    res.status(500).json({
      message: 'Internal server error'
    })
  }
}





