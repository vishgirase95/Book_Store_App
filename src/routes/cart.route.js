import express from 'express';
import * as userController from '../controllers/user.controller';
import { userAuth } from '../middlewares/auth.middleware';

const router = express.Router();


router.post("/",userAuth("User"),userController.AddCart)

export default router;