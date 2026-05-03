import { PrismaService } from './prisma.service';
export declare class AuthService {
    private prisma;
    private otpMap;
    constructor(prisma: PrismaService);
    sendOtp(phone: string): {
        success: boolean;
        message: string;
    };
    verifyOtp(phone: string, inputCode: string, metadata?: {
        name?: string;
    }): Promise<{
        id: string;
        name: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        points: number;
        role: string;
    }>;
    loginWithLine(lineUid: string, profile: {
        displayName: string;
        pictureUrl?: string;
        email?: string;
    }): Promise<{
        id: string;
        name: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        points: number;
        role: string;
    }>;
    linkProvider(userId: string, provider: string, providerId: string): Promise<void>;
}
