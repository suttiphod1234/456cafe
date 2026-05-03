import { PrismaService } from './prisma.service';
export interface CreateAddressDto {
    label: string;
    address: string;
    latitude?: number;
    longitude?: number;
    isDefault?: boolean;
}
export declare class AddressService {
    private prisma;
    constructor(prisma: PrismaService);
    getByUser(userId: string): Promise<{
        id: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        isDefault: boolean;
        userId: string;
    }[]>;
    create(userId: string, data: CreateAddressDto): Promise<{
        id: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        isDefault: boolean;
        userId: string;
    }>;
    update(id: string, userId: string, data: Partial<CreateAddressDto>): Promise<{
        id: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        isDefault: boolean;
        userId: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        address: string;
        latitude: number | null;
        longitude: number | null;
        createdAt: Date;
        updatedAt: Date;
        label: string;
        isDefault: boolean;
        userId: string;
    }>;
}
