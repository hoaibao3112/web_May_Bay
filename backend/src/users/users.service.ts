import { Injectable } from '@nestjs/common'
import { PrismaService } from '../prisma/prisma.service'
import { Prisma } from '@prisma/client'

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } })
  }

  // Accept Prisma's generated create input to satisfy types
  async create(data: Prisma.UserCreateInput) {
    return this.prisma.user.create({ data })
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({ where: { id } })
  }
}
