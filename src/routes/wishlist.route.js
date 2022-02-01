import express from 'express';
import * as userController from '../controllers/user.controller';
import { userAuth } from '../middlewares/auth.middleware';

const router = express.Router();
// add in wishlist
router.post("/:BookID",userAuth("User"),userController.AddToWishlist);

// remove from wishlist
router.patch("/:BookID",userAuth("User"),userController.removeWishlist);

router.get("/",userAuth("User"),userController.fetchWishList);





export default router;