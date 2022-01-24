import express from 'express';
import * as userController from '../controllers/user.controller';
import { newUserValidator } from '../validators/user.validator';
import { userAuth } from '../middlewares/auth.middleware';
import { selectuser } from '../middlewares/selectuser.middleware';

const router = express.Router();



//route to create a new user
router.post('/user_registration',selectuser("User"),newUserValidator,userController.newUser);

// route to create new admin
router.post('/admin_registration',selectuser("Admin"),newUserValidator,userController.newUser);


export default router;
