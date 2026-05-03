import { AddressService } from './address.service';
export declare class AddressController {
    private addressService;
    constructor(addressService: AddressService);
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
    create(body: {
        userId: string;
        label: string;
        address: string;
        latitude?: number;
        longitude?: number;
        isDefault?: boolean;
    }): Promise<{
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
    update(id: string, body: {
        userId: string;
        label?: string;
        address?: string;
        latitude?: number;
        longitude?: number;
        isDefault?: boolean;
    }): Promise<{
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
