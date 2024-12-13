DROP DATABASE IF EXISTS btl_csdl;
CREATE DATABASE btl_csdl;
USE btl_csdl;

-- Bảng Người dùng
CREATE TABLE NguoiDung (
    CCCD CHAR(12) PRIMARY KEY,
    MatKhau VARCHAR(255) NOT NULL,
    Email VARCHAR(255) UNIQUE NOT NULL,
    HoTen VARCHAR(100) NOT NULL,
    SDT CHAR(10) UNIQUE
);

-- Bảng Người mua (MaNguoiMua tham chiếu đến CCCD trong NguoiDung)
CREATE TABLE NguoiMua (
    MaNguoiMua CHAR(12) PRIMARY KEY,
    NgaySinh DATE NOT NULL,
    CONSTRAINT fk_NguoiMua_NguoiDung FOREIGN KEY (MaNguoiMua) REFERENCES NguoiDung(CCCD)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Bảng Người bán (MaNguoiBan tham chiếu đến CCCD trong NguoiDung)
CREATE TABLE NguoiBan (
    MaNguoiBan CHAR(12) PRIMARY KEY,
    NgaySinh DATE NOT NULL,
    CONSTRAINT fk_NguoiBan_NguoiDung FOREIGN KEY (MaNguoiBan) REFERENCES NguoiDung(CCCD)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Bảng Admin
CREATE TABLE Admin (
    MaAdmin CHAR(12) PRIMARY KEY,
    CONSTRAINT fk_Admin_NguoiDung FOREIGN KEY (MaAdmin) REFERENCES NguoiDung(CCCD)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Bảng Danh mục
CREATE TABLE DanhMuc (
    MaDanhMuc INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    TenDanhMuc VARCHAR(100) NOT NULL,
    MoTa VARCHAR(255),
    ThuTuHienThi INT NOT NULL
);

-- Bảng Cửa hàng
CREATE TABLE CuaHang (
    MaCuaHang INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    DiaChi VARCHAR(255) NOT NULL,
    MoTa VARCHAR(255),
    TenCuaHang VARCHAR(100) NOT NULL,
    MaNguoiBan CHAR(12) NOT NULL,
    CONSTRAINT fk_CuaHang_NguoiBan FOREIGN KEY (MaNguoiBan) REFERENCES NguoiBan(MaNguoiBan)
    ON UPDATE CASCADE
);

-- Bảng Sản phẩm
CREATE TABLE SanPham (
    MaSanPham INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    MoTa VARCHAR(255),
    Loai VARCHAR(100),
    TenSanPham VARCHAR(100) NOT NULL,
    MaDanhMuc INT,
    MaCuaHang INT,
    SoLuong INT CHECK (SoLuong >= 0),
    Gia DECIMAL(18, 2) NOT NULL,
    CONSTRAINT fk_SanPham_DanhMuc FOREIGN KEY (MaDanhMuc) REFERENCES DanhMuc(MaDanhMuc)
    ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT fk_SanPham_CuaHang FOREIGN KEY (MaCuaHang) REFERENCES CuaHang(MaCuaHang)
    ON DELETE SET NULL ON UPDATE CASCADE
);

-- Bảng Giỏ hàng
CREATE TABLE GioHang (
    MaGioHang INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    MaNguoiMua CHAR(12) NOT NULL,
    CONSTRAINT fk_GioHang_NguoiMua FOREIGN KEY (MaNguoiMua) REFERENCES NguoiMua(MaNguoiMua)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Bảng Chứa
CREATE TABLE Chua (
    MaGioHang INT NOT NULL,
    MaSanPham INT NOT NULL,
    SoLuong INT CHECK (SoLuong > 0),
    PRIMARY KEY (MaGioHang, MaSanPham),
    CONSTRAINT fk_Chua_GioHang FOREIGN KEY (MaGioHang) REFERENCES GioHang(MaGioHang)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_Chua_SanPham FOREIGN KEY (MaSanPham) REFERENCES SanPham(MaSanPham)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Bảng Đơn hàng
CREATE TABLE DonHang (
    MaDonHang INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    NgayDat DATE NOT NULL,
    PTThanhToan VARCHAR(50) NOT NULL,
    TTThanhToan ENUM('Đã thanh toán', 'Chưa thanh toán') DEFAULT 'Chưa thanh toán',
    TTDonHang ENUM('Đã giao hàng', 'Chưa giao hàng') DEFAULT 'Chưa giao hàng',
    MaNguoiMua CHAR(12) NOT NULL,
    CONSTRAINT fk_DonHang_NguoiMua FOREIGN KEY (MaNguoiMua) REFERENCES NguoiMua(MaNguoiMua)
    ON UPDATE CASCADE
);

-- Bảng Hóa đơn
CREATE TABLE HoaDon (
    MaHoaDon INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    ThoiGianTao TIMESTAMP NOT NULL,
    TTThanhToan ENUM('Đã thanh toán', 'Chưa thanh toán') DEFAULT 'Chưa thanh toán',
    TongGiaTri DECIMAL(18, 2),
    MaDonHang INT NOT NULL,
    CONSTRAINT fk_HoaDon_DonHang FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Bảng Thông tin thanh toán
CREATE TABLE ThongTinThanhToan (
    MaNguoiMua CHAR(12) NOT NULL,
    Loai VARCHAR(50) NOT NULL,
    SoTaiKhoan VARCHAR(20) NOT NULL,
    PRIMARY KEY (MaNguoiMua, Loai, SoTaiKhoan),
    CONSTRAINT fk_ThongTinThanhToan_NguoiMua FOREIGN KEY (MaNguoiMua) REFERENCES NguoiMua(MaNguoiMua)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Bảng Bài đánh giá
CREATE TABLE BaiDanhGia (
    MaBai INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    NgayTao DATE NOT NULL,
    SoSao INT CHECK (SoSao BETWEEN 1 AND 5),
    NoiDung TEXT NOT NULL,
    MaNguoiMua CHAR(12) NOT NULL,
    CONSTRAINT fk_BaiDanhGia_NguoiMua FOREIGN KEY (MaNguoiMua) REFERENCES NguoiMua(MaNguoiMua)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Bảng Đánh giá
CREATE TABLE DanhGia (
    MaBai INT NOT NULL,
    MaSanPham INT NOT NULL,
    MaDonHang INT NOT NULL,
    PRIMARY KEY (MaBai, MaSanPham, MaDonHang),
    CONSTRAINT fk_DanhGia_BaiDanhGia FOREIGN KEY (MaBai) REFERENCES BaiDanhGia(MaBai)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_DanhGia_SanPham FOREIGN KEY (MaSanPham) REFERENCES SanPham(MaSanPham)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_DanhGia_DonHang FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Bảng Phương thức vận chuyển
CREATE TABLE PhuongThucVanChuyen (
    MaSo INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Ten VARCHAR(50) NOT NULL,
    MoTa VARCHAR(50) NOT NULL
);

-- Bảng Xuất hàng
CREATE TABLE XuatHang (
    MaXuatHang INT PRIMARY KEY AUTO_INCREMENT,
    MaSanPham INT,
    MaNguoiBan CHAR(12) NOT NULL,
    MaVanChuyen INT NOT NULL,
    CONSTRAINT fk_XuatHang_SanPham FOREIGN KEY (MaSanPham) REFERENCES SanPham(MaSanPham)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_XuatHang_NguoiBan FOREIGN KEY (MaNguoiBan) REFERENCES NguoiBan(MaNguoiBan)
    ON UPDATE CASCADE,
    CONSTRAINT fk_XuatHang_PhuongThucVanChuyen FOREIGN KEY (MaVanChuyen) REFERENCES PhuongThucVanChuyen(MaSo)
    ON UPDATE CASCADE
);

-- Bảng Thông tin giao hàng
CREATE TABLE ThongTinGiaoHang (
    MaNguoiMua CHAR(12) NOT NULL,
    TenNguoiNhan CHAR(50) NOT NULL,
    SoDienThoai VARCHAR(12) NOT NULL,
    SoNha VARCHAR(50),
    Duong VARCHAR(50),
    Xa VARCHAR(50),
    Huyen VARCHAR(50),
    Tinh VARCHAR(50),
    PRIMARY KEY (MaNguoiMua, TenNguoiNhan),
    CONSTRAINT fk_ThongTinGiaoHang_NguoiMua FOREIGN KEY (MaNguoiMua) REFERENCES NguoiMua(MaNguoiMua)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Bảng Có
CREATE TABLE Co (
    MaDonHang INT NOT NULL,
    MaSanPham INT NOT NULL,
    SoLuong INT,
    PRIMARY KEY (MaSanPham, MaDonHang),
    CONSTRAINT fk_Co_DonHang FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_Co_SanPham FOREIGN KEY (MaSanPham) REFERENCES SanPham(MaSanPham)
    ON DELETE CASCADE ON UPDATE CASCADE
);

-- Bảng Chương trình khuyến mãi
CREATE TABLE ChuongTrinhKhuyenMai (
    MaKM INT NOT NULL PRIMARY KEY AUTO_INCREMENT,
    Ten VARCHAR(50) NOT NULL,
    MoTa VARCHAR(50),
    ThoiGianBD TIMESTAMP NOT NULL,
    ThoiGianKT TIMESTAMP NOT NULL,
    TyLeGiam FLOAT NOT NULL,
    SoLuong INT NOT NULL
);

-- Bảng Đặt hàng
CREATE TABLE DatHang (
    MaDonHang INT NOT NULL PRIMARY KEY,
    MaVanChuyen INT NOT NULL,
    MaNguoiMua CHAR(12) NOT NULL,
    PhiVanChuyen INT NOT NULL,
    CONSTRAINT fk_DatHang_DonHang FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_DatHang_PhuongThucVanChuyen FOREIGN KEY (MaVanChuyen) REFERENCES PhuongThucVanChuyen(MaSo)
    ON UPDATE CASCADE,
    CONSTRAINT fk_DatHang_NguoiMua FOREIGN KEY (MaNguoiMua) REFERENCES NguoiMua(MaNguoiMua)
    ON UPDATE CASCADE
);

-- Bảng Giảm giá
CREATE TABLE GiamGia (
    MaDonHang INT NOT NULL,
    MaKM INT NOT NULL,
    TongGTDon INT NOT NULL,
    PRIMARY KEY (MaDonHang, MaKM),
    CONSTRAINT fk_GiamGia_DonHang FOREIGN KEY (MaDonHang) REFERENCES DonHang(MaDonHang)
    ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT fk_GiamGia_KhuyenMai FOREIGN KEY (MaKM) REFERENCES ChuongTrinhKhuyenMai(MaKM)
    ON UPDATE CASCADE
);

-- Bảng Sử dụng
CREATE TABLE SuDung (
    MaKM INT NOT NULL,
    MaNguoiMua CHAR(12) NOT NULL,
    PRIMARY KEY (MaNguoiMua, MaKM),
    CONSTRAINT fk_SuDung_KhuyenMai FOREIGN KEY (MaKM) REFERENCES ChuongTrinhKhuyenMai(MaKM)
    ON UPDATE CASCADE,
    CONSTRAINT fk_SuDung_NguoiMua FOREIGN KEY (MaNguoiMua) REFERENCES NguoiMua(MaNguoiMua)
    ON DELETE CASCADE ON UPDATE CASCADE
);


-- ***** Bắt đầu 1.1 ***** ---

-- Trigger kiểm tra email
DELIMITER //
CREATE TRIGGER KiemTraEmailHopLe BEFORE INSERT ON NguoiDung
FOR EACH ROW
BEGIN
    IF NOT (NEW.Email REGEXP '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$') THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Địa chỉ email không hợp lệ.';
    END IF;
END; //
DELIMITER ;

-- Trigger kiểm tra mật khẩu
DELIMITER //
CREATE TRIGGER KiemTrakMatKhau BEFORE INSERT ON NguoiDung
FOR EACH ROW
BEGIN
    IF NOT (NEW.MatKhau REGEXP '^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*]).{8,}$') THEN
		SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Mật khẩu phải chứa ít nhất 8 ký tự, gồm chữ hoa, chữ thường, số và ký tự đặc biệt.';
    END IF;
END; //
DELIMITER ;

-- Trigger kiểm tra tuổi người mua
DELIMITER //
CREATE TRIGGER KiemTraTuoiNguoiMua BEFORE INSERT ON NguoiMua
FOR EACH ROW
BEGIN
    IF TIMESTAMPDIFF(YEAR, NEW.NgaySinh, CURDATE()) < 15 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Người mua phải từ đủ 15 tuổi trở lên.';
    END IF;
END; //
DELIMITER ;

-- Trigger kiểm tra tuổi người bán
DELIMITER //
CREATE TRIGGER KiemTraTuoiNguoiBan BEFORE INSERT ON NguoiBan
FOR EACH ROW
BEGIN
    IF TIMESTAMPDIFF(YEAR, NEW.NgaySinh, CURDATE()) < 18 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Người bán phải từ đủ 18 tuổi trở lên.';
    END IF;
END; //
DELIMITER ;

-- Trigger kiểm tra số đơn hàng trong ngày
DELIMITER //
CREATE TRIGGER KiemTraSoDonHangTrongNgay BEFORE INSERT ON DonHang
FOR EACH ROW
BEGIN
    DECLARE SoDonHangTrongNgay INT;
    SELECT COUNT(*) INTO SoDonHangTrongNgay
    FROM DonHang
    WHERE NgayDat = CURDATE() AND MaNguoiMua = NEW.MaNguoiMua;

    IF SoDonHangTrongNgay > 20 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Số đơn đặt hàng không được vượt quá 20 đơn hàng trong một ngày.';
    END IF;
END; //
DELIMITER ;

-- Trigger kiểm tra số thông tin giao hàng của người dùng
DELIMITER //
CREATE TRIGGER KiemTraThongTinGiaoHang BEFORE INSERT ON ThongTinGiaoHang
FOR EACH ROW
BEGIN
    DECLARE SoThongTinGiaoHang INT;
    SELECT COUNT(*) INTO SoThongTinGiaoHang
    FROM ThongTinGiaoHang
    WHERE MaNguoiMua = NEW.MaNguoiMua;

    IF SoThongTinGiaoHang > 10 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Số lượng thông tin giao hàng người mua có thể lưu tối đa là 10.';
    END IF;
END; //
DELIMITER ;

-- Trigger kiểm tra số số lượng khuyến mãi trước khi sử dụng
DELIMITER //
CREATE TRIGGER KiemTraSoLuongKhuyenMai BEFORE INSERT ON SuDung
FOR EACH ROW
BEGIN
    DECLARE SoLuongKhuyenMai INT;
    SELECT SoLuong INTO SoLuongKhuyenMai
    FROM ChuongTrinhKhuyenMai
    WHERE MaKM = NEW.MaKM;
    
    IF SoLuongKhuyenMai <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Khuyến mãi này đã hết số lượng.';
    END IF;
END; //
DELIMITER ;

-- Trigger kiểm tra số lượng sản phẩm còn lại trong kho khi thêm vào giỏ hàng
DELIMITER //
CREATE TRIGGER KiemTraSoLuongSanPham BEFORE INSERT ON Chua
FOR EACH ROW
BEGIN
    DECLARE SoLuongSanPham INT;
    SELECT SoLuong INTO SoLuongSanPham
    FROM SanPham
    WHERE MaSanPham = NEW.MaSanPham;

    IF SoLuongSanPham < NEW.SoLuong THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Số lượng sản phẩm trong kho không đủ để thêm vào giỏ hàng.';
    END IF;
END; //
DELIMITER ;




-- ***** Kết thúc 1.1 ***** ---






-- ***** Bắt đầu 1.2.1 ***** ---


-- Thủ tục thêm dữ liệu vào bảng SanPham
DELIMITER //

CREATE PROCEDURE ThemSanPham(
    IN p_MoTa VARCHAR(255),
    IN p_Loai VARCHAR(100),
    IN p_TenSanPham VARCHAR(100),
    IN p_MaDanhMuc INT,
    IN p_MaCuaHang INT,
    IN p_SoLuong INT,
    IN p_Gia DECIMAL(18, 2)
)
BEGIN
    IF p_MoTa IS NULL OR p_MoTa = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Mô tả sản phẩm không được để trống.';
    END IF;

    IF p_Loai IS NULL OR p_Loai = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Loại sản phẩm không được để trống.';
    END IF;

    IF p_TenSanPham IS NULL OR p_TenSanPham = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Tên sản phẩm không được để trống.';
    END IF;

    IF p_SoLuong < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Số lượng sản phẩm không được nhỏ hơn 0.';
    END IF;

    
    IF p_Gia <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Giá sản phẩm phải lớn hơn 0.';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM DanhMuc WHERE MaDanhMuc = p_MaDanhMuc) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Mã danh mục không tồn tại.';
    END IF;

    IF NOT EXISTS (SELECT 1 FROM CuaHang WHERE MaCuaHang = p_MaCuaHang) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Mã cửa hàng không tồn tại.';
    END IF;


    IF EXISTS (SELECT 1 FROM SanPham WHERE TenSanPham = p_TenSanPham) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Sản phẩm đã tồn tại.';
    END IF;

    INSERT INTO SanPham (MoTa, Loai, TenSanPham, MaDanhMuc, MaCuaHang, SoLuong, Gia)
    VALUES (p_MoTa, p_Loai, p_TenSanPham, p_MaDanhMuc, p_MaCuaHang, p_SoLuong, p_Gia);
END //

DELIMITER ;



-- Thủ tục cập nhật dữ liệu vào bảng SanPham
DELIMITER //

CREATE PROCEDURE SuaSanPham(
    IN p_MaSanPham INT,
    IN p_MoTa VARCHAR(255),
    IN p_Loai VARCHAR(100),
    IN p_TenSanPham VARCHAR(100),
    IN p_MaDanhMuc INT,
    IN p_MaCuaHang INT,
    IN p_SoLuong INT,
    IN p_Gia DECIMAL(18, 2)
)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM SanPham WHERE MaSanPham = p_MaSanPham) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Sản phẩm không tồn tại.';
    END IF;

    IF p_TenSanPham IS NULL OR p_TenSanPham = '' THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Tên sản phẩm không được để trống.';
    END IF;

    IF p_SoLuong < 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Số lượng sản phẩm không được nhỏ hơn 0.';
    END IF;

    IF p_Gia <= 0 THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Giá sản phẩm phải lớn hơn 0.';
    END IF;

    UPDATE SanPham
    SET MoTa = p_MoTa, Loai = p_Loai, TenSanPham = p_TenSanPham, 
        MaDanhMuc = p_MaDanhMuc, MaCuaHang = p_MaCuaHang, 
        SoLuong = p_SoLuong, Gia = p_Gia
    WHERE MaSanPham = p_MaSanPham;
END //

DELIMITER ;

-- Thủ tục xoá dữ liệu trên bảng SanPham
DELIMITER //

CREATE PROCEDURE XoaSanPham(IN p_MaSanPham INT)
BEGIN
    IF NOT EXISTS (SELECT 1 FROM SanPham WHERE MaSanPham = p_MaSanPham) THEN
        SIGNAL SQLSTATE '45000'
        SET MESSAGE_TEXT = 'Sản phẩm không tồn tại.';
    END IF;

    DELETE FROM SanPham WHERE MaSanPham = p_MaSanPham;
END //

DELIMITER ;



-- ***** Kết thúc 1.2.1 ***** ---





-- ***** Bắt đầu 1.2.2 ***** ---

-- Trigger dùng để tính toán tổng giá trị đơn hàng nằm trong bảng hóa đơn
DROP TRIGGER if exists tinhtonggiatri;
DELIMITER //
CREATE TRIGGER tinhtonggiatri AFTER INSERT ON co
FOR EACH ROW BEGIN
	UPDATE hoadon
	SET TongGiaTri = TongGiaTri + (SELECT gia FROM sanpham WHERE new.MaSanPham = sanpham.MaSanPham)
											* NEW.SoLuong
							where hoadon.MaDonHang = NEW.MaDonHang;
	-- cập nhật số lượng
    UPDATE sanpham SET sanpham.SoLuong = sanpham.SoLuong - NEW.SoLuong
    WHERE NEW.MaSanPham = sanpham.MaSanPham;
END; //
DELIMITER ;
                            
DROP TRIGGER if exists tinhhieugiatri;
DELIMITER //
CREATE TRIGGER tinhhieugiatri BEFORE DELETE ON co
FOR EACH ROW 
	BEGIN
		UPDATE hoadon SET TongGiaTri = TongGiaTri - (SELECT gia FROM sanpham
																WHERE
                                                                 -- OLD.MaSanPham = sanpham.MaSanPham AND
                                                                 sanpham.MaSanPham = OLD.MaSanPham)
											* OLD.SoLuong
							where hoadon.MaDonHang = OLD.MaDonHang;
		-- UPDATE hoadon SET TongGiaTri = 0 WHERE hoadon.TongGiaTri < 0;
		UPDATE sanpham SET sanpham.SoLuong = sanpham.SoLuong + OLD.SoLuong
        WHERE OLD.MaSanPham = sanpham.MaSanPham;
	END; //
DELIMITER ;

-- Trigger tính toán gia tien giam gia
DROP TRIGGER IF EXISTS tinhGiamGia;
DELIMITER //
CREATE trigger tinhGiamGia BEFORE INSERT ON giamgia
FOR EACH ROW BEGIN
		SET NEW.TongGTDon = ((SELECT TongGiaTri FROM hoadon
						WHERE hoadon.MaDonHang = NEW.MaDonHang) 
                        * (1 - (SELECT TyLeGiam from chuongtrinhkhuyenmai
								WHERE chuongtrinhkhuyenmai.MaKM = NEW.MaKM)));
		UPDATE hoadon set hoadon.TongGiaTri = NEW.TongGTDon 
        WHERE hoadon.MaDonHang = NEW.MaDonHang;
        -- update soluong chương trình khuyến mãi
        UPDATE chuongtrinhkhuyenmai SET chuongtrinhkhuyenmai.SoLuong = chuongtrinhkhuyenmai.SoLuong - 1
        WHERE NEW.MaKM = chuongtrinhkhuyenmai.MaKM;
	
END; //
DELIMITER ;


-- ***** Kết thúc 1.2.2 ***** ---




-- ***** Bắt đầu 1.2.3 ***** ---

-- truy xuất tên người mua, tên sản phẩm, mã sản phẩm, loại sản phẩm và số lượng của từng sản phẩm hiện có 
-- trong đơn hàng của từng người mua
DROP PROCEDURE IF EXISTS hienThiDonHang;
DELIMITER //
CREATE PROCEDURE hienThiDonHang(IN idNguoiMua varchar(12))
BEGIN 
	SELECT nguoimua.MaNguoiMua, HoTen, co.MaSanPham, sanpham.TenSanPham, Loai, co.SoLuong, sanpham.Gia AS DonGia
	FROM sanpham, co, donhang, nguoidung, nguoimua
	WHERE donhang.MaDonHang = co.MaDonHang AND co.MaSanPham = sanpham.MaSanPham
		AND donhang.MaNguoiMua = idNguoiMua AND donhang.MaNguoiMua = nguoimua.MaNguoiMua 
        AND nguoimua.MaNguoiMua = nguoidung.CCCD
	ORDER BY TenSanPham asc;
END //
DELIMITER ;

-- với từng sản phẩm, thống kê tổng số lượng đơn hàng, tổng giá trị đơn hàng trong ngày
--  đối với từng sản phẩm trong một ngày bất kỳ
DROP PROCEDURE IF EXISTS SoNguoiMua;
DELIMITER //
CREATE PROCEDURE SoNguoiMua (IN ngay TIMESTAMP)
BEGIN
    SELECT 
        sanpham.MaSanPham,   
        sanpham.TenSanPham, 
        COUNT(donhang.MaDonHang) AS SoDonHang, 
        COUNT(co.SoLuong) AS TongSoLuong, 
        SUM(TongGiaTri) AS TongGiaTri
    FROM sanpham, donhang, hoadon, co, cuahang
    WHERE donhang.NgayDat = ngay 
        AND donhang.MaDonHang = co.MaDonHang 
        AND co.MaSanPham = sanpham.MaSanPham
        AND hoadon.MaDonHang = donhang.MaDonHang 
        AND cuahang.MaCuaHang = sanpham.MaCuaHang
    GROUP BY sanpham.MaSanPham, sanpham.TenSanPham;
END //
DELIMITER ;


DROP PROCEDURE IF EXISTS hienThiHoaDon;
DELIMITER //

CREATE PROCEDURE hienThiHoaDon()
BEGIN
    SELECT 
        donhang.MaDonHang, 
        nguoidung.HoTen AS TenNguoiMua,  
        hoadon.TongGiaTri AS tienHang, 
        COALESCE(dathang.PhiVanChuyen, 0) AS PhiVanChuyen,  
        hoadon.TongGiaTri + COALESCE(dathang.PhiVanChuyen, 0) AS tongGTDon,
        donhang.NgayDat,
        donhang.PTThanhToan,
        donhang.TTThanhToan,
        donhang.TTDonHang
      
    FROM 
        donhang 
    JOIN 
        nguoidung ON donhang.MaNguoiMua = nguoidung.CCCD  
    JOIN 
        hoadon ON hoadon.MaDonHang = donhang.MaDonHang
    JOIN
        co ON co.MaDonHang = donhang.MaDonHang
    JOIN
        sanpham ON sanpham.MaSanPham = co.MaSanPham
    LEFT JOIN 
        dathang ON dathang.MaDonHang = donhang.MaDonHang
    GROUP BY
        donhang.MaDonHang, nguoidung.HoTen, hoadon.TongGiaTri, dathang.PhiVanChuyen, 
        donhang.NgayDat, donhang.PTThanhToan, donhang.TTThanhToan, donhang.TTDonHang;
END //

DELIMITER ;

-- ***** Kết thúc 1.2.3 ***** ---




-- ***** Bắt đầu 1.2.4 ***** ---
DELIMITER //
CREATE FUNCTION TinhSoLuongSanPhamDaBan(MaNguoiBan VARCHAR(12))
RETURNS INT
DETERMINISTIC
BEGIN
    DECLARE SoLuongDaBan INT DEFAULT 0;
    DECLARE SoLuongSanPham INT;
    DECLARE done INT DEFAULT 0;
    DECLARE cur CURSOR FOR 
        SELECT c.SoLuong
        FROM Co c
        JOIN SanPham sp ON c.MaSanPham = sp.MaSanPham
        JOIN CuaHang ch ON sp.MaCuaHang = ch.MaCuaHang
        WHERE ch.MaNguoiBan = MaNguoiBan;
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO SoLuongSanPham;
        IF done THEN
            LEAVE read_loop;
        END IF;
        SET SoLuongDaBan = SoLuongDaBan + SoLuongSanPham;
    END LOOP;
    CLOSE cur;
    RETURN SoLuongDaBan;
END //
DELIMITER ;


-- tính số sao trung bình của 1 cửa hàng
DELIMITER $$
CREATE FUNCTION TinhDiemTrungBinhCuaHang(MaCuaHang VARCHAR(12)) 
RETURNS DECIMAL(10,2)
DETERMINISTIC
BEGIN
    DECLARE SoLuongSanPham INT DEFAULT 0;
    DECLARE TongDiemDanhGia DECIMAL(10,2) DEFAULT 0;
    DECLARE DiemTrungBinh DECIMAL(10,2) DEFAULT NULL;
    DECLARE done INT DEFAULT 0;
    DECLARE cur CURSOR FOR 
        SELECT b.SoSao
        FROM SanPham s
        LEFT JOIN DanhGia d ON s.MaSanPham = d.MaSanPham
        LEFT JOIN BaiDanhGia b ON d.MaBai = b.MaBai
        WHERE s.MaCuaHang = MaCuaHang
        AND d.MaBai IS NOT NULL;  
    DECLARE CONTINUE HANDLER FOR NOT FOUND SET done = 1;
    OPEN cur;
    read_loop: LOOP
        FETCH cur INTO DiemTrungBinh;
        IF done THEN
            LEAVE read_loop;
        END IF;
        SET TongDiemDanhGia = TongDiemDanhGia + DiemTrungBinh;
        SET SoLuongSanPham = SoLuongSanPham + 1;
    END LOOP;
    CLOSE cur;
    IF SoLuongSanPham > 0 THEN
        RETURN TongDiemDanhGia / SoLuongSanPham;
    ELSE
        RETURN NULL; 
    END IF;
END $$
DELIMITER ;



DELIMITER //
CREATE PROCEDURE LayDanhSachCuaHangVaSoSao()
BEGIN
    SELECT 
        c.MaCuaHang,
        c.TenCuaHang,
        COALESCE(CAST(TinhDiemTrungBinhCuaHang(c.MaCuaHang) AS CHAR), 'Chưa có đánh giá') AS SoSaoTrungBinh,
        nd.HoTen AS TenNguoiBan
    FROM CuaHang c
    JOIN NguoiBan nb ON c.MaNguoiBan = nb.MaNguoiBan
    JOIN NguoiDung nd ON nb.MaNguoiBan = nd.CCCD;
END //
DELIMITER ;


--THỦ TỤC LẤY CHI TIET SẢN PHẨM ĐÃ BÁN
DELIMITER //
CREATE PROCEDURE LayChiTietSanPhamDaBan(MaNguoiBan VARCHAR(12))
BEGIN
    SELECT sp.TenSanPham, c.SoLuong, sp.Gia, ch.TenCuaHang
    FROM Co c
    JOIN SanPham sp ON c.MaSanPham = sp.MaSanPham
    JOIN CuaHang ch ON sp.MaCuaHang = ch.MaCuaHang
    WHERE ch.MaNguoiBan = MaNguoiBan;
END //
DELIMITER ;



-- ***** Kết thúc 1.2.4 ***** ---









-- Dữ liệu mẫu cho bảng NguoiDung
INSERT INTO NguoiDung (CCCD, MatKhau, Email, HoTen, SDT) VALUES
-- Người mua
('001062946357', '$2y$10$O5iit7HS7r3xemxSFW2gBuDPnQcgnVShE6BLjcIyn4DCBPE.48ejy', 'a@gmail.com', 'Nguyễn Văn A', '0912345678'),
('066200000274', '$2y$10$O5iit7HS7r3xemxSFW2gBuDPnQcgnVShE6BLjcIyn4DCBPE.48ejy', 'vunguyen@gmail.com', 'Nguyễn Minh Vũ', '0934127856'),
('037962011863', '$2y$10$O5iit7HS7r3xemxSFW2gBuDPnQcgnVShE6BLjcIyn4DCBPE.48ejy', 'congthanh2002@gmail.com', 'Nguyễn Thành Công', '0914723685'),
('011167000556', '$2y$10$O5iit7HS7r3xemxSFW2gBuDPnQcgnVShE6BLjcIyn4DCBPE.48ejy', 'bagiang147@gmail.com', 'Giảng Thị Bà', '0918324657'),
('012345678911', '$2y$10$O5iit7HS7r3xemxSFW2gBuDPnQcgnVShE6BLjcIyn4DCBPE.48ejy', 'hueto123@gmail.com', 'Tô Văn Huệ', '0912345687'),
('083204000946', '$2y$10$O5iit7HS7r3xemxSFW2gBuDPnQcgnVShE6BLjcIyn4DCBPE.48ejy', 'thinh.nguyen04@hcmut.edu.vn', 'Nguyễn Trường Thịnh', '0838592692'),

-- Người bán
('083811234432', '$2y$10$O5iit7HS7r3xemxSFW2gBuDPnQcgnVShE6BLjcIyn4DCBPE.48ejy', 'truongthinhbte@gmail.com.vn', 'Nguyễn Ngọc Thịnh', '0918382947'),
('032532297682', '$2y$10$O5iit7HS7r3xemxSFW2gBuDPnQcgnVShE6BLjcIyn4DCBPE.48ejy', 'b@gmail.com', 'Tran Thi B', '0923456789'),
('038180000947', '$2y$10$O5iit7HS7r3xemxSFW2gBuDPnQcgnVShE6BLjcIyn4DCBPE.48ejy', 'liemphan@gmail.com', 'Phan Thị Liêm', '0945680888'),
('001062946358', '$2y$10$O5iit7HS7r3xemxSFW2gBuDPnQcgnVShE6BLjcIyn4DCBPE.48ejy', 'tranthib@gmail.com', 'Trần Thị Bình', '0917654321'),
('001062946359', '$2y$10$O5iit7HS7r3xemxSFW2gBuDPnQcgnVShE6BLjcIyn4DCBPE.48ejy', 'leminhc@gmail.com', 'Lê Minh Châu', '0981234567'),
('001062946360', '$2y$10$O5iit7HS7r3xemxSFW2gBuDPnQcgnVShE6BLjcIyn4DCBPE.48ejy', 'phamvuongd@gmail.com', 'Phạm Vương Dũng', '0938765432'),
('001062946361', '$2y$10$O5iit7HS7r3xemxSFW2gBuDPnQcgnVShE6BLjcIyn4DCBPE.48ejy', 'hoanghonganh@gmail.com', 'Hoàng Hồng Anh', '0975432198'),
('001062946362', '$2y$10$O5iit7HS7r3xemxSFW2gBuDPnQcgnVShE6BLjcIyn4DCBPE.48ejy', 'danghuuthang@gmail.com', 'Đặng Hữu Thắng', '0923456781'),
('001062946363', '$2y$10$O5iit7HS7r3xemxSFW2gBuDPnQcgnVShE6BLjcIyn4DCBPE.48ejy', 'vothituyet@gmail.com', 'Võ Thị Tuyết', '0945678912'),
('001062946364', '$2y$10$O5iit7HS7r3xemxSFW2gBuDPnQcgnVShE6BLjcIyn4DCBPE.48ejy', 'dongthanhdat@gmail.com', 'Đồng Thành Đạt', '0967891234'),

-- Admin
('111122223333', '$2y$10$O5iit7HS7r3xemxSFW2gBuDPnQcgnVShE6BLjcIyn4DCBPE.48ejy', 'admin@gmail.com', 'Admin', '0753826373');

-- Dữ liệu mẫu cho bảng Người mua
INSERT INTO NguoiMua (MaNguoiMua, NgaySinh) VALUES
('001062946357', '2000-05-20'),
('066200000274', '2004-02-29'),
('037962011863', '2005-01-01'),
('011167000556', '2008-06-15'),
('012345678911', '2009-04-24'),
('083204000946', '2003-10-10');

-- Dữ liệu mẫu cho bảng Người bán
INSERT INTO NguoiBan (MaNguoiBan, NgaySinh) VALUES
('083811234432', '2004-09-30'),
('032532297682', '1979-08-24'),
('038180000947', '1979-11-25'),
('001062946358', '1980-01-15'),
('001062946359', '1981-06-12'),
('001062946360', '1982-03-08'),
('001062946361', '1983-07-19'),
('001062946362', '1984-10-22'),
('001062946363', '1985-05-11'),
('001062946364', '1986-12-05');

-- Dữ liệu mẫu cho bảng Admin
INSERT INTO Admin (MaAdmin) VALUES
('111122223333');

-- Dữ liệu mẫu cho bảng Danh mục
INSERT INTO DanhMuc (TenDanhMuc, MoTa, ThuTuHienThi) VALUES
('Thời trang', 'Thời trang dành cho nam và nữ', 1),
('Thiết bị điện tử', 'Các thiết bị điện tử như điện thoại, laptop, TV và phụ kiện', 2),
('Đồ gia dụng', 'Các sản phẩm gia dụng tiện ích', 3),
('Sách', 'Sách học tập, truyện và văn học', 4),
('Đồ chơi trẻ em', 'Đồ chơi và thiết bị giáo dục trẻ em', 5),
('Thực phẩm', 'Thực phẩm sạch và đồ khô', 6),
('Đồ thể thao', 'Dụng cụ và trang phục thể thao', 7),
('Mỹ phẩm', 'Mỹ phẩm và sản phẩm chăm sóc cá nhân', 8),
('Văn phòng phẩm', 'Dụng cụ học tập và văn phòng', 9),
('Đồ dùng du lịch', 'Balo, vali và dụng cụ du lịch', 10);



-- Dữ liệu mẫu cho bảng Cửa hàng
INSERT INTO CuaHang (DiaChi, MoTa, TenCuaHang, MaNguoiBan) VALUES
('123 Lê Lợi, Quận 1, TP.HCM', 'Chuyên bán thời trang nam nữ cao cấp', 'Thời Trang Luxury', '083811234432'),
('456 Nguyễn Trãi, Quận 5, TP.HCM', 'Cửa hàng thiết bị điện tử uy tín', 'TechZone', '032532297682'),
('789 Điện Biên Phủ, Quận 10, TP.HCM', 'Đồ gia dụng thông minh và tiết kiệm', 'HomeSmart', '038180000947'),
('12 Trần Hưng Đạo, Quận 1, TP.HCM', 'Hiệu sách với hàng ngàn đầu sách hấp dẫn', 'Book Haven', '001062946358'),
('34 Phan Xích Long, Quận Phú Nhuận, TP.HCM', 'Đồ chơi giáo dục và sáng tạo cho trẻ em', 'Kiddo World', '001062946359'),
('56 Võ Văn Tần, Quận 3, TP.HCM', 'Thực phẩm hữu cơ và đồ khô', 'Organic Mart', '001062946360'),
('78 Lý Thường Kiệt, Quận Tân Bình, TP.HCM', 'Cửa hàng dụng cụ thể thao', 'Sporty Life', '001062946361'),
('90 Nguyễn Đình Chiểu, Quận 3, TP.HCM', 'Mỹ phẩm và sản phẩm chăm sóc da', 'Beauty Corner', '001062946362'),
('101 Pasteur, Quận 1, TP.HCM', 'Dụng cụ văn phòng phẩm và quà lưu niệm', 'Office & More', '001062946363'),
('202 Hai Bà Trưng, Quận 1, TP.HCM', 'Cửa hàng chuyên dụng cụ du lịch và balo', 'Travel Gear', '001062946364');


-- Dữ liệu mẫu cho bảng Sản phẩm
INSERT INTO SanPham (MoTa, Loai, TenSanPham, MaDanhMuc, MaCuaHang, SoLuong, Gia) VALUES
-- Cửa hàng 1: Thời Trang Luxury
('Vải cotton cao cấp, thoáng mát', 'Áo', 'Áo sơ mi công sở nam', 1, 1, 50, 350000),
('Vải co giãn 4 chiều', 'Áo', 'Áo thun nữ cổ tròn', 1, 1, 100, 250000),
('Chất liệu kaki', 'Quần', 'Quần short nam thời trang', 1, 1, 60, 200000),
('Vải mềm mịn, dễ giặt', 'Quần', 'Quần tây nữ công sở', 1, 1, 40, 450000),
('Form rộng, thiết kế hiện đại', 'Áo', 'Áo hoodie unisex', 1, 1, 80, 500000),

-- Cửa hàng 2: TechZone
('Màn hình OLED 6.5 inch', 'Điện thoại', 'iPhone 14 Pro Max', 2, 2, 30, 30000000),
('CPU Intel Core i5, RAM 8GB', 'Laptop', 'Dell Inspiron 15', 2, 2, 15, 20000000),
('Độ phân giải 4K, 43 inch', 'TV', 'Samsung Smart TV', 2, 2, 10, 15000000),
('Switch cơ học, đèn RGB', 'Phụ kiện', 'Bàn phím Logitech G Pro', 2, 2, 50, 2500000),
('Cảm biến quang học, 6 nút', 'Phụ kiện', 'Chuột không dây Logitech MX Anywhere', 2, 2, 70, 1200000),

-- Cửa hàng 3: HomeSmart
('Dung tích 1.5L, công suất 500W', 'Gia dụng', 'Máy xay sinh tố Philips', 3, 3, 20, 850000),
('Tủ lạnh dung tích 50L, tiết kiệm điện', 'Gia dụng', 'Tủ lạnh mini Electrolux', 3, 3, 10, 3200000),
('Công nghệ Rapid Air, dung tích 5L', 'Gia dụng', 'Nồi chiên không dầu Lock&Lock', 3, 3, 15, 2500000),
('Bề mặt kính chịu lực, công suất 2000W', 'Gia dụng', 'Bếp từ đơn Sunhouse', 3, 3, 25, 1200000),
('Động cơ mạnh mẽ, pin sạc', 'Gia dụng', 'Máy hút bụi cầm tay Xiaomi', 3, 3, 30, 1500000),

-- Cửa hàng 4: Book Haven
('Tiểu thuyết giả tưởng, 7 tập', 'Sách', 'Harry Potter Bộ Đầy Đủ', 4, 4, 100, 850000),
('Sách kỹ năng giao tiếp', 'Sách', 'Đắc Nhân Tâm', 4, 4, 80, 150000),
('Sách tham khảo toán học lớp 10', 'Sách', 'Tuyển tập bài tập Toán lớp 10', 4, 4, 150, 95000),
('Truyện tranh thiếu nhi', 'Sách', 'Doraemon Tập 1', 4, 4, 200, 30000),
('Sách học từ vựng và ngữ pháp', 'Sách', 'Oxford Advanced Learner Dictionary', 4, 4, 50, 350000),

-- Cửa hàng 5: Kiddo World
('Bộ lắp ráp chi tiết lớn', 'Đồ chơi', 'Lego Classic Basic', 5, 5, 60, 400000),
('Đồ chơi giáo dục thông minh', 'Đồ chơi', 'Bộ ghép hình số học trẻ em', 5, 5, 50, 250000),
('Chất liệu gỗ tự nhiên', 'Đồ chơi', 'Bộ xếp hình chữ cái', 5, 5, 40, 200000),
('Xe hơi điều khiển từ xa', 'Đồ chơi', 'Ô tô RC tốc độ cao', 5, 5, 30, 450000),
('Búp bê thời trang', 'Đồ chơi', 'Búp bê Barbie', 5, 5, 70, 300000),

-- Cửa hàng 6: Organic Mart
('Sản phẩm hữu cơ, tươi ngon', 'Thực phẩm', 'Rau củ hữu cơ', 6, 6, 200, 30000),
('Sản phẩm 100% tự nhiên', 'Thực phẩm', 'Gạo lứt hữu cơ', 6, 6, 150, 45000),
('Không chất bảo quản', 'Thực phẩm', 'Trái cây tươi', 6, 6, 180, 70000),
('Sản phẩm chế biến sẵn, dễ sử dụng', 'Thực phẩm', 'Mì ăn liền hữu cơ', 6, 6, 250, 15000),
('Cung cấp năng lượng tự nhiên', 'Thực phẩm', 'Hạt chia hữu cơ', 6, 6, 100, 180000),

-- Cửa hàng 7: Sporty Life
('Chất liệu thoáng khí, dễ dàng di chuyển', 'Dụng cụ thể thao', 'Giày thể thao nam', 7, 7, 120, 600000),
('Chất liệu bền, chống nước', 'Dụng cụ thể thao', 'Balo thể thao', 7, 7, 90, 350000),
('Vật liệu siêu nhẹ, thoải mái sử dụng', 'Dụng cụ thể thao', 'Dây nhảy tập thể dục', 7, 7, 150, 150000),
('Chống sốc, dễ dàng mang theo', 'Dụng cụ thể thao', 'Gậy golf nữ', 7, 7, 50, 1500000),
('Dễ dàng sử dụng, nhỏ gọn', 'Dụng cụ thể thao', 'Máy chạy bộ điện', 7, 7, 30, 5000000),

-- Cửa hàng 8: Beauty Corner
('Chất liệu tự nhiên, dưỡng ẩm', 'Mỹ phẩm', 'Kem dưỡng da ban đêm', 8, 8, 100, 350000),
('Sản phẩm chống lão hóa', 'Mỹ phẩm', 'Serum Vitamin C', 8, 8, 80, 550000),
('Bảng màu phong phú, lâu trôi', 'Mỹ phẩm', 'Son môi matte', 8, 8, 120, 200000),
('Chống nắng cao, bảo vệ da', 'Mỹ phẩm', 'Kem chống nắng SPF 50', 8, 8, 150, 250000),
('Làm sạch sâu, không gây khô da', 'Mỹ phẩm', 'Sữa rửa mặt dành cho da nhạy cảm', 8, 8, 90, 180000),

-- Cửa hàng 9: Office & More
('Dễ sử dụng, bền bỉ', 'Văn phòng phẩm', 'Bút bi gel', 9, 9, 200, 10000),
('Giúp làm việc nhanh chóng', 'Văn phòng phẩm', 'Bút marker', 9, 9, 150, 20000),
('Kích thước chuẩn, dễ sử dụng', 'Văn phòng phẩm', 'Giấy A4', 9, 9, 500, 50000),
('Chất liệu bền, chịu lực tốt', 'Văn phòng phẩm', 'Bìa hồ sơ', 9, 9, 120, 25000),
('Tổ chức sắp xếp công việc hiệu quả', 'Văn phòng phẩm', 'Lịch bàn', 9, 9, 80, 70000),

-- Cửa hàng 10: Travel Gear
('Chất liệu chống thấm nước', 'Đồ dùng du lịch', 'Balo du lịch', 10, 10, 100, 600000),
('Thiết kế chắc chắn, dễ mang theo', 'Đồ dùng du lịch', 'Vali kéo', 10, 10, 80, 1200000),
('Kích thước nhỏ gọn, tiện lợi', 'Đồ dùng du lịch', 'Túi ngủ', 10, 10, 50, 350000),
('Đặc biệt dành cho đi phượt', 'Đồ dùng du lịch', 'Lều cắm trại', 10, 10, 40, 900000),
('Chất liệu bền, dễ lau chùi', 'Đồ dùng du lịch', 'Túi đựng đồ dùng cá nhân', 10, 10, 150, 250000);



-- Dữ liệu mẫu cho bảng Giỏ hàng
INSERT INTO GioHang (MaNguoiMua) VALUES
('001062946357'),
('066200000274'),
('037962011863'),
('011167000556'),
('012345678911'),
('083204000946');

-- Dữ liệu mẫu cho bảng Chứa
INSERT INTO Chua (MaGioHang, MaSanPham, SoLuong) VALUES
(1, 1, 2),
(1, 2, 1),
(2, 3, 5),
(2, 6, 7),
(3, 1, 5),
(4, 3, 1),
(4, 2, 2),
(4, 16, 1),
(6, 3, 4),
(6, 10, 2),
(1, 11, 5),
(2, 8, 2),
(3, 3, 5),
(1, 3, 2),
(2, 4, 1),
(3, 6, 8),
(4, 1, 10);

-- Dữ liệu mẫu cho bảng Đơn hàng
INSERT INTO DonHang (NgayDat, PTThanhToan, MaNguoiMua) VALUES
('2024-11-15', 'Chuyển khoản', '001062946357'),
('2024-12-08', 'Chuyển khoản', '001062946357'),
('2024-11-10', 'Tiền mặt', '037962011863'),
('2024-11-10', 'Tiền mặt', '037962011863'),
('2024-12-07', 'Chuyển khoản', '066200000274'),
('2024-12-07', 'Tiền mặt', '066200000274'),
('2024-12-06', 'Chuyển khoản', '012345678911'),
('2024-12-08', 'Tiền mặt', '012345678911'),
('2024-12-05', 'Chuyển khoản', '083204000946'),
('2024-12-06', 'Chuyển khoản', '083204000946'),
('2024-12-07', 'Chuyển khoản', '011167000556'),
('2024-12-08', 'Chuyển khoản', '011167000556');

-- Dữ liệu mẫu cho bảng Hóa đơn
INSERT INTO HoaDon (ThoiGianTao, TongGiaTri, MaDonHang) VALUES
('2024-11-15 08:08:08', 1215000, 1),
('2024-12-08 09:09:09', 1000000000, 2),
('2024-11-10 10:10:10', 3200000, 3),
('2024-11-10 10:10:10', 1135000, 4),
('2024-12-07 10:10:10', 650000, 5),
('2024-12-07 10:10:10', 85000, 6),
('2024-12-06 10:10:10', 3350000, 7),
('2024-12-08 10:10:10', 550000, 8),
('2024-12-05 10:10:10', 45000, 9),
('2024-12-06 10:10:10', 3900000, 10),
('2024-12-07 10:10:10', 20000000, 11),
('2024-12-08 10:10:10', 1000000, 12);

-- Dữ liệu mẫu cho Thông tin thanh toán
INSERT INTO ThongTinThanhToan (MaNguoiMua, Loai, SoTaiKhoan) VALUES
('001062946357', 'Ngân hàng', '012345678901'),
('037962011863', 'Ngân hàng', '099977898821'),
('066200000274', 'MoMo', 'eWallet123'),
('012345678911', 'MoMo', 'eWallet123'),
('083204000946', 'Ngân hàng', '999009912021'),
('011167000556', 'Ngân hàng', '987654321098');

-- Dữ liệu mẫu cho Bài đánh giá
INSERT INTO BaiDanhGia (NgayTao, SoSao, NoiDung, MaNguoiMua) VALUES
('2024-11-15', 5, 'Sản phẩm tuyệt vời, chất lượng tốt!', '001062946357'),
('2024-11-10', 3, 'Sản phẩm ổn nhưng giao hàng chậm.', '037962011863'),
('2024-11-12', 4, 'Giá hợp lý, sẽ ủng hộ lần sau.', '066200000274');

-- Dữ liệu mẫu cho Đánh giá
INSERT INTO DanhGia (MaBai, MaSanPham, MaDonHang) VALUES
(1, 1, 1),
(2, 5, 1), 
(3, 6, 2);

-- Dữ liệu mẫu cho phương thức vận chuyển
INSERT INTO PhuongThucVanChuyen (Ten, MoTa) VALUES
('FastShip', 'Nhanh nhưng đắt'),
('Normal', 'Bình thường');

-- Dữ liệu mẫu cho Xuất hàng
INSERT INTO XuatHang (MaSanPham, MaNguoiBan, MaVanChuyen) VALUES 
(1, '083811234432', 1),
(5, '083811234432', 1),
(6, '032532297682', 2),
(7, '032532297682', 2),
(12, '038180000947', 1),
(16, '001062946358', 2),
(18, '001062946358', 2),
(22, '001062946359', 1),
(23, '001062946359', 1),
(28, '001062946360', 2),
(29, '001062946360', 2),
(32, '001062946361', 2),
(34, '001062946361', 2),
(36, '001062946362', 1),
(38, '001062946362', 1),
(41, '001062946363', 2),
(44, '001062946363', 2),
(46, '001062946364', 1),
(49, '001062946364', 1),
(6, '083811234432', 1),
(7, '083811234432', 1),
(16, '001062946358', 2),
(17, '001062946358', 2);

-- Dữ liệu mẫu cho thông tin giao hàng
INSERT INTO ThongTinGiaoHang (MaNguoiMua, TenNguoiNhan, SoDienThoai, Tinh) VALUES
('001062946357', 'Nguyễn Văn A', '0912345678', 'Thành phố Bình Dương'),
('037962011863', 'Nguyễn Thành Công', '0914723685', 'Thành phố Bến Tre'),
('066200000274', 'Nguyễn Minh Vũ', '0934127856', 'Thành phố Hồ Chí Minh'),
('011167000556', 'Giảng Thị Bà', '0918324657', 'Thành phố Hồ Chí Minh'),
('012345678911', 'Tô Văn Huệ', '0912345687', 'Thành phố Hồ Chí Minh'),
('083204000946', 'Nguyễn Trường Thịnh', '0838592692', 'Thành phố Hồ Chí Minh');

-- Dữ liệu mẫu cho có
INSERT INTO Co (MaDonHang, MaSanPham, SoLuong) VALUES
(1, 1, 1),
(1, 5, 2),
(2, 6, 2),
(2, 7, 3),
(3, 12, 1),
(4, 16, 1),
(4, 18, 3),
(5, 22, 1),
(5, 23, 2),
(6, 28, 1),
(6, 29, 1),
(7, 32, 1),
(7, 34, 2),
(8, 36, 1),
(8, 38, 1),
(9, 41, 2),
(9, 44, 1),
(10, 46, 2),
(10, 49, 3),
(11, 6, 1),
(11, 7, 1),
(12, 16, 1),
(12, 17, 1);

-- Dữ liệu mẫu cho chương trình khuyến mãi
INSERT INTO ChuongTrinhKhuyenMai (Ten, ThoiGianBD, ThoiGianKT, TyLeGiam, SoLuong) VALUES
('FlaseSale 10-10', '2024-10-10 00:00:00', '2024-10-11 00:00:00', 0.3, 50),
('FlaseSale 11-11', '2024-11-11 00:00:00', '2024-11-12 00:00:00', 0.1, 100),
('FlaseSale 12-12', '2024-12-12 00:00:00', '2024-12-13 00:00:00', 0.5, 150);

-- Dữ liệu mẫu cho đặt hàng
INSERT INTO DatHang (MaDonHang, MaVanChuyen, MaNguoiMua, PhiVanChuyen) VALUES 
(1, 1, '001062946357', 15000),
(2, 2, '066200000274', 15000),
(3, 2, '037962011863', 15000),
(4, 2, '011167000556', 15000),
(5, 1, '012345678911', 15000),
(6, 1, '083204000946', 15000);

-- Dữ liệu mẫu cho giảm giá
INSERT INTO GiamGia (MaDonHang, MaKM, TongGTDon) VALUES 
(1, 2, 1350000);

-- Dữ liệu mẫu cho sử dụng
INSERT INTO SuDung (MaKM, MaNguoiMua) VALUES 
(2, '001062946357');