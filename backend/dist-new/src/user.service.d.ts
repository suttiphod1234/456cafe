import { PrismaService } from './prisma.service';
export declare class UserService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllUsers(search?: string): Promise<({
        authProviders: {
            id: string;
            userId: string;
            createdAt: Date;
            provider: string;
            providerId: string;
        }[];
        _count: {
            orders: number;
        };
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string | null;
        phone: string | null;
        points: number;
        role: string;
    })[]>;
    getUserById(id: string): Promise<{
        authProviders: {
            id: string;
            userId: string;
            createdAt: Date;
            provider: string;
            providerId: string;
        }[];
        orders: ({
            branch: {
                address: string | null;
                id: string;
                latitude: number | null;
                longitude: number | null;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                imageUrl: string | null;
                phone: string | null;
                location: string | null;
                isOpen: boolean;
                openTime: string | null;
                closeTime: string | null;
                promptpayId: string | null;
                promptpayName: string | null;
            };
        } & {
            id: string;
            userId: string | null;
            createdAt: Date;
            updatedAt: Date;
            branchId: string;
            orderNo: string;
            customerUid: string;
            customerName: string | null;
            totalAmount: number;
            status: import(".prisma/client").$Enums.OrderStatus;
            fulfillmentType: string;
            note: string | null;
            platform: string;
            riderName: string | null;
            riderPhone: string | null;
            qcNote: string | null;
            scheduledAt: Date | null;
            queueNo: number;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string | null;
        phone: string | null;
        points: number;
        role: string;
    }>;
    updatePoints(id: string, delta: number, reason?: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string | null;
        phone: string | null;
        points: number;
        role: string;
    }>;
    setRole(id: string, role: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        email: string | null;
        phone: string | null;
        points: number;
        role: string;
    }>;
}
