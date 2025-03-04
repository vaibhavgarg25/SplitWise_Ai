const express=require('express');
const router= express.Router(); 
const authcontroller=require('./authcontroller')

router.route('/getsplit').get(authcontroller.getsplit)
module.exports=router