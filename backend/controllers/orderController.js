const db = require('../models/db'); 

const getOrdersByBuyerId = (req, res) => {
    const { MaNguoiMua } = req.body; 
    if (!MaNguoiMua) {
        return res.status(400).json({ error: 'Mã người mua là bắt buộc.' });
    }
    const sql = 'CALL hienThiDonHang(?)';
    db.query(sql, [MaNguoiMua], (err, result) => {
        if (err) {
            console.error('Lỗi khi truy xuất đơn hàng:', err);
            return res.status(500).json({ error: 'Lỗi khi truy xuất đơn hàng.' });
        }
        return res.status(200).json({
            message: 'Truy xuất đơn hàng thành công.',
            data: result[0] 
        });
    });
};

const getOrderStatisticsByDate = (req, res) => {
    const { ngay } = req.body; 

    if (!ngay) {
        return res.status(400).json({ error: 'Tham số ngày (ngay) là bắt buộc' });
    }

    const sql = 'CALL SoNguoiMua(?)';
    db.query(sql, [ngay], (err, result) => {
        if (err) {
            console.error('Lỗi khi thống kê đơn hàng:', err);
            return res.status(500).json({ error: 'Lỗi khi thống kê đơn hàng.' });
        }

        return res.status(200).json({
            message: 'Thống kê đơn hàng thành công',
            data: result[0] 
        });
    });
};


module.exports = {
  getOrdersByBuyerId,
  getOrderStatisticsByDate 
};
