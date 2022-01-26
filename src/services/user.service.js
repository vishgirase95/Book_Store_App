import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  mailSend
} from '../utils/sendmail.util.js'
dotenv.config('../.env');



const LOGIN_TOKEN_KEY = process.env.LOGIN_KEY;
const FORGETPASSWORD_TOKEN_KEY = process.env.FORGETPASSWORD_KEY;

//create new user 
export const newUser = async (body) => {
  const checkUser = await User.findOne({
    Email: body.Email
  })
  if (checkUser) {
    throw Error("User Already Exsist")
  } else {
    const unHashedPassword = body.Password;
    const saltRounds = 10;
    const HashedPassword = await bcrypt.hash(unHashedPassword, saltRounds)
    body.Password = HashedPassword;
    const data = await User.create(body);

    return data;
  }

};



// login user 
export const login = async (body) => {
  const mailVerify = await User.findOne({
    Email: body.Email
  })

    const HashedPassword = mailVerify.Password;
    const EnterPassword = body.Password
    const isMatch = await bcrypt.compare(EnterPassword, HashedPassword);
    if (isMatch) {

      const token = jwt.sign({
        Email: mailVerify.Email,
        ID: mailVerify._id,
        Role: mailVerify.Role,
      }, LOGIN_TOKEN_KEY)


      return token;
    } else {
      throw Error("Please enter corret mail id or password");
    }

}




export const forgetPassword = async (body) => {
  const mailVerify = await User.findOne({
    Email: body.Email
  })

  if (mailVerify) {
    const FORGETPASSWORD_TOKEN = jwt.sign({
      Email: mailVerify.Email,
      ID: mailVerify._id,

    }, FORGETPASSWORD_TOKEN_KEY)

    mailSend(mailVerify.Email, FORGETPASSWORD_TOKEN)
    return FORGETPASSWORD_TOKEN;
  } else {
    throw Error("Mail id does not exsist")
  }

}


export const resetPassword=async (req)=>{
  
  const tokenfound = req.header('Authorization').split(' ')[1];
  const verifiedToken=jwt.verify(tokenfound,FORGETPASSWORD_TOKEN_KEY)

  if(verifiedToken){
    const decodedToken = jwt.decode(tokenfound, {
      complete: true
     });
    const Email_Enter=decodedToken.payload.Email;
    const newPassword = req.body.Password;
    const HashednewPassword = await bcrypt.hash(newPassword, 10);

    const findAndUpdatePassword = await User.findOneAndUpdate({
      Email:Email_Enter
    },{
      Password:HashednewPassword
    },{
      new:true
    });


    return findAndUpdatePassword
  }else{
    throw Error("Cannot reset password");
  }

}
