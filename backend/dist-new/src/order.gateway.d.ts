import { OnGatewayConnection, OnGatewayDisconnect } from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
export declare class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
    server: Server;
    handleConnection(client: Socket): void;
    handleDisconnect(client: Socket): void;
    handleJoinBranch(client: Socket, branchId: string): void;
    notifyNewOrder(branchId: string, order: any): void;
    notifyUpdateOrder(branchId: string, order: any): void;
    notifyInventoryAlert(branchId: string, alerts: any[]): void;
}
