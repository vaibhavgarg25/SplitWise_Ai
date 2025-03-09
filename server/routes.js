const express=require('express');
const router= express.Router(); 
const authcontroller=require('./authcontroller');
const validate= require('./middlewares/validate');
const signupschema = require('./validators/auth-validators');
const loginschema = require('./validators/login-validators');
const authmiddleware=require('./middlewares/auth-middlewares')
const {upload}=require('./authcontroller')


router.route('/signup').post(validate(signupschema),authcontroller.signup)
router.route('/signin').post(validate(loginschema),authcontroller.login)
router.route('/user').get(authmiddleware,authcontroller.user)
router.route('/users').get(authmiddleware,authcontroller.getusers)
router.route('/creategroup').post(authmiddleware,authcontroller.creategroup)
router.route('/getgroups/:id').get(authmiddleware,authcontroller.getgroups)
router.route('/update/:id').patch(authmiddleware,authcontroller.updateusersbyid)
router.route('/deletegroup/:id').delete(authmiddleware,authcontroller.deletegroupbyid)
router.route('/getgroupmembers/:id').get(authmiddleware,authcontroller.getgroupmembers)
router.route('/getexpenses/:id').get(authmiddleware,authcontroller.getexpenses)
router.route('/getsplit').post(upload.single("image"),authcontroller.getsplit)
router.route('/unequalsplit').post(authmiddleware,authcontroller.unequalsplit)
module.exports=router;  