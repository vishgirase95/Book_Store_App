import User from '../models/user.model';
import bcrypt from 'bcrypt';



//create new user 
export const newUser = async (body) => {
  const checkUser = await User.findOne({
    Email: body.Email
  })
  if (checkUser) {
    throw Error("User Already Exsist")
  } else {
    const data = await User.create(body);
    const unHashedPassword=data.Password;
    const saltRounds = 10;
    const HashedPassword=await bcrypt.hash(unHashedPassword,saltRounds)
    data.Password=HashedPassword;
    return data;
  }


};
