import { PrismaService } from './prisma.service';
import { OrderGateway } from './order.gateway';
import { AiService } from './ai.service';
import { InventoryService } from './inventory.service';
import { Prisma } from '@prisma/client';
export interface CreateOrderDto {
    branchId: string;
    userId?: string;
    customerUid?: string;
    customerName?: string;
    totalAmount: number;
    fulfillmentType?: string;
    note?: string;
    scheduledAt?: string | Date;
    paymentMethod?: string;
    platform?: string;
    items: Array<{
        productId: string;
        quantity: number;
        unitPrice?: number;
        price: number;
        optionsPrice?: number;
        productName?: string;
        name?: string;
        customization?: any;
        selectedOptions?: any;
    }>;
}
export declare class OrderService {
    private prisma;
    private gateway;
    private ai;
    private inventory;
    constructor(prisma: PrismaService, gateway: OrderGateway, ai: AiService, inventory: InventoryService);
    private orderInclude;
    private generateOrderNo;
    createOrder(data: CreateOrderDto): Promise<{
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
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            amount: number;
            method: string;
            transactionId: string | null;
            qrPayload: string | null;
            paidAt: Date | null;
        } | null;
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
            customization: Prisma.JsonValue | null;
            selectedOptions: Prisma.JsonValue | null;
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
    }>;
    updateOrderStatus(orderId: string, status: string, metadata?: {
        riderName?: string;
        riderPhone?: string;
        qcNote?: string;
    }): Promise<{
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
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            amount: number;
            method: string;
            transactionId: string | null;
            qrPayload: string | null;
            paidAt: Date | null;
        } | null;
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
            customization: Prisma.JsonValue | null;
            selectedOptions: Prisma.JsonValue | null;
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
    }>;
    updatePaymentStatus(orderId: string, data: {
        status: string;
        method?: string;
        transactionId?: string;
    }): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        status: import(".prisma/client").$Enums.PaymentStatus;
        orderId: string;
        amount: number;
        method: string;
        transactionId: string | null;
        qrPayload: string | null;
        paidAt: Date | null;
    }>;
    getAllOrders(filters?: {
        branchId?: string;
        status?: string;
        date?: string;
        search?: string;
    }): Promise<({
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
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            amount: number;
            method: string;
            transactionId: string | null;
            qrPayload: string | null;
            paidAt: Date | null;
        } | null;
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
            customization: Prisma.JsonValue | null;
            selectedOptions: Prisma.JsonValue | null;
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
    getOrderById(id: string): Promise<{
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
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            amount: number;
            method: string;
            transactionId: string | null;
            qrPayload: string | null;
            paidAt: Date | null;
        } | null;
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
            customization: Prisma.JsonValue | null;
            selectedOptions: Prisma.JsonValue | null;
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
    }>;
    getRecentOrders(limit?: number): Promise<({
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
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            amount: number;
            method: string;
            transactionId: string | null;
            qrPayload: string | null;
            paidAt: Date | null;
        } | null;
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
            customization: Prisma.JsonValue | null;
            selectedOptions: Prisma.JsonValue | null;
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
    getCustomerOrders(customerUid: string): Promise<({
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
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            amount: number;
            method: string;
            transactionId: string | null;
            qrPayload: string | null;
            paidAt: Date | null;
        } | null;
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
            customization: Prisma.JsonValue | null;
            selectedOptions: Prisma.JsonValue | null;
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
    getOrderStats(branchId?: string): Promise<{
        total: number;
        todayCount: number;
        todayRevenue: number;
        totalRevenue: number;
        byStatus: {
            [k: string]: number;
        };
    }>;
    getGlobalStats(): Promise<{
        revenue: number;
        totalOrders: number;
        customers: number;
        branches: number;
    }>;
    cancelOrder(orderId: string, reason?: string): Promise<{
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
        payment: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            status: import(".prisma/client").$Enums.PaymentStatus;
            orderId: string;
            amount: number;
            method: string;
            transactionId: string | null;
            qrPayload: string | null;
            paidAt: Date | null;
        } | null;
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
            customization: Prisma.JsonValue | null;
            selectedOptions: Prisma.JsonValue | null;
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
    }>;
    getAiRecommendation(userInput: string): Promise<string>;
    getAiTranslate(text: string, targetLanguage: 'Thai' | 'English'): Promise<string>;
}
