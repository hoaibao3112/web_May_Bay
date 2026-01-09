import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn } from 'typeorm';
import { HoatDong } from './hoat-dong.entity';

@Entity('hinh_anh_hoat_dong')
export class HinhAnhHoatDong {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    hoatDongId: number;

    @Column('text')
    urlHinhAnh: string;

    @Column({ default: false })
    laTrangBia: boolean;

    @Column({ length: 255, nullable: true })
    moTa: string;

    @Column({ default: 0 })
    thuTu: number;

    @CreateDateColumn()
    created_at: Date;

    @ManyToOne(() => HoatDong, hoatDong => hoatDong.hinhAnh, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'hoatDongId' })
    hoatDong: HoatDong;
}
