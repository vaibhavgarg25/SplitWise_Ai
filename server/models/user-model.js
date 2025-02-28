const mongoose=require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');

const Userschema=new mongoose.Schema({
    username:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true,
    },
    password:{
        type:String,
        required:true,
        unique:true,
    },
    groups:{
        type:Array,
        default:[]
    },
    createdAt:{
        type:Date,
        default:new Date(),
    }
})

Userschema.pre('save',async function(next){
    const user=this;
    if(!user.isModified('password')){
        next();
    }
    try {
    const saltRound=await bcrypt.genSalt(10);
    const hash_password=await bcrypt.hash(user.password,saltRound);
    user.password=hash_password;
    } catch (error) {
        next(error)
    }
})

Userschema.methods.generatetoken=async function () {
    try {
        return jwt.sign({
            username:this.username,
            userid:this._id.toString(),
            email:this.email,
        },process.env.SECRET_KEY,{
            expiresIn:"30d"
        });
    } catch (error) {
       console.log(error); 
    }
}

const User=new mongoose.model('users',Userschema);
module.exports=User