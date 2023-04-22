const User = require('../models/user');
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
const saltRounds = 10;
const sequelize = require('../util/database');
var AWS = require('aws-sdk');
const FileDownload = require('../models/fileDownload');


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

async function uploadToS3(data, fileName) {
  const BUCKET_NAME = 'expensetrackersanjeev';
  const IAM_USER_KEY = 'AKIAR54LBCWTZCRIKZWO';
  const IAM_USER_SECRET = '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';

  let s3Bucket = new AWS.S3({
    accessKeyId: IAM_USER_KEY,
    secretAccessKey: IAM_USER_SECRET
  });

  var params = {
    Bucket: BUCKET_NAME,
    Key: fileName,
    Body: data,
    ACL: 'public-read'
  };
  return new Promise((resolve, reject) => {
    s3Bucket.upload(params, (err, s3Response) => {
      if (err) {
        console.log('something went wrong while uploading to s3',err);
        reject(err);
      }
      resolve(s3Response.Location);
    })
  })

}
exports.downloadReport = async (req, res, next) => {
  const t = await sequelize.transaction();
  try {
    const expenses = await req.user.getExpenses();
    const expensesStringified = JSON.stringify(expenses);
    const userId = req.user.id;
    const fileName = `Expenses${userId}/${new Date()}.txt`;
    const fileUrl = await uploadToS3(expensesStringified, fileName);
    const fileDownload = await FileDownload.create({
      fileName:fileName,
      fileUrl: fileUrl,
      userId:userId
    },{transaction:t});
    t.commit();
    res.status(200).json({ fileUrl, success: true })
  }
  catch (err) {
    t.rollback();
    console.log(err);
    res.status(500).json({
      fileUrl: '',
      success: false,
      err:err
    })
  }
}

exports.fileDownloads = async (req, res, next) => {
  try {
    const fileDownloads = await req.user.getFileDownloads();
    res.status(200).json({ fileDownloads, success: true })
  }
  catch (err) {
    console.log(err);
    res.status(401).json({
      success: false,
      err:err
    })
  }
}





