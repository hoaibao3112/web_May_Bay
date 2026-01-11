import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreatePromotionDto } from './dto/create-promotion.dto';
import { UpdatePromotionDto } from './dto/update-promotion.dto';
import { ValidatePromotionDto } from './dto/validate-promotion.dto';

@Injectable()
export class PromotionsService {
  constructor(private prisma: PrismaService) { }

  // ==================== ADMIN CRUD ====================

  async create(dto: CreatePromotionDto) {
    const existing = await this.prisma.khuyenMai.findUnique({
      where: { maKhuyenMai: dto.maKhuyenMai },
    });

    if (existing) {
      throw new BadRequestException('Mã khuyến mãi đã tồn tại');
    }

    return this.prisma.khuyenMai.create({
      data: {
        ...dto,
        giaTriGiam: Number(dto.giaTriGiam),
        giamToiDa: dto.giamToiDa ? Number(dto.giamToiDa) : null,
        giaTriDonToiThieu: Number(dto.giaTriDonToiThieu),
        ngayBatDau: new Date(dto.ngayBatDau),
        ngayKetThuc: new Date(dto.ngayKetThuc),
        isActive: dto.isActive ?? true,
      },
    });
  }

  async findAll(filters?: { isActive?: boolean; search?: string }) {
    const where: any = {};

    if (filters?.isActive !== undefined) {
      where.isActive = filters.isActive;
    }

    if (filters?.search) {
      where.OR = [
        { maKhuyenMai: { contains: filters.search } },
        { tenKhuyenMai: { contains: filters.search } },
      ];
    }

    return this.prisma.khuyenMai.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number) {
    const promotion = await this.prisma.khuyenMai.findUnique({
      where: { id },
    });

    if (!promotion) {
      throw new NotFoundException('Không tìm thấy khuyến mãi');
    }

    return promotion;
  }

  async update(id: number, dto: UpdatePromotionDto) {
    await this.findOne(id);

    return this.prisma.khuyenMai.update({
      where: { id },
      data: {
        ...dto,
        giaTriGiam: dto.giaTriGiam ? Number(dto.giaTriGiam) : undefined,
        giamToiDa: dto.giamToiDa ? Number(dto.giamToiDa) : undefined,
        giaTriDonToiThieu: dto.giaTriDonToiThieu ? Number(dto.giaTriDonToiThieu) : undefined,
        ngayBatDau: dto.ngayBatDau ? new Date(dto.ngayBatDau) : undefined,
        ngayKetThuc: dto.ngayKetThuc ? new Date(dto.ngayKetThuc) : undefined,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id);
    return this.prisma.khuyenMai.delete({ where: { id } });
  }

  // ==================== CUSTOMER VALIDATION ====================

  async validate(dto: ValidatePromotionDto) {
    const promo = await this.prisma.khuyenMai.findUnique({
      where: { maKhuyenMai: dto.maKhuyenMai.toUpperCase() },
    });

    if (!promo) {
      throw new BadRequestException('Mã khuyến mãi không tồn tại');
    }

    if (!promo.isActive) {
      throw new BadRequestException('Mã khuyến mãi không còn hiệu lực');
    }

    const now = new Date();
    if (now < promo.ngayBatDau || now > promo.ngayKetThuc) {
      throw new BadRequestException('Mã khuyến mãi đã hết hạn');
    }

    if (promo.soLuotDaSuDung >= promo.soLuotSuDung) {
      throw new BadRequestException('Mã khuyến mãi đã hết lượt sử dụng');
    }

    if (dto.tongTien < Number(promo.giaTriDonToiThieu)) {
      const formatted = new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(Number(promo.giaTriDonToiThieu));
      throw new BadRequestException(`Giá trị đơn hàng tối thiểu ${formatted}`);
    }

    const discount = this.calculateDiscount(promo, dto.tongTien);

    return {
      valid: true,
      maKhuyenMai: promo.maKhuyenMai,
      tenKhuyenMai: promo.tenKhuyenMai,
      discount,
      finalAmount: dto.tongTien - discount,
    };
  }

  private calculateDiscount(promo: any, tongTien: number): number {
    let discount = 0;

    if (promo.loaiGiam === 'PERCENT') {
      discount = (tongTien * Number(promo.giaTriGiam)) / 100;
      if (promo.giamToiDa && discount > Number(promo.giamToiDa)) {
        discount = Number(promo.giamToiDa);
      }
    } else if (promo.loaiGiam === 'FIXED') {
      discount = Number(promo.giaTriGiam);
      if (discount > tongTien) {
        discount = tongTien;
      }
    }

    return Math.round(discount);
  }

  async incrementUsage(maKhuyenMai: string) {
    const promo = await this.prisma.khuyenMai.findUnique({
      where: { maKhuyenMai: maKhuyenMai.toUpperCase() },
    });

    if (!promo) return;

    await this.prisma.khuyenMai.update({
      where: { id: promo.id },
      data: { soLuotDaSuDung: promo.soLuotDaSuDung + 1 },
    });

    console.log(`✅ Promotion ${maKhuyenMai} usage: ${promo.soLuotDaSuDung + 1}/${promo.soLuotSuDung}`);
  }

  async getActive() {
    const now = new Date();

    return this.prisma.khuyenMai.findMany({
      where: {
        isActive: true,
        ngayBatDau: { lte: now },
        ngayKetThuc: { gte: now },
      },
      select: {
        maKhuyenMai: true,
        tenKhuyenMai: true,
        moTa: true,
        loaiGiam: true,
        giaTriGiam: true,
        giamToiDa: true,
        giaTriDonToiThieu: true,
        ngayKetThuc: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getStats(id: number) {
    const promo = await this.findOne(id);
    const usagePercentage = (promo.soLuotDaSuDung / promo.soLuotSuDung) * 100;
    const remainingUses = promo.soLuotSuDung - promo.soLuotDaSuDung;

    return {
      ...promo,
      usagePercentage: Math.round(usagePercentage),
      remainingUses,
    };
  }
}
