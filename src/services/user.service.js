import User from '../models/user.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
dotenv.config('../.env');



const LOGIN_TOKEN = process.env.TOKEN;

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
  if (mailVerify) {
    const HashedPassword = mailVerify.Password;
    const EnterPassword = body.Password
    const isMatch = await bcrypt.compare(EnterPassword, HashedPassword);
    if (isMatch) {

      const token = jwt.sign({
        Email: mailVerify.Email,
        ID: mailVerify._id,
        Role: mailVerify.Role,
      }, LOGIN_TOKEN)


      return token;
    } else {
      throw Error("Please enter corret mail id or password");
    }

  } else {
    throw Error("Please enter correct Mail Id");
  }

}