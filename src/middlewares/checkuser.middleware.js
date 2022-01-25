import {
    error
} from 'winston';
import User from '../models/user.model';


export const checkUser = async (res, req, next) => {
    const checkUser = await User.findOne({
        Email: res.body.Email
    })
    
    const isMatch = checkUser.Role === "User"
    

    if (isMatch) {
        
 
        next()
    } else {
        next(Error("User does not exist"));

    }
}


export const checkAdmin = async (res, req, next) => {
    const checkAdmin = await User.findOne({
        Email: res.body.Email
    })
    const isMatch = checkAdmin.Role === "Admin"
    console.log("after check", checkAdmin.Role)

    if (isMatch) {
        console.log(isMatch)

        next()
    } else {
        next(Error("User does not exist"));
    }
}