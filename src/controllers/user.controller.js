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
    next(error)
  }
}



export const UpdateBook= async (req,res,next)=>{
  try {
    const data=await UserService.UpdateBook(req.body);
    res.status(HttpStatus.OK).json({
      code:HttpStatus.OK,
      data:data,
      message:"Updated Book Sucessfully"
    })
  } catch (error) {
    next(error)
    
  }
}


export const DeleteBook= async (req,res,next)=>{
  try {
    const data=await UserService.DeleteBook(req);
    res.status(HttpStatus.OK).json({
      code:HttpStatus.OK,
      data:data,
      message:"Sucessfully Deleted"
    })
  } catch (error) {
    next(error)
    
  }
}

export const fetchByID=async(req,res,next)=>{
  try {
    const data=await UserService.fetchByID(req.body);
    res.status(HttpStatus.OK).json({
      code:HttpStatus.OK,
      data:data,
      message:"Sucessfully Fetched Book"});
  } catch (error) {
    next(error)
  }
}


export const FetchAllBooks=async(req,res,next)=>{
  try {
    const data=await UserService.FetchAllBooks(req);
    res.status(HttpStatus.OK).json({
      code:HttpStatus.OK,
      data:data,
      message:"Sucessfully Fetched all Books"});
  } catch (error) {
    next(error)
  }
}