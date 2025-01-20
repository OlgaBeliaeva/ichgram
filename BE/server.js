import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import http from 'http';
import { Server } from 'socket.io';

import connectDB from './config/db.js';
import { messageSocketHandler, authenticateSocket } from './src/routes/messageRoutes.js';
import { notificationnSocketHandler } from "./middlewares/notificationSocketHandler.js";
import app from './app.js';

dotenv.config();
connectDB();

 const server = http.createServer(app)

 const PORT = process.env.PORT || 5001;
 
 app.use(bodyParser.json({limit: '10mb'}));
 app.use(bodyParser.urlencoded({limit: '10mb', extend: true}));

 //Инициализируем WebSocket сервер
 const io = new Server(server, {
    cors: {
        origin: "*",
        metods: ["GET", "POST"],
        credentials: true,
        allowedHeaders: ["Authorization", "Content-Type"],
    },
    transports: ["websocket", "polling"],
     });
     // Сохраняем io в app для доступа из контролеров
     app.set("io", io);
     // Middleware для WebSocket - аутентификации
     io.use((socket, next) => {
        authenticateSocket(socket, next);  // проверяем JWT токен
     });

     // обрабатываем WebSocket - соединения
     io.on('connection', (socket) =>{
        console.log(' Новое WebSocket - соединение');

      // подключаем обработчики сообщений
      messageSocketHandler(socket, io);
      
      // подключаем обработчики уведомлений
      notificationnSocketHandler(socket, io);
     });

     server.listen(PORT, () => {
        console.log(`Сервер запущен на порту ${PORT}`);
     });
