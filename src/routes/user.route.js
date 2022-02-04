import express from 'express';
import * as userController from '../controllers/user.controller';
import { newUserValidator } from '../validators/user.validator';

import { selectuser } from '../middlewares/selectuser.middleware';
import { checkUser,checkAdmin } from '../middlewares/checkuser.middleware';



const router = express.Router();




//route to create a new user
router.post('/user_registration',newUserValidator,selectuser("User"),userController.newUser);

// route to create new admin
router.post('/admin_registration',newUserValidator,selectuser("Admin"),userController.newUser);

// route to login user
router.post('/user_login',checkUser("User"),userController.login);


// route to login admin
router.post('/admin_login',checkUser("Admin"),userController.login);

// forget password
router.post("/forgetpassword",userController.forgetPassword)


// reset new password
router.post("/resetpassword",userController.resetPassword)




export default router;
