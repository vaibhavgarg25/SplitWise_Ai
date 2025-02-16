
const {z}=require('zod');


const signupschema=z.object({
    username:z
    .string({required_error:"name is required"})
    .trim()
    .min(3,{message:"name must be atleast 3 characters"})
    .max(255,{message:"name must not exceed 255 characters"}),
    email:z
    .string({required_error:"email is required"})
    .trim()
    .email({message:"email is invalid"})
    .min(3,{message:"email must be atleast 3 characters"})
    .max(255,{message:"email must not exceed 255 characters"}),
    password:z
    .string({required_error:"password is required"})
    .trim()
    .min(7,{message:"password must be atleast 7 characters"})
    .max(1024,{message:"password must not exceed 1024 characters"}),
});

module.exports=signupschema