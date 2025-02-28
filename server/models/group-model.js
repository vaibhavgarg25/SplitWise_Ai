const mongoose=require('mongoose');
const GroupSchema=new mongoose.Schema({
    groupname:{
        type:String,
        required:true,
        unique:true,
    },
    groupdesc:{
        type:String,
        required:true,
    },
    members:{
        type:Array,
        default:[],
    },
    createdAt:{
        type:Date,
        default:new Date(),
    }
})

const Group=new mongoose.model('groups',GroupSchema);
module.exports=Group