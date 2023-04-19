const User = require('../models/user');
const ForgotPasswordRequest = require('../models/forgotPasswordRequest');
const Sib = require('sib-api-v3-sdk');
const { v4: uuidv4 } = require('uuid');


exports.forgotPassword = async (req, res, next) => {
    try {
        const user = await User.findOne({ where: { email: req.body.email } });
        if (user) {
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

            res.send(201).json({ success: true });

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
        if(forgotPasswordRequest){
            console.log('in');
            if(forgotPasswordRequest.isActive){
                res.render('password/reset-password', {
                    id: id
                  });
            }
        }
    }
    catch (err) {
        res.status(401).json({ message: 'something went wrong', error: err });
    }
}