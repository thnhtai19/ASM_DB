
const db = require('../models/db'); 
const jwt = require('jsonwebtoken');
const SECRET_KEY = process.env.JWT_SECRET;


const loginAdmin = (req, res) => {
    const { email, matkhau } = req.body;
    if (!email || !matkhau) {
        return res.status(400).json({ error: 'Email và mật khẩu là bắt buộc' });
    }
    const query = 'SELECT * FROM NguoiDung WHERE Email = ? AND MatKhau = ?';
    db.query(query, [email, matkhau], (err, results) => {
        if (err) {
            console.error('Lỗi khi đăng nhập:', err);
            return res.status(500).json({ error: 'Lỗi hệ thống' });
        }
        if (results.length === 0) {
            return res.status(401).json({ error: 'Email hoặc mật khẩu không đúng' });
        }
        const user = results[0];
        if (user.HoTen !== "Admin") {
            return res.status(403).json({ error: 'Bạn không có quyền đăng nhập với tư cách admin' });
        }
        const token = jwt.sign(
            { id: user.MaNguoiDung, role: "admin" },
            SECRET_KEY,
            { expiresIn: '1h' }
        );
        res.cookie('token', token, { httpOnly: true, secure: false, maxAge: 3600000 });
        return res.status(200).json({ message: 'Admin đăng nhập thành công' });
    });
}
const logoutAdmin = (req, res) => {
    res.clearCookie('token'); 
    res.status(200).json({ message: 'Đăng xuất thành công' });
};

const  getNumberProductSoldbyId = (req, res) => {
    const { MaNguoiBan } = req.body;
    if (!MaNguoiBan) {
        return res.status(400).json({ message: 'Mã người bán không được để trống' });
    }
    const query1 = 'SELECT TinhSoLuongSanPhamDaBan(?) AS SoLuongDaBan';
    db.execute(query1, [MaNguoiBan], (err, results1) => {
        if (err) {
            console.error('Lỗi khi gọi hàm tính số lượng sản phẩm: ', err);
            return res.status(500).json({ message: 'Lỗi khi truy vấn cơ sở dữ liệu' });
        }
        const SoLuongDaBan = results1[0]?.SoLuongDaBan;
        if (SoLuongDaBan !== null && SoLuongDaBan > 0) {
            const query2 = 'CALL LayChiTietSanPhamDaBan(?)';
            db.execute(query2, [MaNguoiBan], (err, results2) => {
                if (err) {
                    console.error('Lỗi khi gọi thủ tục lấy chi tiết sản phẩm: ', err);
                    return res.status(500).json({ message: 'Lỗi khi truy vấn cơ sở dữ liệu' });
                }
                const productDetails = results2[0];
                return res.json({ SoLuongDaBan, productDetails });
            });
        } else {
            return res.json({ message: 'Không có sản phẩm hoặc không tồn tại người bán.' });
        }
    });
};


const getRating = (req, res) => {
    const { MaCuaHang } = req.body;  
    if (!MaCuaHang) {
        return res.status(400).json({ message: 'Mã cửa hàng không hợp lệ' });
    }
    const query = 'SELECT TinhDiemTrungBinhCuaHang(?) AS `Số Sao Trung Bình Của Cửa Hàng`';
    db.execute(query, [MaCuaHang], (err, results) => {
        if (err) {
            console.error('Lỗi khi gọi hàm: ', err);
            return res.status(500).json({ message: 'Lỗi khi gọi hàm' });
        }
        const rating = results[0]?.['Số Sao Trung Bình Của Cửa Hàng'];
        if (rating !== null && rating !== undefined) {
            res.json({ 'Số Sao Trung Bình Của Cửa Hàng': rating });
        } else {
            res.json({ message: 'Cửa hàng này không có sản phẩm nào được đánh giá hoặc không tồn tại.' });
        }
    });
};


const getAllStoreRatings = (req, res) => {
    const query = 'CALL LayDanhSachCuaHangVaSoSao()';
    db.execute(query, (err, results) => {
        if (err) {
            console.error('Lỗi khi gọi thủ tục: ', err);
            return res.status(500).json({ message: 'Lỗi khi truy vấn cơ sở dữ liệu' });
        }
        const stores = results[0];
        if (stores.length > 0) {
            res.json({ stores });
        } else {
            res.json({ message: 'Không có cửa hàng nào trong cơ sở dữ liệu.' });
        }
    });
};


module.exports = {
    getNumberProductSoldbyId,
    getRating,
    loginAdmin,
    logoutAdmin,
    getAllStoreRatings
};
