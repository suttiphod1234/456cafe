import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class UserService {
  constructor(private prisma: PrismaService) {}

  async getAllUsers(search?: string) {
    const where: any = {};
    if (search) {
      where.OR = [
        { name: { contains: search } },
        { email: { contains: search } },
        { phone: { contains: search } },
      ];
    }

    return this.prisma.user.findMany({
      where,
      include: {
        authProviders: true,
        _count: {
          select: { orders: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getUserById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        authProviders: true,
        orders: {
          orderBy: { createdAt: 'desc' },
          take: 10,
          include: { branch: true },
        },
      },
    });
    if (!user) throw new NotFoundException(`User ${id} not found`);
    return user;
  }

  async updatePoints(id: string, delta: number, reason?: string) {
    const user = await this.prisma.user.update({
      where: { id },
      data: {
        points: { increment: delta },
      },
    });

    // Audit Log for point adjustment
    await this.prisma.auditLog.create({
      data: {
        action: 'UPDATE_POINTS',
        entity: 'User',
        entityId: id,
        details: { delta, reason, newPoints: user.points },
      },
    });

    return user;
  }

  async setRole(id: string, role: string) {
    return this.prisma.user.update({
      where: { id },
      data: { role },
    });
  }
}
