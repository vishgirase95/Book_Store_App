import { error } from 'winston';
import User from '../models/user.model';

export const checkUser = async (res, req, next) => {
  const checkUser = await User.findOne({
    Email: res.body.Email
  });
  if (checkUser) {
    if (checkUser.Role === 'User') {
      next();
    } else {
      next(Error('User does not exist'));
    }
  } else {
    next(Error('User does not exist'));
  }
};

export const checkAdmin = async (res, req, next) => {
  const checkAdmin = await User.findOne({
    Email: res.body.Email
  });
  if (checkAdmin) {
    if (checkAdmin.Role === 'Admin') {
      next();
    } else {
      next(Error('User does not exist'));
    }
  } else {
    next(Error('User does not exist'));
  }
};
