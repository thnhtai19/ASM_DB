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
    MaSanPham INT PRIMARY KEY,
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
CREATE PROCEDURE SoNguoiMua (IN ngay timestamp)
BEGIN
	SELECT TenSanPham, COUNT(donhang.MaDonHang) AS SoDonHang, COUNT(co.SoLuong) AS TongSoLuong, SUM(TongGiaTri) 
			AS TongGiaTri
    FROM sanpham, donhang, hoadon, co
    WHERE donhang.NgayDat = ngay AND donhang.MaDonHang = co.MaDonHang AND co.MaSanPham = sanpham.MaSanPham
		AND hoadon.MaDonHang = donhang.MaDonHang
	GROUP BY TenSanPham;
END; //
DELIMITER ;


-- ***** Kết thúc 1.2.3 ***** ---




-- ***** Bắt đầu 1.2.4 ***** ---

--Tính số lượng sản phẩm đã bán của người bán dựa vào mã.

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
        FROM Chua c
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




-- ***** Kết thúc 1.2.4 ***** ---









-- Dữ liệu mẫu cho bảng NguoiDung
INSERT INTO NguoiDung (CCCD, MatKhau, Email, HoTen, SDT) VALUES
('001062946357', 'Abc!1234', 'a@gmail.com', 'Nguyễn Văn A', '0912345678'),
('066200000274', '!23A56789l', 'vunguyen@gmail.com', 'Nguyễn Minh Vũ', '0934127856'),
('037962011863', '8888A#a8888', 'congthanh2002@gmail.com', 'Nguyễn Thành Công', '0914723685'),
('011167000556', '357%Adc357', 'bagiang147@gmail.com', 'Giảng Thị Bà', '0918324657'),
('012345678911', '110100Cd#', 'hueto123@gmail.com', 'Tô Văn Huệ', '0912345687'),
('083204000946', 'T123456@1t', 'thinh.nguyen04@hcmut.edu.vn', 'Nguyễn Trường Thịnh', '0838592692'),
('083811234432', 'Nopass0!', 'truongthinhbte@gmail.com.vn', 'Nguyễn Ngọc Thịnh', '0918382947'),
('032532297682', 'abcdef$123', 'b@gmail.com', 'Tran Thi B', '0923456789'),
('038180000947', '3434f^F3434', 'liemphan@gmail.com', 'Phan Thị Liêm', '0945680888'),
('111122223333', 'Cisco&packet0', 'admin@gmail.com', 'Admin', '0753826373');

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
('038180000947', '1979-11-25');

-- Dữ liệu mẫu cho bảng Admin
INSERT INTO Admin (MaAdmin) VALUES
('111122223333');

-- Dữ liệu mẫu cho bảng Danh mục
INSERT INTO DanhMuc (TenDanhMuc, MoTa, ThuTuHienThi) VALUES
('Giảm giá', 'Hàng hóa đang được giảm giá', 1),
('Nam', 'Thời trang cho nam', 2),
('Nữ', 'Thời trang cho nữ', 3);

-- Dữ liệu mẫu cho bảng Cửa hàng
INSERT INTO CuaHang (DiaChi, MoTa, TenCuaHang, MaNguoiBan) VALUES
('164C Đường Phan Đình Phùng', 'Chuyên bán quần áo thể thao', 'Shop X', '032532297682'),
('98 Đường Ngô Quyền', 'Chuyên bán quần áo và phụ kiện chi nữ', 'Shop Y', '083811234432'),
('38B Đường Hoa Lạc', 'Chuyên bán quần áo dạo phố', 'Shop Z', '038180000947');

-- Dữ liệu mẫu cho bảng Sản phẩm
INSERT INTO SanPham (MoTa, Loai, TenSanPham, MaDanhMuc, MaCuaHang, SoLuong, Gia) VALUES
('Vải cotton', 'Áo', 'Áo thun nam', 1, 1, 100, 200000),
('Dây nịt được làm 100% từ da cá sấu', 'Dây nịt', 'Dây nịt da cá sấu', 1, 1, 100, 1000000),
('Tinh xảo và đẳng cấp', 'dây chuyền', 'Dây chuyền nữ', 3, 2, 100, 35000000),
('Quần jeans co giãn', 'Quần', 'Quần jeans nữ', 3, 3, 500, 40000),
('Giày thể thao nam', 'Giày', 'Giày sneaker', 2, 1, 30, 1500000),
('Cá tính và sành điệu', 'Túi', 'Túi xách', 2, 3, 10, 2000000),
('Chất liệu polyester, chống thấm nước', 'Áo khoác', 'Áo khoác nam', 1, 1, 50, 500000),
('Thiết kế đơn giản, phong cách', 'Mũ', 'Mũ lưỡi trai', 1, 3, 200, 100000),
('Chất liệu cotton, thấm hút tốt', 'Quần', 'Quần short nam', 2, 1, 120, 250000),
('Thiết kế tinh tế, dành cho phái nữ', 'Khăn choàng', 'Khăn choàng lụa', 3, 3, 80, 300000),
('Được làm từ bạc cao cấp', 'Nhẫn', 'Nhẫn bạc nữ', 3, 2, 150, 500000),
('Phong cách thể thao, trẻ trung', 'Ba lô', 'Ba lô thời trang', 2, 3, 60, 800000),
('Chất liệu da tổng hợp, chống nước', 'Giày', 'Giày lười nam', 1, 1, 40, 1200000),
('Hợp thời trang, phù hợp đi làm', 'Túi', 'Cặp da công sở', 2, 1, 20, 2500000),
('Đồng hồ cơ, dây thép không gỉ', 'Đồng hồ', 'Đồng hồ nam', 1, 1, 30, 5000000),
('Dây chuyền vàng 18K', 'Dây chuyền', 'Dây chuyền vàng', 3, 2, 10, 15000000);

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
('2024-11-10', 'Tiền mặt', '037962011863'),
('2024-11-12', 'Chuyển khoản', '066200000274');

-- Dữ liệu mẫu cho bảng Hóa đơn
INSERT INTO HoaDon (ThoiGianTao, TongGiaTri, MaDonHang) VALUES
('2024-11-15 08:08:08', 100000, 1),
('2024-11-10 09:09:09', 200000, 2),
('2024-11-12 10:10:10', 300000, 3);

-- Dữ liệu mẫu cho Thông tin thanh toán
INSERT INTO ThongTinThanhToan (MaNguoiMua, Loai, SoTaiKhoan) VALUES
('001062946357', 'Ngân hàng', '012345678901'),
('037962011863', 'Tiền mặt', ''),
('066200000274', 'Ví điện tử', 'eWallet123'),
('012345678911', 'MoMo', 'eWallet123'),
('083204000946', 'Tiền mặt', ''),
('011167000556', 'Ngân hàng', '987654321098');

-- Dữ liệu mẫu cho Bài đánh giá
INSERT INTO BaiDanhGia (NgayTao, SoSao, NoiDung, MaNguoiMua) VALUES
('2024-11-15', 5, 'Sản phẩm tuyệt vời, chất lượng tốt!', '001062946357'),
('2024-11-10', 3, 'Sản phẩm ổn nhưng giao hàng chậm.', '037962011863'),
('2024-11-12', 4, 'Giá hợp lý, sẽ ủng hộ lần sau.', '066200000274');

-- Dữ liệu mẫu cho Đánh giá
INSERT INTO DanhGia (MaBai, MaSanPham, MaDonHang) VALUES
(1, 1, 1),
(2, 2, 2), 
(3, 3, 3);

-- Dữ liệu mẫu cho phương thức vận chuyển
INSERT INTO PhuongThucVanChuyen (Ten, MoTa) VALUES
('FastShip', 'Nhanh nhưng đắt'),
('Normal', 'Bình thường');

-- Dữ liệu mẫu cho Xuất hàng
INSERT INTO XuatHang (MaSanPham, MaNguoiBan, MaVanChuyen) VALUES 
(1, '083811234432', 1),
(2, '083811234432', 2),
(3, '083811234432', 1);

-- Dữ liệu mẫu cho thông tin giao hàng
INSERT INTO ThongTinGiaoHang (MaNguoiMua, TenNguoiNhan, SoDienThoai, Tinh) VALUES
('001062946357', 'Nguyễn Văn A', '0912345678', 'Thành phố Bình Dương'),
('037962011863', 'Nguyễn Thành Công', '0914723685', 'Thành phố Bến Tre'),
('066200000274', 'Nguyễn Minh Vũ', '0934127856', 'Thành phố Hồ Chí Minh');

-- Dữ liệu mẫu cho có
INSERT INTO Co (MaDonHang, MaSanPham, SoLuong) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3);

-- Dữ liệu mẫu cho chương trình khuyến mãi
INSERT INTO ChuongTrinhKhuyenMai (Ten, ThoiGianBD, ThoiGianKT, TyLeGiam, SoLuong) VALUES
('FlaseSale 10-10', '2024-10-10 00:00:00', '2024-10-11 00:00:00', 0.3, 50),
('FlaseSale 11-11', '2024-11-11 00:00:00', '2024-11-12 00:00:00', 0.4, 100),
('FlaseSale 12-12', '2024-12-12 00:00:00', '2024-12-13 00:00:00', 0.5, 150);

-- Dữ liệu mẫu cho đặt hàng
INSERT INTO DatHang (MaDonHang, MaVanChuyen, MaNguoiMua, PhiVanChuyen) VALUES 
(1, 1, '001062946357', 50),
(2, 2, '037962011863', 0),
(3, 1, '066200000274', 67);

-- Dữ liệu mẫu cho giảm giá
INSERT INTO GiamGia (MaDonHang, MaKM, TongGTDon) VALUES 
(1, 2, 50000);

-- Dữ liệu mẫu cho sử dụng
INSERT INTO SuDung (MaKM, MaNguoiMua) VALUES 
(2, '001062946357');