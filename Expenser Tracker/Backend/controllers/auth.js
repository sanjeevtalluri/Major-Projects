const User = require('../models/user');

exports.createUser = async (req,res,next)=>{
  try{
    const user = await User.create(req.body);
    if (user) {
      res.status(200).json(user);
     } else {
      res.status(500);
     }
  }
  catch(err){
    console.log(err);
    res.status(400).send('Duplicate User is found');
  }
}




