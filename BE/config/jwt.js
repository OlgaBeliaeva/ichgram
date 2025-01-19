import jwt from "jsonwebtoken";

const generateTocken = (user) => {
    return jwt.sign({ user_id: user._id}, process.env.JWT_SECRET, {
        expiresIn: '3h', // время действия токена
    });
};

export default generateTocken;
