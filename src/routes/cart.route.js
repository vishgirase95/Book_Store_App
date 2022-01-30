import express from 'express';
import * as userController from '../controllers/user.controller';
import { userAuth } from '../middlewares/auth.middleware';

const router = express.Router();

// add book in cart
router.post("/",userAuth("User"),userController.AddCart);
   
// get cart
router.get("/",userAuth("User"),userController.getCart);

// remove book from cart
router.patch("/",userAuth("User"),userController.removeBook); 


export default router;