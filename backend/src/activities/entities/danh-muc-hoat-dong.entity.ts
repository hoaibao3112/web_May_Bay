import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

export enum TrangThaiDanhMuc {
    HOAT_DONG = 'HOAT_DONG',
    TAM_NGUNG = 'TAM_NGUNG',
}

@Entity('danh_muc_hoat_dong')
export class DanhMucHoatDong {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100 })
    tenDanhMuc: string;

    @Column('text', { nullable: true })
    moTa: string;

    @Column({ length: 50, nullable: true })
    icon: string;

    @Column({ default: 0 })
    thuTu: number;

    @Column({
        type: 'enum',
        enum: TrangThaiDanhMuc,
        default: TrangThaiDanhMuc.HOAT_DONG,
    })
    trangThai: TrangThaiDanhMuc;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}
