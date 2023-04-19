const User = require('../models/user');
const ForgotPasswordRequest = require('../models/forgotPasswordRequest');
const Sib = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const sequelize = require('../util/database');


exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (user) {
            console.log(user);
            const userId = user.id;
            const forgotPasswordRequest = await ForgotPasswordRequest.create({
                isActive: true,
                userId: userId,
                id: uuidv4()
            });
            const client = Sib.ApiClient.instance
            const apiKey = client.authentications['api-key']
            apiKey.apiKey = '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';
            const tranEmailApi = new Sib.TransactionalEmailsApi()
            console.log(req.body.email)
            const sender = {
                email: 'sanjeevtalluri007@gmail.com',
                name: 'sanjeev',
            }
            const receivers = [
                {
                    email: req.body.email,
                },
            ]
            await tranEmailApi
                .sendTransacEmail({
                    sender,
                    to: receivers,
                    subject: 'Reset your password',
                    htmlContent: `<p>Reset your password by clicking this</p>
        <a href=http://localhost:3000/password/resetpassword/${forgotPasswordRequest.id}>link</a>`,
                });

            //res.send(201).json({ success: true });

        }


    }
    catch (err) {
        console.log(err);
        res.send(401).json({ success: false });
    };
}


exports.resetPassword = async (req, res, next) => {
    try {
        const id = req.params.id;
        console.log(req.params.id);
        const forgotPasswordRequest = await ForgotPasswordRequest.findByPk(id);
        if (forgotPasswordRequest) {
            console.log('in');
            if (forgotPasswordRequest.isActive) {
                res.render('password/reset-password', {
                    id: id,
                    userId: forgotPasswordRequest.userId
                });
            }
            else{
                res.render('errors/404');
            }
        }
        else{
            res.render('errors/404');
        }
    }
    catch (err) {
        res.render('errors/404');
    }
}

exports.resetPasswordPost = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const { id, userId, password } = req.body;
        const user = await User.findByPk(userId);
        const forgotPasswordRequest = await ForgotPasswordRequest.findByPk(id);
        if (user) {
            bcrypt.hash(password, saltRounds, async function (err, hash) {
                if (!err) {
                    await user.update({
                        password: hash
                    }, { transaction: t });
                    await forgotPasswordRequest.update({
                        isActive: false
                    }, { transaction: t });
                    await t.commit();
                    res.render('password/reset-success-password');
                }
                else {
                    await t.rollback();
                    throw new Error(err);
                }
            });
        }
    }
    catch (err) {
        await t.rollback();
        res.status(401).json({ message: 'something went wrong', error: err });
    }
}