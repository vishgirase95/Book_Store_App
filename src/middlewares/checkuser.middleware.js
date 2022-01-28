import { error } from 'winston';
import User from '../models/user.model';


export const checkUser=(user)=>{
return  async (res, req, next) => {
  const checkUser = await User.findOne({
    Email: res.body.Email
  });
  if (checkUser) {
    if (checkUser.Role === user) {
      next();
    } else {
      next(Error('User does not exist'));
    }
  } else {
    next(Error('User does not exist'));
  }
};
}
