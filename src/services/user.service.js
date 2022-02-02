import User from '../models/user.model';
import Book from '../models/book.model';
import Cart from '../models/cart.model';
import WishList from '../models/wishlist.model';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import {
  mailSend
} from '../utils/sendmail.util.js';
import HttpStatus from 'http-status-codes';

dotenv.config('../.env');

const LOGIN_TOKEN_KEY = process.env.LOGIN_KEY;
const FORGETPASSWORD_TOKEN_KEY = process.env.FORGETPASSWORD_KEY;

//create new user
export const newUser = async (body) => {
  const checkUser = await User.findOne({
    Email: body.Email
  });
  if (checkUser) {
    return ('User Already Exsist');
  } else {
    const unHashedPassword = body.Password;
    const saltRounds = 10;
    const HashedPassword = await bcrypt.hash(unHashedPassword, saltRounds);
    body.Password = HashedPassword;
    const data = await User.create(body);

    return data;
  }
};

// login user
export const login = async (body) => {
  const mailVerify = await User.findOne({
    Email: body.Email
  });

  const HashedPassword = mailVerify.Password;
  const EnterPassword = body.Password;
  const isMatch = await bcrypt.compare(EnterPassword, HashedPassword);
  if (isMatch) {
    const token = jwt.sign({
        Email: mailVerify.Email,
        ID: mailVerify._id,
        Role: mailVerify.Role
      },
      LOGIN_TOKEN_KEY
    );

    return token;
  } else {
    return ('Please enter corret password');
  }
};

export const forgetPassword = async (body) => {
  const mailVerify = await User.findOne({
    Email: body.Email
  });

  if (mailVerify) {
    const FORGETPASSWORD_TOKEN = jwt.sign({
        Email: mailVerify.Email,
        ID: mailVerify._id
      },
      FORGETPASSWORD_TOKEN_KEY
    );

    mailSend(mailVerify.Email, FORGETPASSWORD_TOKEN);
    return FORGETPASSWORD_TOKEN;
  } else {
    return ('Mail id does not exsist');
  }
};

export const resetPassword = async (req) => {
  const tokenfound = req.header('Authorization').split(' ')[1];
  const verifiedToken = jwt.verify(tokenfound, FORGETPASSWORD_TOKEN_KEY);

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
    return findAndUpdatePassword;
  } else {
    return ('sorry, unable to verify');
  }
};

export const Addbook = async (body) => {
  const data = await Book.create(body);
  return data;
};

export const UpdateBook = async (req) => {
  const previousData = await Book.findOne({
    _id: req.params._id
  });
  if (previousData) {
    const data = await Book.findOneAndUpdate({
      _id: req.params._id
    }, {
      author: req.body.author ? req.body.author : previousData.author,
      title: req.body.title ? req.body.title : previousData.title,
      image: req.body.image ? req.body.image : previousData.image,
      quantity: req.body.quantity ? req.body.quantity : previousData.quantity,
      description: req.body.description ?
        req.body.description : previousData.description
    }, {
      new: true
    });
    return data;
  } else {
    throw{
      code: HttpStatus.NOT_FOUND,
      message:"Book not found"
    }
  }
};

export const DeleteBook = async (req) => {
  const data = await Book.findByIdAndDelete({
    _id: req.params._id
  });
  if (data) {
    return 'Book Deleted';
  } else {
    throw Error('Book not found');
  }
};

export const fetchByID = async (req) => {
  const data = await Book.findById({
    _id: req.params._id
  });

  if (data) {
    return data;
  } else {
    throw Error('Book not found');
  }
};

export const FetchAllBooks = async () => {
  const data = await Book.find();
  if (data) {
    return data;
  } else {
    throw Error('Books not found');
  }
};






export const AddCart = async (body) => {
  const Book_Available = await Book.findOne({
    _id: body.BookID
  });

  const user_Active_Cart = await Cart.findOne({
    UserID: body.USER_ID
  });

  const Book_Exsist_In_Cart = await Cart.findOne({
    UserID: body.USER_ID,
    'Book.BookID': body.BookID
  });
if(Book_Available){
  if (!user_Active_Cart  && Book_Available.quantity >= body.Quantity) {

    const newCart = new Cart({
      UserID: body.USER_ID,
      Book: {
        BookID: body.BookID,
        Quantity: body.Quantity,
        Total_Price: Book_Available.price * body.Quantity
      },
      TotalAmount: Book_Available.price * body.Quantity
    });

    await newCart.save();


  } else if (!Book_Exsist_In_Cart && user_Active_Cart  && Book_Available.quantity >= body.Quantity) {

    const newBook = {
      BookID: body.BookID,
      Quantity: body.Quantity,
      Total_Price: Book_Available.price * body.Quantity
    };

    user_Active_Cart.Book.push(newBook);

    const Total_price = user_Active_Cart.Book.map((x) => x.Total_Price).reduce(
      (acc, curr) => {
        acc = acc + curr;
        return acc;
      }, 0);

    user_Active_Cart.TotalAmount = Total_price;
    user_Active_Cart.save();
  } else if (Book_Exsist_In_Cart && user_Active_Cart && Book_Available.quantity >= body.Quantity) {


    const Previous_added_Book = await user_Active_Cart.Book.filter((x) => (x.BookID == body.BookID));


    const Total_Quantity = await Previous_added_Book[0].Quantity + body.Quantity;


    // remove the exsisting book in cart
    await Cart.updateOne({
      UserID: body.USER_ID
    }, {
      $pull: {
        Book: {
          BookID: body.BookID
        }
      }
    });

    // insert the new book in cart
    const Updated_Book_In_Cart = {
      BookID: body.BookID,
      Quantity: Total_Quantity,
      Total_Price: Book_Available.price * Total_Quantity
    };

    const updated = await Cart.findOneAndUpdate({
      UserID: body.USER_ID
    }, {
      $addToSet: {
        Book: Updated_Book_In_Cart
      }
    });


    const pricelist = await Cart.findOne({
      UserID: body.USER_ID
    })

    const All_price = await pricelist.Book.map((x) => x.Total_Price).reduce(
      (acc, curr) => {
        acc = acc + curr;
        return acc;
      }, 0);
    user_Active_Cart.TotalAmount = All_price;

    await user_Active_Cart.save();

  } else {
    throw Error('Book Out Of Stock');
  }}else{
    throw Error("Book Not Available")
  }

  const BookInStock = Book_Available.quantity - body.Quantity;
  await Book.findOneAndUpdate({
    _id: body.BookID
  }, {
    quantity: BookInStock
  });


  const Final_Cart = await Cart.findOne({
    UserID: body.USER_ID
  });
  return Final_Cart;
}

export const getCart = async (body) => {
  const Previous_Cart = await Cart.findOne({
    UserID: body.USER_ID
  });
  if (Previous_Cart) {
    return Previous_Cart;
  } else {
    throw (Error("No Cart Added"));
  }
}


export const removeBook = async (body) => {
  const user_Active_Cart = await Cart.findOne({
    UserID: body.USER_ID
  });
  const Previous_added_Book = await user_Active_Cart.Book.filter((x) => (x.BookID == body.BookID));

  if (user_Active_Cart && (Previous_added_Book.length !== 0)) {
    // remove the exsisting book in cart
    const Total_Cart_Price = user_Active_Cart.TotalAmount;
    const Individual_Book_Price = Previous_added_Book[0].Total_Price;
    user_Active_Cart.TotalAmount = Total_Cart_Price - Individual_Book_Price;
    user_Active_Cart.save();


    await Cart.updateOne({
      UserID: body.USER_ID
    }, {
      $pull: {
        Book: {
          BookID: body.BookID
        }
      }
    });

    return "Removed Book Sucessfully"
  } else {
    throw (Error("Book Not in Cart"))
  }
}

export const purchase = async (body) => {
  const user_Active_Cart = await Cart.findOne({
    UserID: body.USER_ID
  });
  if (user_Active_Cart) {
    user_Active_Cart.isPurched = true
    user_Active_Cart.save();
    return user_Active_Cart;
  } else {
    throw (Error("cart not present"));
  }
}

export const AddToWishlist = async (req) => {
  const Book_Available = await Book.findOne({
    _id: req.params.BookID
  });

  const user_Active_WishList = await WishList.findOne({
    UserID: req.body.USER_ID
  });
  if (Book_Available) {
    if (!user_Active_WishList) {
      

      const NewWishList = new WishList({
        UserID: req.body.USER_ID,
        Book: {
          BookID: req.params.BookID,
          Price: Book_Available.price
        }
      });
      await NewWishList.save()
    } else {
      const Book_Already_WishList = await user_Active_WishList.Book.filter((x) => (x.BookID == req.params.BookID))
      

      if (Book_Already_WishList.length == 0) {
        const newBook = {
          BookID: req.params.BookID,
          Price: Book_Available.price
        }
        user_Active_WishList.Book.push(newBook);
        await user_Active_WishList.save();
      }else{
        throw(Error("Already Added in Wishlist"))
      }
    }
    const user_Final_WishList = await WishList.findOne({
      UserID: req.body.USER_ID
    });
    return user_Final_WishList;

  } else {
    throw (Error("Book Does not exsist"))
  }

}



export const removeWishlist= async(req)=>{
  const user_Active_WishList = await WishList.findOne({
    UserID: req.body.USER_ID
  });
if(user_Active_WishList){
  const Book_Already_WishList = await user_Active_WishList.Book.filter((x) => (x.BookID == req.params.BookID))
if(Book_Already_WishList.length!==0){

  await WishList.updateOne({UserID:req.body.USER_ID},{
    $pull:{
      Book:{
        BookID:req.params.BookID
      }
    }
  })
  return "Removed from Wishlist"
}else{
  throw(Error("Book Not in wishlist"))

}
}else{
  throw(Error("No Wishlist Present"))
}

}

export const fetchWishList= async(body)=>{

  const user_Active_WishList = await WishList.findOne({
    UserID:body.USER_ID
  });
  if(user_Active_WishList){
    return user_Active_WishList;
  }else{
    throw (Error("Wishlist does not created"))
  }
}