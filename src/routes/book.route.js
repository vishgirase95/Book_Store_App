import express from 'express';
import * as userController from '../controllers/user.controller';
import { userAuth } from '../middlewares/auth.middleware';

const router = express.Router();


router.post("/AddBook",userAuth("Admin"),userController.Addbook)


router.post("/UpdateBook",userAuth("Admin"),userController.UpdateBook)


router.delete("/DeleteBook/:_id",userAuth("Admin"),userController.DeleteBook)


router.get("/FetchBook/:_id",userController.fetchByID)

export default router;
