import express from 'express';
import * as userController from '../controllers/user.controller';
import { newUserValidator } from '../validators/user.validator';
import { userAuth } from '../middlewares/auth.middleware';
import { selectuser } from '../middlewares/selectuser.middleware';
import { checkUser,checkAdmin } from '../middlewares/checkuser.middleware';



const router = express.Router();



//route to create a new user
router.post('/user_registration',newUserValidator,selectuser("User"),userController.newUser);

// route to create new admin
router.post('/admin_registration',newUserValidator,selectuser("Admin"),userController.newUser);

// route to login user
router.post('/login_user',checkUser,userController.login);


// route to login admin
router.post('/login_admin',checkAdmin,userController.login);


export default router;
