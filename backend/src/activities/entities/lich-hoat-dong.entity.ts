import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { HoatDong } from './hoat-dong.entity';

export enum TrangThaiLich {
    HOAT_DONG = 'HOAT_DONG',
    DAY = 'DAY',
    HUY = 'HUY',
}

@Entity('lich_hoat_dong')
export class LichHoatDong {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    hoatDongId: number;

    @Column('date')
    ngay: Date;

    @Column('time')
    gioKhoiHanh: string;

    @Column({ default: 20 })
    soChoToiDa: number;

    @Column({ nullable: true })
    soChoConLai: number;

    @Column({
        type: 'enum',
        enum: TrangThaiLich,
        default: TrangThaiLich.HOAT_DONG,
    })
    trangThai: TrangThaiLich;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    @ManyToOne(() => HoatDong, hoatDong => hoatDong.lichTrinh, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'hoatDongId' })
    hoatDong: HoatDong;
}
