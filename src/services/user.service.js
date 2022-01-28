import User from '../models/user.model';
import Book from '../models/book.model';
import Cart from '../models/cart.model';
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


export const resetPassword = async (req) => {

  const tokenfound = req.header('Authorization').split(' ')[1];
  const verifiedToken = jwt.verify(tokenfound, FORGETPASSWORD_TOKEN_KEY)

  if (verifiedToken) {
    const decodedToken = jwt.decode(tokenfound, {
      complete: true
    });
    const Email_Enter = decodedToken.payload.Email;
    const newPassword = req.body.Password;
    const HashednewPassword = await bcrypt.hash(newPassword, 10);

    const findAndUpdatePassword = await User.findOneAndUpdate({
      Email: Email_Enter
    }, {
      Password: HashednewPassword
    }, {
      new: true
    });
    return findAndUpdatePassword
  } else {
    throw Error("Cannot reset password");
  }

}


export const Addbook = async (body) => {
  const data = await Book.create(body)
  return data;
}




export const UpdateBook = async (req) => {
  const previousData = await Book.findOne({
    _id:req.params._id
  })
  if (previousData) {
    const data = await Book.findOneAndUpdate({
      _id:req.params._id
    }, {
      author:req.body.author ? req.body.author : previousData.author,
      title: req.body.title ? req.body.title : previousData.title,
      image: req.body.image ? req.body.image : previousData.image,
      quantity: req.body.quantity ? req.body.quantity : previousData.quantity,
      description: req.body.description ? req.body.description : previousData.description
    }, {
      new: true
    })
    return data;
  } else {
    throw Error("Book not found");

  }
}


export const DeleteBook = async (req) => {
  const data = await Book.findByIdAndDelete({
    _id: req.params._id
  })
  if (data) {
    return "Book Deleted";

  } else {
    throw Error("Book not found");

  }
}



export const fetchByID = async (req) => {
  const data = await Book.findById({
    _id: req.params._id
  })

  if (data) {
    return data;

  } else {
    throw Error("Book not found");
  }
}


export const FetchAllBooks = async () => {
  const data = await Book.find()
  if (data) {
    return data;
  } else {
    throw Error("Books not found");

  }
}

export const AddCart=async (body)=>{
  
const BookFound=await Book.findOne({_id:body.Book.BookID});


if(BookFound){
  if(BookFound.quantity>=body.Book.Quantity){
body.UserID=body.USER_ID;
const totalQuantity=body.Book.Quantity
body.TotalAmount=BookFound.price * totalQuantity
const data=await Cart.create(body);
const BookInStock=BookFound.quantity-totalQuantity;
const UpdatedBookFound=await Book.findOneAndUpdate({_id:body.Book.BookID},{quantity:BookInStock});

return data;
  }else{
  throw Error("Book out of stock")

  }
}else{
  throw Error("Book not available")
}
}