import { UserService } from './user.service';
export declare class UserController {
    private userService;
    constructor(userService: UserService);
    getAllUsers(search?: string): Promise<({
        authProviders: {
            id: string;
            createdAt: Date;
            userId: string;
            provider: string;
            providerId: string;
        }[];
        _count: {
            orders: number;
        };
    } & {
        id: string;
        name: string | null;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        email: string | null;
        points: number;
        role: string;
    })[]>;
    getUserById(id: string): Promise<{
        orders: ({
            branch: {
                id: string;
                name: string;
                location: string | null;
                address: string | null;
                latitude: number | null;
                longitude: number | null;
                isOpen: boolean;
                openTime: string | null;
                closeTime: string | null;
                phone: string | null;
                promptpayId: string | null;
                promptpayName: string | null;
                imageUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
            };
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.OrderStatus;
            userId: string | null;
            branchId: string;
            orderNo: string;
            customerUid: string;
            customerName: string | null;
            totalAmount: number;
            fulfillmentType: string;
            note: string | null;
            platform: string;
            riderName: string | null;
            riderPhone: string | null;
            qcNote: string | null;
            scheduledAt: Date | null;
            queueNo: number;
        })[];
        authProviders: {
            id: string;
            createdAt: Date;
            userId: string;
            provider: string;
            providerId: string;
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
    }>;
    updatePoints(id: string, body: {
        delta: number;
        reason?: string;
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
    setRole(id: string, body: {
        role: string;
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
}
