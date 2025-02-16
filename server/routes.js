const express=require('express');
const router= express.Router(); 
const authcontroller=require('./authcontroller');
const validate= require('./middlewares/validate');
const signupschema = require('./validators/auth-validators');
const loginschema = require('./validators/login-validators');


router.route('/signup').post(validate(signupschema),authcontroller.signup)
router.route('/signin').post(validate(loginschema),authcontroller.login)

module.exports=router;