import {Router} from 'express';
import { RegisterUser } from '../controllers/user.controller.js';

export const userRouter = Router();

userRouter.route('/register').post(RegisterUser)

