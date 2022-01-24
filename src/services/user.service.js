import User from '../models/user.model';



//create new user 
export const newUser = async (body) => {
  const checkUser = await User.findOne({
    Email: body.Email
  })
  if (checkUser) {
    throw Error("User Already Exsist")
  } else {
    const data = await User.create(body);
    return data;
  }


};