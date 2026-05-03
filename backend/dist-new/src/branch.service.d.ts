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
        managers: {
            id: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            branchId: string;
            email: string | null;
            role: string;
            lineUid: string | null;
        }[];
        _count: {
            orders: number;
            inventory: number;
        };
    } & {
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
    })[]>;
    getBranchById(id: string): Promise<{
        managers: {
            id: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            branchId: string;
            email: string | null;
            role: string;
            lineUid: string | null;
        }[];
        _count: {
            orders: number;
            inventory: number;
        };
    } & {
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
    }>;
    createBranch(data: BranchDetailDto & {
        name: string;
    }): Promise<{
        managers: {
            id: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            branchId: string;
            email: string | null;
            role: string;
            lineUid: string | null;
        }[];
        _count: {
            orders: number;
            inventory: number;
        };
    } & {
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
    }>;
    updateBranch(id: string, data: BranchDetailDto): Promise<{
        managers: {
            id: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            branchId: string;
            email: string | null;
            role: string;
            lineUid: string | null;
        }[];
        _count: {
            orders: number;
            inventory: number;
        };
    } & {
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
    }>;
    toggleBranchOpen(id: string): Promise<{
        managers: {
            id: string;
            name: string;
            phone: string | null;
            createdAt: Date;
            updatedAt: Date;
            branchId: string;
            email: string | null;
            role: string;
            lineUid: string | null;
        }[];
        _count: {
            orders: number;
            inventory: number;
        };
    } & {
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
    }>;
    deleteBranch(id: string): Promise<{
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
    }>;
    getManagers(branchId: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        email: string | null;
        role: string;
        lineUid: string | null;
    }[]>;
    addManager(branchId: string, data: CreateManagerDto): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        email: string | null;
        role: string;
        lineUid: string | null;
    }>;
    updateManager(managerId: string, data: Partial<CreateManagerDto>): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        email: string | null;
        role: string;
        lineUid: string | null;
    }>;
    deleteManager(managerId: string): Promise<{
        id: string;
        name: string;
        phone: string | null;
        createdAt: Date;
        updatedAt: Date;
        branchId: string;
        email: string | null;
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
                    name: string;
                    imageUrl: string | null;
                    createdAt: Date;
                    updatedAt: Date;
                    description: string | null;
                    sortOrder: number;
                    tags: string;
                    price: number;
                    categoryId: string | null;
                    status: string;
                };
            } & {
                id: string;
                price: number;
                productId: string;
                quantity: number;
                orderId: string;
                unitPrice: number;
                optionsPrice: number;
                productName: string | null;
                customization: import("@prisma/client/runtime/library").JsonValue | null;
                selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
            })[];
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
                name: string;
                imageUrl: string | null;
                createdAt: Date;
                updatedAt: Date;
                description: string | null;
                sortOrder: number;
                tags: string;
                price: number;
                categoryId: string | null;
                status: string;
            };
        } & {
            id: string;
            price: number;
            productId: string;
            quantity: number;
            orderId: string;
            unitPrice: number;
            optionsPrice: number;
            productName: string | null;
            customization: import("@prisma/client/runtime/library").JsonValue | null;
            selectedOptions: import("@prisma/client/runtime/library").JsonValue | null;
        })[];
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
    })[]>;
    getProducts(): Promise<({
        recipes: ({
            ingredient: {
                id: string;
                name: string;
                createdAt: Date;
                updatedAt: Date;
                unit: string;
                costPerUnit: number;
                sku: string | null;
            };
        } & {
            id: string;
            productId: string;
            ingredientId: string;
            quantity: number;
        })[];
    } & {
        id: string;
        name: string;
        imageUrl: string | null;
        createdAt: Date;
        updatedAt: Date;
        description: string | null;
        sortOrder: number;
        tags: string;
        price: number;
        categoryId: string | null;
        status: string;
    })[]>;
    getBranchStats(branchId: string): Promise<{
        totalOrders: number;
        revenue: number;
    }>;
}
