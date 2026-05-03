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
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string | null;
        phone: string | null;
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
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string | null;
        phone: string | null;
        points: number;
        role: string;
    }>;
    getMe(userId: string): Promise<({
        authProviders: {
            id: string;
            userId: string;
            createdAt: Date;
            provider: string;
            providerId: string;
        }[];
        addresses: {
            address: string;
            id: string;
            userId: string;
            label: string;
            latitude: number | null;
            longitude: number | null;
            isDefault: boolean;
            createdAt: Date;
            updatedAt: Date;
        }[];
        pointHistory: {
            id: string;
            userId: string;
            createdAt: Date;
            orderId: string | null;
            delta: number;
            reason: string;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string | null;
        phone: string | null;
        points: number;
        role: string;
    }) | null>;
    linkAccount(body: {
        userId: string;
        provider: string;
        providerId: string;
    }): Promise<void>;
}
