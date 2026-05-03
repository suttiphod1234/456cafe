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
        address: string;
        id: string;
        userId: string;
        label: string;
        latitude: number | null;
        longitude: number | null;
        isDefault: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create(userId: string, data: CreateAddressDto): Promise<{
        address: string;
        id: string;
        userId: string;
        label: string;
        latitude: number | null;
        longitude: number | null;
        isDefault: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(id: string, userId: string, data: Partial<CreateAddressDto>): Promise<{
        address: string;
        id: string;
        userId: string;
        label: string;
        latitude: number | null;
        longitude: number | null;
        isDefault: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    delete(id: string): Promise<{
        address: string;
        id: string;
        userId: string;
        label: string;
        latitude: number | null;
        longitude: number | null;
        isDefault: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
