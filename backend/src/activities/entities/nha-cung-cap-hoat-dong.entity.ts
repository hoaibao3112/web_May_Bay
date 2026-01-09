import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TrangThaiNhaCungCap {
    HOAT_DONG = 'HOAT_DONG',
    TAM_NGUNG = 'TAM_NGUNG',
}

@Entity('nha_cung_cap_hoat_dong')
export class NhaCungCapHoatDong {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 50 })
    maNhaCungCap: string;

    @Column({ length: 200 })
    tenNhaCungCap: string;

    @Column('text', { nullable: true })
    logo: string;

    @Column({ length: 20, nullable: true })
    soDienThoai: string;

    @Column({ length: 100, nullable: true })
    email: string;

    @Column('text', { nullable: true })
    diaChi: string;

    @Column({ length: 255, nullable: true })
    website: string;

    @Column('decimal', { precision: 2, scale: 1, default: 0 })
    danhGiaTrungBinh: number;

    @Column({ default: 0 })
    soLuotDanhGia: number;

    @Column({
        type: 'enum',
        enum: TrangThaiNhaCungCap,
        default: TrangThaiNhaCungCap.HOAT_DONG,
    })
    trangThai: TrangThaiNhaCungCap;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
