const db = require('./db'); 

const themSanPham = (p_MoTa, p_Loai, p_TenSanPham, p_MaDanhMuc, p_MaCuaHang, p_SoLuong, p_Gia) => {
  return new Promise((resolve, reject) => {
    const sql = 'CALL ThemSanPham(?, ?, ?, ?, ?, ?, ?)';
    db.query(sql, [p_MoTa, p_Loai, p_TenSanPham, p_MaDanhMuc, p_MaCuaHang, p_SoLuong, p_Gia], (err, result) => {
      if (err) {
        reject(err); 
      }
      resolve(result); 
    });
  });
};

module.exports = {
  themSanPham
};
