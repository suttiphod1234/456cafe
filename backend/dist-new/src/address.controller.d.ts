import { AddressService } from './address.service';
export declare class AddressController {
    private addressService;
    constructor(addressService: AddressService);
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
    create(body: {
        userId: string;
        label: string;
        address: string;
        latitude?: number;
        longitude?: number;
        isDefault?: boolean;
    }): Promise<{
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
    update(id: string, body: {
        userId: string;
        label?: string;
        address?: string;
        latitude?: number;
        longitude?: number;
        isDefault?: boolean;
    }): Promise<{
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
