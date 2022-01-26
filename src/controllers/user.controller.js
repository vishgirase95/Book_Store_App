import HttpStatus from 'http-status-codes';
import * as UserService from '../services/user.service';


/**
 * Controller to create a new user
 * @param  {object} req - request object
 * @param {object} res - response object
 * @param {Function} next
 */
export const newUser = async (req, res, next) => {
  try {
    const data = await UserService.newUser(req.body);
    res.status(HttpStatus.CREATED).json({
      code: HttpStatus.CREATED,
      data: data,
      message: 'User created successfully'
    });
  } catch (error) {
    next(error);
  }
};



export const login = async (req, res, next) => {
  try {
    const data = await UserService.login(req.body);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: "Sucessfully logged in"
    })
  } catch (error) {
    next(error);
  }
}

export const forgetPassword = async (req, res, next) => {
  try {
    const data = await UserService.forgetPassword(req.body);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: "Sucessfully mail Sent"
    })
  } catch (error) {
    next(error);
  }
}


export const resetPassword = async (req, res, next) => {
  try {
    const data = await UserService.resetPassword(req);
    res.status(HttpStatus.OK).json({
      code: HttpStatus.OK,
      data: data,
      message: "Password Reset Sucessfully"
    })
  } catch (error) {
    next(error);
  }
}

export const Addbook= async (req,res,next)=>{
  try {
    const data=await UserService.Addbook(req.body);
    res.status(HttpStatus.CREATED).json({
      code:HttpStatus.CREATED,
      data:data,
      message:"Created Book Sucessfully"
    })
  } catch (error) {
    
  }
}
