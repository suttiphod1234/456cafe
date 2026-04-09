import { Controller, Post, Body, Get, Param, Query, BadRequestException } from '@nestjs/common';
import { AuthService } from './auth.service';
import { PrismaService } from './prisma.service';

@Controller('api/auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private prisma: PrismaService
  ) {}

  @Post('otp/send')
  async sendOtp(@Body() body: { phone: string }) {
    if (!body.phone) throw new BadRequestException('Phone is required');
    return this.authService.sendOtp(body.phone);
  }

  @Post('otp/verify')
  async verifyOtp(@Body() body: { phone: string; code: string; name?: string }) {
    if (!body.phone || !body.code) throw new BadRequestException('Phone and code are required');
    return this.authService.verifyOtp(body.phone, body.code, { name: body.name });
  }

  @Post('line')
  async loginWithLine(@Body() body: { lineUid: string; displayName: string; pictureUrl?: string; email?: string }) {
    if (!body.lineUid) throw new BadRequestException('LINE UID is required');
    return this.authService.loginWithLine(body.lineUid, {
      displayName: body.displayName,
      pictureUrl: body.pictureUrl,
      email: body.email
    });
  }

  @Get('me')
  async getMe(@Query('userId') userId: string) {
    if (!userId) return null;
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { 
        authProviders: true,
        addresses: true,
        pointHistory: { orderBy: { createdAt: 'desc' }, take: 20 }
      }
    });
  }

  @Post('link')
  async linkAccount(@Body() body: { userId: string; provider: string; providerId: string }) {
    return this.authService.linkProvider(body.userId, body.provider, body.providerId);
  }
}
