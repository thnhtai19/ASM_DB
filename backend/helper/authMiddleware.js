const jwt = require('jsonwebtoken');
require('dotenv').config(); 

const SECRET_KEY = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
    const token = req.cookies.token; 

    if (!token) {
        return res.status(401).json({ message: 'Bạn cần đăng nhập vào Admin để truy cập tài nguyên này.' });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY);
        if (decoded.role !== 'admin') {
            return res.status(403).json({ message: 'Chỉ có admin mới được phép truy cập.' });
        }

        req.admin = decoded;
        next(); 
    } catch (error) {
        console.error('Lỗi xác thực token:', error.message); 
        if (error.name === 'TokenExpiredError') {
            return res.status(403).json({ message: 'Token đã hết hạn. Vui lòng đăng nhập lại.' });
        } else if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ message: 'Token không hợp lệ. Vui lòng kiểm tra hoặc đăng nhập lại.' });
        } else {
            return res.status(500).json({ message: 'Lỗi không xác định khi xác thực token.' });
        }
    }
};

module.exports = authenticateToken;
