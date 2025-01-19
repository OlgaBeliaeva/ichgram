import jwt from 'jsonwebtoken';

const getUserIdFromToken = (req) => {
    const token = req.headers.autorization?.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    return decoded.user_id;
};

export default getUserIdFromToken;
