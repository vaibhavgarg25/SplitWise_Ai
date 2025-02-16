const mongoose=require('mongoose');
const uri=process.env.MONGODB_URI;

const connectdb=async()=>{
    try {
        await mongoose.connect(uri)
        console.log("Connected to database")
    } catch (error) {
        console.log("Error connecting to database");
        process.exit(0);
    }
}

module.exports=connectdb;