// Регистрация пользователя
import bcrypt from 'bcrypt';
import User from '../models/userModel.js';
import generateTocken from '../config/jwt.js';
  

export const register = async (req,res) => {
    const { username, email, password, full_name } = req.body;
   
    try {
        const existingUser = await User.findOne({ $or: [{email}, {username}] });
     
        if (existingUser) {
// разделяем ошибки по email и username
const errors = {};
if (existingUser.email === email) {
    errors.email = 'This email is already taken';
 }
if (existingUser.username === username) {
    errors.username = 'This username is already taken';
 }
 
 return res. status(400).json({errors});
 }

 const hashedPassword = await bcrypt.hash(password, 10);
 const user = new User({username, email, password: hashedPassword, full_name });
 await user.save();

 const token = generateTocken(user);

 res. status(201).json({token, user});
} catch (error) {
    res. status(500).json({message: 'Server error', error: error.message });
}     
 };


 // логин пользователя
export const login = async (req, res) => {
    const {email, password } = req.body;

    try {
        // Поиск пользователя по email
        const user = await User.findOne({ email });

        if (!user) { 
            return res. status(400).json({message: 'Incorrect email or password' });
        }

      // Проверяется пароль 
      const isMatch  = await bcrypt.compare(password, user.password);

      if (!isMatch) { 
        return res. status(400).json({message: 'Incorrect email or password' });
    }

    // Генерация токена
    const token =  generateTocken(user);

    res. status(200).json({token, user});
    } catch (error) {
        res. status(500).json({message: 'SAuthorisation error', error: error.message });
    }
};



export const checkUser = async (req, res) => {
    const { email } = req.body;
    // Логика проверки пользователя
    const user = await User.findOne({ email });
if (user) {
    res.status(200).json({ message: "User found"});
    } else {
        res.status(400).json({ message: "User  not found"});   
    } 
};


// Функция для обновления пароля
export const updatePassword = async (req, res) => {
    try {
        console.log("Request Body:", rec.body); // для отладки
        const { email, newPassword } = req.body;

        if (!email || !newPassword) {
            return res.status(400).json({ message: " Необходимые данные не были переданы"})ж
    }

    // хешируем новый пароль перед сохранением в базе данных
    const hashedPassword = await bcrypt.hash(newPassword, 10);
     
    // находим пользователя по email
    const user = await User.findOne({ email });
    
    if (!user) { 
        return res. status(400).json({message: 'Пользователь не найден' });
    }

    // обновляем пароль пользователя
    user.password = hashedPassword;
     
    // сохраняем обновления в базе данных
    await user.save();

     return res. status(200).json({message: 'Пароль успешно обновлен' });
} catch (error) {
    console.error("Ошибка при обновлении пароля:", error);
    return res.status(500).json({ message:"Ошибка при обновлении пароля:", error: error.message });
}
};




