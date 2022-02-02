import { error } from 'winston';
import User from '../models/user.model';
import HttpStatus from 'http-status-codes';


export const checkUser=(user)=>{
return  async (res, req, next) => {
  const checkUser = await User.findOne({
    Email: res.body.Email
  });
  if (checkUser) {
    if (checkUser.Role === user) {
      next();
    } else {
      req.status(HttpStatus.UNAUTHORIZED).json({
        code:HttpStatus.UNAUTHORIZED,
        message:'User access denied'
      })
    }
  } else {
    req.status(HttpStatus.NOT_FOUND).json({
      code:HttpStatus.NOT_FOUND,
      message:'User does not exist'
    })
   
  }
};
}
