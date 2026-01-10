import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum TrangThaiDatPhong {
    CHO_XAC_NHAN = 'CHO_XAC_NHAN',
    DA_XAC_NHAN = 'DA_XAC_NHAN',
    HOAN_THANH = 'HOAN_THANH',
    HUY = 'HUY',
    HOAN_TIEN = 'HOAN_TIEN',
}

export enum PhuongThucThanhToan {
    MOMO = 'MOMO',
    VIETQR = 'VIETQR',
    ZALOPAY = 'ZALOPAY',
    VNPAY = 'VNPAY',
}

@Entity('dat_khach_san')
export class DatKhachSan {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'ma_dat', unique: true, length: 50 })
    maDat: string;

    @Column({ name: 'khach_san_id' })
    khachSanId: number;

    @Column({ name: 'phong_id' })
    phongId: number;

    @Column({ name: 'ho_ten', length: 255 })
    hoTen: string;

    @Column({ length: 255 })
    email: string;

    @Column({ name: 'so_dien_thoai', length: 20 })
    soDienThoai: string;

    @Column({ name: 'ngay_nhan_phong', type: 'date' })
    ngayNhanPhong: Date;

    @Column({ name: 'ngay_tra_phong', type: 'date' })
    ngayTraPhong: Date;

    @Column({ name: 'so_dem' })
    soDem: number;

    @Column({ name: 'so_nguoi', default: 2 })
    soNguoi: number;

    @Column({ name: 'so_phong', default: 1 })
    soPhong: number;

    @Column({ name: 'tong_tien', type: 'decimal', precision: 12, scale: 2 })
    tongTien: number;

    @Column({
        name: 'phuong_thuc_thanh_toan',
        type: 'enum',
        enum: PhuongThucThanhToan,
        nullable: true,
    })
    phuongThucThanhToan: PhuongThucThanhToan;

    @Column({ name: 'da_thanh_toan', type: 'boolean', default: false })
    daThanhToan: boolean;

    @Column({
        name: 'trang_thai',
        type: 'enum',
        enum: TrangThaiDatPhong,
        default: TrangThaiDatPhong.CHO_XAC_NHAN,
    })
    trangThai: TrangThaiDatPhong;

    @Column({ name: 'ghi_chu', type: 'text', nullable: true })
    ghiChu: string;

    @Column({ name: 'nguoi_dung_id', nullable: true })
    nguoiDungId: number;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;

    // Relations can be added later if needed
    // @ManyToOne(() => KhachSan)
    // @JoinColumn({ name: 'khach_san_id' })
    // khachSan: KhachSan;

    // @ManyToOne(() => Phong)
    // @JoinColumn({ name: 'phong_id' })
    // phong: Phong;
}
