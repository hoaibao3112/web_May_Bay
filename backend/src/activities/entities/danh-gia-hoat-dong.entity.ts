import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { HoatDong } from './hoat-dong.entity';

export enum TrangThaiDanhGia {
    CHO_DUYET = 'CHO_DUYET',
    DA_DUYET = 'DA_DUYET',
    TU_CHOI = 'TU_CHOI',
}

@Entity('danh_gia_hoat_dong')
export class DanhGiaHoatDong {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    hoatDongId: number;

    @Column({ nullable: true })
    nguoiDungId: number;

    @Column({ nullable: true })
    datHoatDongId: number;

    @Column({ type: 'int' })
    diem: number; // 1-5

    @Column('text', { nullable: true })
    nhanXet: string;

    @Column('text', { nullable: true })
    hinhAnh: string;

    @Column('text', { nullable: true })
    phanHoi: string;

    @Column({ type: 'timestamp', nullable: true })
    thoiGianPhanHoi: Date;

    @Column({
        type: 'enum',
        enum: TrangThaiDanhGia,
        default: TrangThaiDanhGia.CHO_DUYET,
    })
    trangThai: TrangThaiDanhGia;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relation to HoatDong
    @ManyToOne(() => HoatDong, hoatDong => hoatDong.danhGia, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'hoatDongId' })
    hoatDong: HoatDong;
}
