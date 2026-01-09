import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, CreateDateColumn, UpdateDateColumn, JoinColumn } from 'typeorm';
import { HinhAnhHoatDong } from './hinh-anh-hoat-dong.entity';
import { GiaHoatDong } from './gia-hoat-dong.entity';
import { LichHoatDong } from './lich-hoat-dong.entity';
import { DiemNoiBatHoatDong } from './diem-noi-bat-hoat-dong.entity';
import { DanhGiaHoatDong } from './danh-gia-hoat-dong.entity';
import { DanhMucHoatDong } from './danh-muc-hoat-dong.entity';
import { NhaCungCapHoatDong } from './nha-cung-cap-hoat-dong.entity';

export enum TrangThaiHoatDong {
    HOAT_DONG = 'HOAT_DONG',
    TAM_NGUNG = 'TAM_NGUNG',
    HET_HANG = 'HET_HANG',
}

@Entity('hoat_dong')
export class HoatDong {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ unique: true, length: 50 })
    maHoatDong: string;

    @Column({ length: 255 })
    tenHoatDong: string;

    @Column('text', { nullable: true })
    moTaNgan: string;

    @Column('text', { nullable: true })
    moTaChiTiet: string;

    @Column()
    danhMucId: number;

    @Column()
    nhaCungCapId: number;

    @Column({ length: 255, nullable: true })
    diaDiem: string;

    @Column({ length: 100, nullable: true })
    thanhPho: string;

    @Column({ length: 100, default: 'Vietnam' })
    quocGia: string;

    @Column({ length: 100, nullable: true })
    thoiGianDienRa: string;

    @Column({ default: 20 })
    soLuongToiDa: number;

    @Column({ default: 0 })
    doTuoiToiThieu: number;

    @Column({ default: false })
    baoGomAnUong: boolean;

    @Column({ default: false })
    baoGomDuaDon: boolean;

    @Column({ default: true })
    huongDanVien: boolean;

    @Column('decimal', { precision: 10, scale: 2 })
    giaTuMoiNguoi: number;

    @Column({ length: 3, default: 'VND' })
    tienTe: string;

    @Column('decimal', { precision: 2, scale: 1, default: 0 })
    danhGiaTrungBinh: number;

    @Column({ default: 0 })
    soLuotDanhGia: number;

    @Column({ default: 0 })
    soLuotDat: number;

    @Column({
        type: 'enum',
        enum: TrangThaiHoatDong,
        default: TrangThaiHoatDong.HOAT_DONG,
    })
    trangThai: TrangThaiHoatDong;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    // Relations
    @ManyToOne(() => DanhMucHoatDong)
    @JoinColumn({ name: 'danhMucId' })
    danhMuc: DanhMucHoatDong;

    @ManyToOne(() => NhaCungCapHoatDong)
    @JoinColumn({ name: 'nhaCungCapId' })
    nhaCungCap: NhaCungCapHoatDong;

    @OneToMany(() => HinhAnhHoatDong, hinhAnh => hinhAnh.hoatDong)
    hinhAnh: HinhAnhHoatDong[];

    @OneToMany(() => GiaHoatDong, gia => gia.hoatDong)
    bangGia: GiaHoatDong[];

    @OneToMany(() => LichHoatDong, lich => lich.hoatDong)
    lichTrinh: LichHoatDong[];

    @OneToMany(() => DiemNoiBatHoatDong, diem => diem.hoatDong)
    diemNoiBat: DiemNoiBatHoatDong[];

    @OneToMany(() => DanhGiaHoatDong, danhGia => danhGia.hoatDong)
    danhGia: DanhGiaHoatDong[];
}
