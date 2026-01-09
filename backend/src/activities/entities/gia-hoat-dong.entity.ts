import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { HoatDong } from './hoat-dong.entity';

export enum LoaiKhach {
    NGUOI_LON = 'NGUOI_LON',
    TRE_EM = 'TRE_EM',
    SINH_VIEN = 'SINH_VIEN',
    NGUOI_CAO_TUOI = 'NGUOI_CAO_TUOI',
}

@Entity('gia_hoat_dong')
export class GiaHoatDong {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    hoatDongId: number;

    @Column({
        type: 'enum',
        enum: LoaiKhach,
    })
    loaiKhach: LoaiKhach;

    @Column('decimal', { precision: 10, scale: 2 })
    gia: number;

    @Column({ length: 255, nullable: true })
    moTa: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => HoatDong, hoatDong => hoatDong.bangGia, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'hoatDongId' })
    hoatDong: HoatDong;
}
