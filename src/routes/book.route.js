import express from 'express';
import * as userController from '../controllers/user.controller';
import { userAuth } from '../middlewares/auth.middleware';

const router = express.Router();


router.post("/",userAuth("Admin"),userController.Addbook)


router.patch("/:_id",userAuth("Admin"),userController.UpdateBook)


router.delete("/:_id",userAuth("Admin"),userController.DeleteBook)


router.get("/:_id",userController.fetchByID)


router.get("/",userController.FetchAllBooks)

export default router;
