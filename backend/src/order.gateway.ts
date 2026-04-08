import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class OrderGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log(`Client connected: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    console.log(`Client disconnected: ${client.id}`);
  }

  @SubscribeMessage('join-branch')
  handleJoinBranch(client: Socket, branchId: string) {
    client.join(`branch-${branchId}`);
    console.log(`Client ${client.id} joined branch: ${branchId}`);
  }

  notifyNewOrder(branchId: string, order: any) {
    this.server.to(`branch-${branchId}`).emit('new-order', order);
  }

  notifyUpdateOrder(branchId: string, order: any) {
    this.server.to(`branch-${branchId}`).emit('update-order', order);
  }
}
