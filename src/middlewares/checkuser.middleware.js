import { error } from 'winston';
import User from '../models/user.model';


export const checkUser= async(res,req,next)=>{
const checkUser=await User.findOne({Email:res.body.Email})
console.log("check",checkUser.Role)
const isMatch=checkUser.Role==="User"
console.log("after check",checkUser.Role)

if(isMatch){
console.log(isMatch)

    next()
}else{
    next(Error("Please enter correct details"));
    
}
}

export const checkAdmin= async(res,req,next)=>{
    const checkAdmin=await User.findOne({Email:res.body.Email})
    const isMatch=checkAdmin.Role==="Admin"
    console.log("after check",checkAdmin.Role)
    
    if(isMatch){
    console.log(isMatch)
    
        next()
    }else{
      next(Error("Please enter correct details"));
    }
    }