import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AddressService {
  constructor(private prisma: PrismaService) {}

  async getByUser(userId: string) {
    return this.prisma.address.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });
  }

  async create(userId: string, data: any) {
    // If it's the first address or set as default, unset others
    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false }
      });
    }

    const count = await this.prisma.address.count({ where: { userId } });
    
    return this.prisma.address.create({
      data: {
        ...data,
        userId,
        isDefault: data.isDefault || count === 0
      }
    });
  }

  async update(id: string, userId: string, data: any) {
    if (data.isDefault) {
      await this.prisma.address.updateMany({
        where: { userId, NOT: { id } },
        data: { isDefault: false }
      });
    }

    return this.prisma.address.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return this.prisma.address.delete({ where: { id } });
  }
}
