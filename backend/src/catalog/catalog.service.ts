import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CatalogService {
  constructor(private prisma: PrismaService) {}

  // Quốc gia
  async getAllCountries() {
    return this.prisma.quocGia.findMany();
  }

  async createCountry(data: { maQuocGia: string; tenQuocGia: string }) {
    return this.prisma.quocGia.create({ data });
  }

  async updateCountry(id: number, data: { tenQuocGia?: string }) {
    return this.prisma.quocGia.update({ where: { id }, data });
  }

  async deleteCountry(id: number) {
    return this.prisma.quocGia.delete({ where: { id } });
  }

  // Sân bay
  async getAllAirports() {
    return this.prisma.sanBay.findMany({
      include: { quocGia: true },
    });
  }

  async getAirportByIata(maIata: string) {
    return this.prisma.sanBay.findUnique({
      where: { maIata },
      include: { quocGia: true },
    });
  }

  async searchAirports(query: string) {
    return this.prisma.sanBay.findMany({
      where: {
        OR: [
          { maIata: { contains: query } },
          { tenSanBay: { contains: query } },
          { thanhPho: { contains: query } },
        ],
      },
      include: { quocGia: true },
      take: 10,
    });
  }

  async createAirport(data: any) {
    return this.prisma.sanBay.create({ data });
  }

  async updateAirport(id: number, data: any) {
    return this.prisma.sanBay.update({ where: { id }, data });
  }

  async deleteAirport(id: number) {
    return this.prisma.sanBay.delete({ where: { id } });
  }

  // Hãng hàng không
  async getAllAirlines() {
    return this.prisma.hangHangKhong.findMany();
  }

  async getAirlineByCode(maIata: string) {
    return this.prisma.hangHangKhong.findUnique({
      where: { maIata },
    });
  }

  async createAirline(data: { maIata: string; tenHang: string; logo?: string }) {
    return this.prisma.hangHangKhong.create({ data });
  }

  async updateAirline(id: number, data: { tenHang?: string; logo?: string }) {
    return this.prisma.hangHangKhong.update({ where: { id }, data });
  }

  async deleteAirline(id: number) {
    return this.prisma.hangHangKhong.delete({ where: { id } });
  }

  // Tiền tệ
  async getAllCurrencies() {
    return this.prisma.tienTe.findMany();
  }

  async createCurrency(data: { maTienTe: string; tenTienTe: string; tyGia: number }) {
    return this.prisma.tienTe.create({
      data: {
        ...data,
        tyGia: data.tyGia,
      },
    });
  }
}
