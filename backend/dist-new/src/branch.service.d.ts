import { PrismaService } from './prisma.service';
export interface BranchDetailDto {
    name?: string;
    location?: string;
    address?: string;
    latitude?: number;
    longitude?: number;
    isOpen?: boolean;
    openTime?: string;
    closeTime?: string;
    phone?: string;
    promptpayId?: string;
    promptpayName?: string;
    imageUrl?: string;
}
export interface CreateManagerDto {
    name: string;
    email?: string;
    phone?: string;
    role?: string;
    lineUid?: string;
}
export declare class BranchService {
    private prisma;
    constructor(prisma: PrismaService);
    getAllBranches(): Promise<({
        _count: {
            inventory: number;
            orders: number;
        };
        managers: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchId: string;
            email: string | null;
            phone: string | null;
            role: string;
            lineUid: string | null;
        }[];
    } & {
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
    })[]>;
    getBranchById(id: string): Promise<{
        _count: {
            inventory: number;
            orders: number;
        };
        managers: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchId: string;
            email: string | null;
            phone: string | null;
            role: string;
            lineUid: string | null;
        }[];
    } & {
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
    }>;
    createBranch(data: BranchDetailDto & {
        name: string;
    }): Promise<{
        _count: {
            inventory: number;
            orders: number;
        };
        managers: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchId: string;
            email: string | null;
            phone: string | null;
            role: string;
            lineUid: string | null;
        }[];
    } & {
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
    }>;
    updateBranch(id: string, data: BranchDetailDto): Promise<{
        _count: {
            inventory: number;
            orders: number;
        };
        managers: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchId: string;
            email: string | null;
            phone: string | null;
            role: string;
            lineUid: string | null;
        }[];
    } & {
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
    }>;
    toggleBranchOpen(id: string): Promise<{
        _count: {
            inventory: number;
            orders: number;
        };
        managers: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            branchId: string;
            email: string | null;
            phone: string | null;
            role: string;
            lineUid: string | null;
        }[];
    } & {
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
    }>;
    deleteBranch(id: string): Promise<{
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
    }>;
    getManagers(branchId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        branchId: string;
        email: string | null;
        phone: string | null;
        role: string;
        lineUid: string | null;
    }[]>;
    addManager(branchId: string, data: CreateManagerDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        branchId: string;
        email: string | null;
        phone: string | null;
        role: string;
        lineUid: string | null;
    }>;
    updateManager(managerId: string, data: Partial<CreateManagerDto>): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        branchId: string;
        email: string | null;
        phone: string | null;
        role: string;
        lineUid: string | null;
    }>;
    deleteManager(managerId: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        branchId: string;
        email: string | null;
        phone: string | null;
        role: string;
        lineUid: string | null;
    }>;
    getBranchDashboard(branchId: string): Promise<{
        totalOrders: number;
        todayOrders: number;
        totalRevenue: number;
        todayRevenue: number;
        recentOrders: ({
            items: ({
                product: {
                    id: string;
                    createdAt: Date;
                    updatedAt: Date;
                    name: string;
                    description: string | null;
                    status: string;
                    price: number;
                    categoryId: string | null;
                    imageUrl: string | null;
                    tags: string;
                    sortOrder: number;
                };
            } & {
                id: string;
                quantity: number;
                orderId: string;
                productId: string;
                unitPrice: number;
                optionsPrice: number;
                price: number;
                productName: string | null;
                customization: import("@prisma/client/runtime/library").JsonValue | null;
                selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
            })[];
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
        topProducts: {
            productId: string;
            name: string;
            totalSold: number;
        }[];
    }>;
    getBranchOrders(branchId: string, limit?: number): Promise<({
        items: ({
            product: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                description: string | null;
                status: string;
                price: number;
                categoryId: string | null;
                imageUrl: string | null;
                tags: string;
                sortOrder: number;
            };
        } & {
            id: string;
            quantity: number;
            orderId: string;
            productId: string;
            unitPrice: number;
            optionsPrice: number;
            price: number;
            productName: string | null;
            customization: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
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
    })[]>;
    getProducts(): Promise<({
        recipes: ({
            ingredient: {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                name: string;
                unit: string;
                costPerUnit: number;
                sku: string | null;
            };
        } & {
            id: string;
            ingredientId: string;
            quantity: number;
            productId: string;
        })[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string;
        description: string | null;
        status: string;
        price: number;
        categoryId: string | null;
        imageUrl: string | null;
        tags: string;
        sortOrder: number;
    })[]>;
    getBranchStats(branchId: string): Promise<{
        totalOrders: number;
        revenue: number;
    }>;
}
