import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from './prisma.service';

@Injectable()
export class AuthService {
  private otpMap = new Map<string, { code: string; expires: number }>();

  constructor(private prisma: PrismaService) {}

  // ─── OTP Logic ──────────────────────────────────────────────────────────
  async sendOtp(phone: string) {
    const code = '123456'; // Mocked OTP for development
    const expires = Date.now() + 5 * 60 * 1000; // 5 mins
    this.otpMap.set(phone, { code, expires });

    console.log(`[AUTH] Mock OTP for ${phone}: ${code}`);
    return { success: true, message: 'OTP sent successfully (Check console)' };
  }

  async verifyOtp(phone: string, inputCode: string, metadata?: any) {
    const record = this.otpMap.get(phone);
    if (!record || record.expires < Date.now()) {
      throw new BadRequestException('OTP expired or not found');
    }
    if (record.code !== inputCode) {
      throw new BadRequestException('Invalid OTP code');
    }

    this.otpMap.delete(phone);

    // Find or Create User
    let user = await this.prisma.user.findFirst({
      where: { phone },
    });

    if (!user) {
      user = await this.prisma.user.create({
        data: {
          phone,
          name: metadata?.name || 'Customer',
          authProviders: {
            create: { provider: 'PHONE', providerId: phone },
          },
        },
      });
    }

    return user;
  }

  // ─── LINE Login ─────────────────────────────────────────────────────────
  async loginWithLine(
    lineUid: string,
    profile: { displayName: string; pictureUrl?: string; email?: string },
  ) {
    // 1. Check if this LINE account exists as a provider
    const provider = await this.prisma.authProvider.findUnique({
      where: { providerId: lineUid },
      include: { user: true },
    });

    if (provider) return provider.user;

    // 2. Check if a user with the same email exists to link
    if (profile.email) {
      const existingUser = await this.prisma.user.findUnique({
        where: { email: profile.email },
      });
      if (existingUser) {
        await this.prisma.authProvider.create({
          data: {
            userId: existingUser.id,
            provider: 'LINE',
            providerId: lineUid,
          },
        });
        return existingUser;
      }
    }

    // 3. Create new user
    return this.prisma.user.create({
      data: {
        name: profile.displayName,
        email: profile.email,
        authProviders: {
          create: { provider: 'LINE', providerId: lineUid },
        },
      },
    });
  }

  // ─── Account Linking ────────────────────────────────────────────────────
  async linkProvider(userId: string, provider: string, providerId: string) {
    const existing = await this.prisma.authProvider.findUnique({
      where: { providerId },
    });
    if (existing) {
      if (existing.userId === userId) return; // Already linked
      throw new BadRequestException(
        'This account is already linked to another user',
      );
    }

    await this.prisma.authProvider.create({
      data: { userId, provider, providerId },
    });
  }
}
