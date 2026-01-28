import express from 'express';
import {registerUser,loginUser,getMe, updateUserProfile} from '../controllers/authController.js'
import protect from '../middlewares/authMiddleware.js';

const authRouter = express.Router();


authRouter.post('/register',registerUser);
authRouter.post('/login',loginUser);
authRouter.route('/me').get(protect,getMe).put(protect,updateUserProfile);

export default authRouter;