const db = require('../models/db'); 

// const getOrdersByBuyerId = (req, res) => {
//     const { MaNguoiMua } = req.body;
//     if (!MaNguoiMua) {
//         return res.status(400).json({ error: 'Mã người mua là bắt buộc.' });
//     }
//     const sql = 'CALL hienThiDonHang(?)';
//     db.query(sql, [MaNguoiMua], (err, result) => {
//         if (err) {
//             console.error('Lỗi khi truy xuất đơn hàng:', err);
//             return res.status(500).json({ error: 'Lỗi khi truy xuất đơn hàng.' });
//         }
//         return res.status(200).json({
//             message: 'Truy xuất đơn hàng thành công.',
//             data: result[0]
//         });
//     });
// };
// const getAllBuyersAndOrders = (req, res) => {
//       // Truy vấn để lấy các đơn hàng với thông tin người mua và người bán
//      const sql = 'CALL hienThiHoaDon()';
    
//     db.query(sql, (err, result) => {
//         if (err) {
//             console.error('Lỗi khi truy xuất đơn hàng:', err);
//             return res.status(500).json({ error: 'Lỗi khi truy xuất đơn hàng.' });
//         }

//         return res.status(200).json({
//             message: 'Truy xuất đơn hàng thành công.',
//             data: result[0]  // Trả về các đơn hàng với thông tin người mua và người bán
//         });
//     });
// };


const getAllBuyersAndOrders = (req, res) => {
    const sql = 'CALL hienThiHoaDon()';

    db.query(sql, (err, result) => {
        if (err) {
            console.error('Lỗi khi truy xuất đơn hàng:', err);
            return res.status(500).json({ error: 'Lỗi khi truy xuất đơn hàng.' });
        }
        const orders = result[0];
        const detailedOrdersPromises = orders.map(order => {
            return new Promise((resolve, reject) => {
                const sqlDetails = `
                    SELECT 
                        sanpham.MaSanPham, 
                        sanpham.TenSanPham,
                        sanpham.Loai,
                        co.SoLuong
                    FROM 
                        co
                    JOIN 
                        sanpham ON sanpham.MaSanPham = co.MaSanPham
                    WHERE 
                        co.MaDonHang = ?;  -- Sử dụng placeholder ?
                `;

                db.query(sqlDetails, [order.MaDonHang], (err, productDetails) => {
                    if (err) {
                        return reject(err);
                    }
                    order.ChiTietSanPham = productDetails;
                    resolve(order);
                });
            });
        });
        Promise.all(detailedOrdersPromises)
            .then(detailedOrders => {
                const formattedOrders = detailedOrders.map(order => ({
                    ...order,
                    NgayDat: new Date(order.NgayDat).toLocaleString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                    })
                }));
                return res.status(200).json({
                    message: 'Truy xuất đơn hàng và chi tiết sản phẩm thành công.',
                    data: formattedOrders
                });
            })
            .catch(error => {
                console.error('Lỗi khi lấy chi tiết sản phẩm:', error);
                return res.status(500).json({ error: 'Lỗi khi lấy chi tiết sản phẩm.' });
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


const updateOrderStatus = (req, res) => {
    const { MaDonHang, TTThanhToan, TTDonHang } = req.body;

    if (!MaDonHang) {
        return res.status(400).json({ error: 'MaDonHang là bắt buộc.' });
    }
    const validPaymentStatus = ["Đã thanh toán", "Chưa thanh toán"];
    const validOrderStatus = ["Đã giao hàng", "Chưa giao hàng"];
    if (TTThanhToan && !validPaymentStatus.includes(TTThanhToan)) {
        return res.status(400).json({
            error: `TTThanhToan phải là một trong các giá trị: ${validPaymentStatus.join(', ')}.`,
        });
    }
    if (TTDonHang && !validOrderStatus.includes(TTDonHang)) {
        return res.status(400).json({
            error: `TTDonHang phải là một trong các giá trị: ${validOrderStatus.join(', ')}.`,
        });
    }
    const sql = `
        UPDATE donhang
        SET 
            TTThanhToan = COALESCE(?, TTThanhToan),
            TTDonHang = COALESCE(?, TTDonHang)
        WHERE MaDonHang = ?;
    `;
    db.query(sql, [TTThanhToan, TTDonHang, MaDonHang], (err, result) => {
        if (err) {
            console.error('Lỗi khi cập nhật trạng thái đơn hàng:', err);
            return res.status(500).json({ error: 'Lỗi khi cập nhật trạng thái đơn hàng.' });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({ error: 'Không tìm thấy đơn hàng với MaDonHang đã cho.' });
        }
        return res.status(200).json({
            message: 'Cập nhật trạng thái đơn hàng thành công.',
        });
    });
};



module.exports = {
  getAllBuyersAndOrders,
  getOrderStatisticsByDate,
  updateOrderStatus
};
