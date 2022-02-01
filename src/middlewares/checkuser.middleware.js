import { error } from 'winston';
import User from '../models/user.model';
import HttpStatus from 'http-status-codes';
 


export const checkUser=(user)=>{
return  async (req, res, next) => {
  const checkUser = await User.findOne({
    Email: req.body.Email
  });
  if (checkUser && (checkUser.Role === user)) {
      next();
    
  } else {
    res.status(HttpStatus.UNAUTHORIZED).json({
      code: HttpStatus.UNAUTHORIZED,
      message:"User does not exist"
  });
  }
}}