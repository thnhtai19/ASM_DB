const db = require('../models/db'); 

const getNumberProductSoldbyId = (req, res) => {
    const { MaNguoiBan } = req.body;

    if (!MaNguoiBan) {
        return res.status(400).json({ message: 'Mã người bán không được để trống' });
    }

    const query = 'SELECT TinhSoLuongSanPhamDaBan(?) AS SoLuongDaBan';

    db.execute(query, [MaNguoiBan], (err, results) => {
        if (err) {
            console.error('Lỗi khi gọi hàm: ', err);
            return res.status(500).json({ message: 'Lỗi khi truy vấn cơ sở dữ liệu' });
        }

        const SoLuongDaBan = results[0]?.SoLuongDaBan;

        if (SoLuongDaBan !== null && SoLuongDaBan > 0) {
            return res.json({ SoLuongDaBan });
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


module.exports = {
    getNumberProductSoldbyId,
    getRating
};