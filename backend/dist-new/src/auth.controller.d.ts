import { AuthService } from './auth.service';
import { PrismaService } from './prisma.service';
export declare class AuthController {
    private authService;
    private prisma;
    constructor(authService: AuthService, prisma: PrismaService);
    sendOtp(body: {
        phone: string;
    }): {
        success: boolean;
        message: string;
    };
    verifyOtp(body: {
        phone: string;
        code: string;
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
    loginWithLine(body: {
        lineUid: string;
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
    getMe(userId: string): Promise<({
        authProviders: {
            id: string;
            createdAt: Date;
            userId: string;
            provider: string;
            providerId: string;
        }[];
        addresses: {
            id: string;
            address: string;
            latitude: number | null;
            longitude: number | null;
            createdAt: Date;
            updatedAt: Date;
            label: string;
            isDefault: boolean;
            userId: string;
        }[];
        pointHistory: {
            id: string;
            createdAt: Date;
            userId: string;
            orderId: string | null;
            delta: number;
            reason: string;
        }[];
    } & {
        id: string;
        name: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        points: number;
        role: string;
    }) | null>;
    linkAccount(body: {
        userId: string;
        provider: string;
        providerId: string;
    }): Promise<void>;
}
