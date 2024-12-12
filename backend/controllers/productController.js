const productModel = require('../models/product');
const db = require('../models/db');

const addProduct = async (req, res) => {
    const { MoTa, Loai, TenSanPham, MaDanhMuc, MaCuaHang, SoLuong, Gia } = req.body;
    if (!MoTa) return res.status(400).json({ message: 'Thiếu mô tả sản phẩm.' });
    if (!Loai) return res.status(400).json({ message: 'Thiếu loại sản phẩm.' });
    if (!TenSanPham) return res.status(400).json({ message: 'Thiếu tên sản phẩm.' });
    if (!MaDanhMuc) return res.status(400).json({ message: 'Thiếu mã danh mục.' });
    if (!MaCuaHang) return res.status(400).json({ message: 'Thiếu mã cửa hàng.' });
    if (SoLuong == null || SoLuong <= 0) return res.status(400).json({ message: 'Số lượng phải là một số nguyên dương.' });
    if (Gia == null || Gia <= 0) return res.status(400).json({ message: 'Giá sản phẩm phải là một số dương.' });
    
    try {
        const result = await productModel.themSanPham(MoTa, Loai, TenSanPham, MaDanhMuc, MaCuaHang, SoLuong, Gia);
        res.status(200).json({
            message: 'Thêm sản phẩm thành công.',
      data: result,
    });
} catch (err) {
    console.error('Lỗi khi thêm sản phẩm:', err);
    if (err.code === 'ER_SIGNAL_EXCEPTION' && err.sqlMessage.includes('Sản phẩm đã tồn tại')) {
        return res.status(409).json({ message: 'Sản phẩm đã tồn tại.' });
    }
    if (err.code === 'ER_SIGNAL_EXCEPTION') {
        if (err.sqlMessage.includes('Mã danh mục không tồn tại')) {
            return res.status(400).json({ message: 'Mã danh mục không tồn tại.' });
        } else if (err.sqlMessage.includes('Mã cửa hàng không tồn tại')) {
            return res.status(400).json({ message: 'Mã cửa hàng không tồn tại.' });
        }
    }
    if (err.code === 'ER_DUP_ENTRY') {
        return res.status(409).json({ message: 'Sản phẩm đã tồn tại.' });
    } else if (err.code === 'ER_NO_REFERENCED_ROW') {
        return res.status(400).json({ message: 'Mã danh mục hoặc mã cửa hàng không tồn tại.' });
    }
    res.status(500).json({ message: 'Có lỗi xảy ra khi thêm sản phẩm.' });
}
};


const updateProduct = (req, res) => {
    const {MoTa, Loai, TenSanPham, MaDanhMuc, MaCuaHang, SoLuong, Gia } = req.body;
    if (!MoTa || !Loai || !TenSanPham || !MaDanhMuc || !MaCuaHang || SoLuong == null || Gia == null) {
        //if (!MaSanPham) return res.status(400).json({ message: 'Thiếu mã sản phẩm.' });
        //if (!MoTa) return res.status(400).json({ message: 'Thiếu mô tả sản phẩm.' });
        //if (!Loai) return res.status(400).json({ message: 'Thiếu loại sản phẩm.' });
        if (!TenSanPham) return res.status(400).json({ message: 'Thiếu tên sản phẩm.' });
        //if (!MaDanhMuc) return res.status(400).json({ message: 'Thiếu mã danh mục.' });
        //if (!MaCuaHang) return res.status(400).json({ message: 'Thiếu mã cửa hàng.' });
        if (SoLuong == null || SoLuong <= 0) return res.status(400).json({ message: 'Số lượng phải là một số nguyên dương.' });
        if (Gia == null || Gia <= 0) return res.status(400).json({ message: 'Giá sản phẩm phải là một số dương.' });
    }
    
    const sql = 'CALL SuaSanPham(?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [MoTa, Loai, TenSanPham, MaDanhMuc, MaCuaHang, SoLuong, Gia], (err, result) => {
        if (err) {
            console.error('Lỗi khi cập nhật sản phẩm:', err);
            if (err.code === 'ER_SIGNAL_EXCEPTION' && err.sqlMessage.includes('Sản phẩm không tồn tại')) {
                return res.status(404).json({ error: 'Sản phẩm không tồn tại.' });
            }
            if (err.code === 'ER_SIGNAL_EXCEPTION' && err.sqlMessage.includes('Mã danh mục không tồn tại')) {
                return res.status(400).json({ error: 'Mã danh mục không tồn tại.' });
            }
            if (err.code === 'ER_SIGNAL_EXCEPTION' && err.sqlMessage.includes('Mã cửa hàng không tồn tại')) {
                return res.status(400).json({ error: 'Mã cửa hàng không tồn tại.' });
            }
            return res.status(500).json({ error: 'Lỗi khi cập nhật sản phẩm.' });
        }
        return res.status(200).json({ message: 'Cập nhật sản phẩm thành công.', data: result });
    });
};




const deleteProduct = (req, res) => {
    const { MaSanPham } = req.body; 
    const checkExistSql = 'SELECT 1 FROM SanPham WHERE MaSanPham = ?';
    db.query(checkExistSql, [MaSanPham], (err, result) => {
        if (err) {
            console.error('Lỗi khi kiểm tra sản phẩm:', err);
            return res.status(500).json({ error: 'Lỗi khi kiểm tra sản phẩm.' });
        }
        if (result.length === 0) {
            return res.status(404).json({ error: 'Sản phẩm không tồn tại.' });
        }
        const deleteSql = 'CALL XoaSanPham(?)';
        db.query(deleteSql, [MaSanPham], (err, result) => {
            if (err) {
                console.error('Lỗi khi xóa sản phẩm:', err);
                return res.status(500).json({ error: 'Lỗi khi xóa sản phẩm.' });
            }
            return res.status(200).json({ message: 'Sản phẩm đã được xóa thành công.' });
        });
    });
};

// const updateProduct = (req, res) => {
//     const { MaSanPham, MoTa, Loai, TenSanPham, MaDanhMuc, MaCuaHang, SoLuong, Gia } = req.body;
    
//     if (!MaSanPham || !TenSanPham || !SoLuong || !Gia) {
//         return res.status(400).json({ error: 'Thiếu thông tin.' });
//     }
//     const sql = 'CALL SuaSanPham(?, ?, ?, ?, ?, ?, ?, ?)';
//     db.query(sql, [MaSanPham, MoTa, Loai, TenSanPham, MaDanhMuc, MaCuaHang, SoLuong, Gia], (err, result) => {
//         if (err) {
//             console.error('Lỗi khi cập nhật sản phẩm:', err);
//             return res.status(500).json({ error: 'Lỗi khi cập nhật sản phẩm.' });
//         }
//         return res.status(200).json({ message: 'Cập nhật sản phẩm thành công.', data: result });
//     });
// };

// const addProduct = async (req, res) => {
    //   const { MoTa, Loai, TenSanPham, MaDanhMuc, MaCuaHang, SoLuong, Gia } = req.body;
    
    //   if (!MoTa || !Loai || !TenSanPham || !MaDanhMuc || !MaCuaHang || !SoLuong || !Gia) {
        //     return res.status(400).send('Thiếu thông tin sản phẩm.');
        //   }
        //   try {
            //     const result = await productModel.themSanPham(MoTa, Loai, TenSanPham, MaDanhMuc, MaCuaHang, SoLuong, Gia);
            //     res.status(200).send(result);
//   } catch (err) {
//     console.error(err);
//     res.status(500).send('Có lỗi xảy ra khi thêm sản phẩm.');
//   }
// };

// const getAllProducts = async (req, res) => {
    //   try {
        //     const products = await productModel.getAllProducts(); 
        //     res.status(200).json({ message: 'Lấy danh sách sản phẩm thành công.', data: products });
        //   } catch (err) {
            //     console.error('Lỗi khi lấy danh sách sản phẩm:', err);
            //     res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm.' });
            //   }
            // };
            
            const getAllProducts = (req, res) => {
    const queryStores = 'SELECT MaCuaHang AS id, TenCuaHang AS Ten_Cua_Hang FROM CuaHang';
    const queryCategories = 'SELECT MaDanhMuc AS id, TenDanhMuc AS Ten_Danh_Muc FROM DanhMuc';
    const queryProducts = `
        SELECT 
            sp.MaSanPham AS id,
            sp.TenSanPham AS Ten_San_Pham,
            sp.MoTa AS Mo_Ta,
            sp.Loai AS loai,
            sp.MaDanhMuc AS Ma_Danh_Muc,
            dm.TenDanhMuc AS Ten_Danh_Muc,
            sp.MaCuaHang AS Ma_Cua_Hang,
            ch.TenCuaHang AS Ten_Cua_Hang,
            sp.SoLuong AS So_Luong,
            sp.Gia AS Gia
        FROM SanPham sp
        LEFT JOIN DanhMuc dm ON sp.MaDanhMuc = dm.MaDanhMuc
        LEFT JOIN CuaHang ch ON sp.MaCuaHang = ch.MaCuaHang;
    `;

    const dbQueries = [
        { key: 'Danh_sach_cua_hang', query: queryStores },
        { key: 'Danh_sach_danh_muc', query: queryCategories },
        { key: 'Danh_sach_san_pham', query: queryProducts },
    ];

    const results = {};
    let pendingQueries = dbQueries.length;

    dbQueries.forEach(({ key, query }) => {
        db.query(query, (err, data) => {
            if (err) {
                console.error(`Lỗi khi truy vấn ${key}:`, err);
                return res.status(500).json({ message: 'Lỗi hệ thống khi lấy dữ liệu' });
            }

            results[key] = data;
            pendingQueries--;

            if (pendingQueries === 0) {
                res.status(200).json(results);
            }
        });
    });
};


module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getAllProducts
};
