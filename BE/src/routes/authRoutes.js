import express from 'express';
import { register, login, checkUser, updatePassword } from '../controllers/authController';

const router = express.Router();

// ркгистрация нового пользователя
router.post('/register', register);

// вход пользователя
router.post('/login', login);


router.post('/check-user', checkUser);

// обновление пароля
router.post('/update-password', updatePassword);

export default router;
