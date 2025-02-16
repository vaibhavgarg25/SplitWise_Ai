const express=require('express');
const router= express.Router(); 
const authcontroller=require('./authcontroller');
const validate= require('./middlewares/validate');
const signupschema = require('./validators/auth-validators');
const loginschema = require('./validators/login-validators');
const authmiddleware=require('./middlewares/auth-middlewares')


router.route('/signup').post(validate(signupschema),authcontroller.signup)
router.route('/signin').post(validate(loginschema),authcontroller.login)
router.route('/user').get(authmiddleware,authcontroller.user)

module.exports=router;