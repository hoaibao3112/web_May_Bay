import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ActivitiesController } from './activities.controller';
import { ActivitiesService } from './activities.service';
import { HoatDong } from './entities/hoat-dong.entity';
import { DanhMucHoatDong } from './entities/danh-muc-hoat-dong.entity';
import { NhaCungCapHoatDong } from './entities/nha-cung-cap-hoat-dong.entity';
import { HinhAnhHoatDong } from './entities/hinh-anh-hoat-dong.entity';
import { GiaHoatDong } from './entities/gia-hoat-dong.entity';
import { LichHoatDong } from './entities/lich-hoat-dong.entity';
import { DiemNoiBatHoatDong } from './entities/diem-noi-bat-hoat-dong.entity';
import { DanhGiaHoatDong } from './entities/danh-gia-hoat-dong.entity';
import { DatHoatDong } from './entities/dat-hoat-dong.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([
            HoatDong,
            DanhMucHoatDong,
            NhaCungCapHoatDong,
            HinhAnhHoatDong,
            GiaHoatDong,
            LichHoatDong,
            DiemNoiBatHoatDong,
            DanhGiaHoatDong,
            DatHoatDong,
        ]),
    ],
    controllers: [ActivitiesController],
    providers: [ActivitiesService],
    exports: [ActivitiesService],
})
export class ActivitiesModule { }
