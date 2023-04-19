
const express = require('express');

const passwordController = require('../controllers/password');


const router = express.Router();

// /admin/add-product => GET


router.post('/forgotPassword',passwordController.forgotPassword);

router.get('/resetpassword/:id',passwordController.resetPassword);

router.post('/resetpassword',passwordController.resetPasswordPost);

 


module.exports = router;




