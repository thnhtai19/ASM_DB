const productModel = require('../models/product');
const db = require('../models/db');

const addProduct = async (req, res) => {
  const { MoTa, Loai, TenSanPham, MaDanhMuc, MaCuaHang, SoLuong, Gia } = req.body;

  if (!MoTa || !Loai || !TenSanPham || !MaDanhMuc || !MaCuaHang || !SoLuong || !Gia) {
    return res.status(400).send('Thiếu thông tin sản phẩm.');
  }
  try {
    const result = await productModel.themSanPham(MoTa, Loai, TenSanPham, MaDanhMuc, MaCuaHang, SoLuong, Gia);
    res.status(200).send(result); 
  } catch (err) {
    console.error(err);
    res.status(500).send('Có lỗi xảy ra khi thêm sản phẩm.');
  }
};

const updateProduct = (req, res) => {
    const { MaSanPham, MoTa, Loai, TenSanPham, MaDanhMuc, MaCuaHang, SoLuong, Gia } = req.body;

    if (!MaSanPham || !TenSanPham || !SoLuong || !Gia) {
        return res.status(400).json({ error: 'Thiếu thông tin.' });
    }
    const sql = 'CALL SuaSanPham(?, ?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [MaSanPham, MoTa, Loai, TenSanPham, MaDanhMuc, MaCuaHang, SoLuong, Gia], (err, result) => {
        if (err) {
            console.error('Lỗi khi cập nhật sản phẩm:', err);
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


const getAllProducts = async (req, res) => {
  try {
    const products = await productModel.getAllProducts(); 
    res.status(200).json({ message: 'Lấy danh sách sản phẩm thành công.', data: products });
  } catch (err) {
    console.error('Lỗi khi lấy danh sách sản phẩm:', err);
    res.status(500).json({ error: 'Lỗi khi lấy danh sách sản phẩm.' });
  }
};

module.exports = {
    addProduct,
    updateProduct,
    deleteProduct,
    getAllProducts
};
