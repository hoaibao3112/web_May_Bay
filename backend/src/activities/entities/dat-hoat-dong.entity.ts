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
import { LichHoatDong } from './lich-hoat-dong.entity';

export enum TrangThaiDatCho {
    CHO_XAC_NHAN = 'CHO_XAC_NHAN',
    DA_XAC_NHAN = 'DA_XAC_NHAN',
    HOAN_THANH = 'HOAN_THANH',
    HUY = 'HUY',
    HOAN_TIEN = 'HOAN_TIEN',
}

@Entity('dat_hoat_dong')
export class DatHoatDong {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 50 })
    maDat: string;

    @Column({ nullable: true })
    nguoiDungId: number;

    @Column()
    hoatDongId: number;

    @Column({ nullable: true })
    lichHoatDongId: number;

    @Column({ type: 'date' })
    ngayThucHien: Date;

    @Column({ default: 1 })
    soNguoiLon: number;

    @Column({ default: 0 })
    soTreEm: number;

    @Column({ type: 'decimal', precision: 10, scale: 2 })
    tongTien: number;

    @Column({ length: 3, default: 'VND' })
    tienTe: string;

    @Column({ length: 100 })
    hoTen: string;

    @Column({ length: 100 })
    email: string;

    @Column({ length: 20 })
    soDienThoai: string;

    @Column({ type: 'text', nullable: true })
    ghiChu: string;

    @Column({
        type: 'enum',
        enum: TrangThaiDatCho,
        default: TrangThaiDatCho.CHO_XAC_NHAN,
    })
    trangThai: TrangThaiDatCho;

    @Column({ length: 50, nullable: true })
    phuongThucThanhToan: string;

    @Column({ type: 'boolean', default: false })
    daThanhToan: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @ManyToOne(() => HoatDong, { eager: true })
    @JoinColumn({ name: 'hoatDongId' })
    hoatDong: HoatDong;

    @ManyToOne(() => LichHoatDong, { nullable: true })
    @JoinColumn({ name: 'lichHoatDongId' })
    lichHoatDong: LichHoatDong;
}
