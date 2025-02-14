import express from 'express';
import upload from '../middlewares/multer.js';
import { createPost, getPostById, updatePost, deletePost, getUserPosts, getAllPosts, getOtherUserPosts } from '../controllers/postController.js';
import authMiddleware from '../middlewares/authMiddleware.js';
import { getFollowingPosts } from '../controllers/postController.js';


const router = express.Router();

// Создание нового поста
router.post('/', authMiddleware, upload.single('image'), createPost);

// Получение поста по ID
router.get('/single/:postId', authMiddleware, getPostById);

// Обновление поста
router.put('/:postId', authMiddleware,  upload.single('image'), updatePost);

// Удаление поста
router.delete('/:postId', authMiddleware, deletePost);

// Получение всех постов пользователя
router.get('/all', authMiddleware, getUserPosts);

// Получение всех постов
router.get('/all/public', authMiddleware, getAllPosts);

// Получение всех постов юзера по ID
router.get('/:user_id', authMiddleware, getOtherUserPosts);

// Получение всех постов юзеров на которых подписаны
//router.get('/following', authMiddleware, getFollowingPosts);

export default router;