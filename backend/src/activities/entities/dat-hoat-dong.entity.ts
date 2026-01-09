import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { HoatDong } from './hoat-dong.entity';

export enum TrangThaiThanhToan {
    CHO_THANH_TOAN = 'CHO_THANH_TOAN',
    DA_THANH_TOAN = 'DA_THANH_TOAN',
    THAT_BAI = 'THAT_BAI',
    HUY = 'HUY',
}

export enum PhuongThucThanhToan {
    MOMO = 'MOMO',
    VIETQR = 'VIETQR',
    ZALOPAY = 'ZALOPAY',
    VNPAY = 'VNPAY',
}

@Entity('dat_hoat_dong')
export class DatHoatDong {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 50 })
    maDatCho: string;

    @Column()
    hoatDongId: number;

    // Thông tin khách hàng
    @Column({ length: 255 })
    hoTen: string;

    @Column({ length: 255 })
    email: string;

    @Column({ length: 20 })
    soDienThoai: string;

    // Chi tiết booking
    @Column({ type: 'date' })
    ngayThucHien: Date;

    @Column({ default: 1 })
    soNguoiLon: number;

    @Column({ default: 0 })
    soTreEm: number;

    // Thanh toán
    @Column({ type: 'decimal', precision: 12, scale: 2 })
    tongTien: number;

    @Column({
        type: 'enum',
        enum: PhuongThucThanhToan,
        nullable: true,
    })
    phuongThucThanhToan: PhuongThucThanhToan;

    @Column({
        type: 'enum',
        enum: TrangThaiThanhToan,
        default: TrangThaiThanhToan.CHO_THANH_TOAN,
    })
    trangThaiThanhToan: TrangThaiThanhToan;

    // Metadata
    @Column({ type: 'text', nullable: true })
    ghiChu: string;

    @Column({ nullable: true })
    nguoiDungId: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @ManyToOne(() => HoatDong, { eager: true })
    @JoinColumn({ name: 'hoatDongId' })
    hoatDong: HoatDong;
}
