import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { HoatDong } from './hoat-dong.entity';

@Entity('diem_noi_bat_hoat_dong')
export class DiemNoiBatHoatDong {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    hoatDongId: number;

    @Column({ length: 255 })
    noiDung: string;

    @Column({ length: 50, nullable: true })
    icon: string;

    @Column({ default: 0 })
    thuTu: number;

    @ManyToOne(() => HoatDong, hoatDong => hoatDong.diemNoiBat, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'hoatDongId' })
    hoatDong: HoatDong;
}
