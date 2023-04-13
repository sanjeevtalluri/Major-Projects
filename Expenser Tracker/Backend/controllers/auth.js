const User = require('../models/user');

exports.createUser = async (req, res, next) => {
  try {
    const user = await User.create(req.body);
    if (user) {
      res.status(200).json(user);
    } else {
      res.status(500);
    }
  }
  catch (err) {
    console.log(err);
    res.status(400).send('Duplicate User is found');
  }
}
exports.loginUser = async (req, res, next) => {
  try {
    const user = await User.findOne({
      where: { email: req.body.email }
    });
    if (user) {
      const userWithPassword = await User.findOne({
        where: { email: req.body.email,password:req.body.password }
      })
      if(userWithPassword){
        res.status(200).json({
          message: "User login successful"
        })
      }
      else{
        res.status(401).json({
          message: "User not authorized"
        })
      }
    }
    else {
      res.status(404).json({
        message:"User not found"
      });
    }
  }
  catch (err) {
    console.log(err);
    res.status(500).json({
      message:'Internal server error'
    })
  }
}




