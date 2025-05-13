import {
  WebSocketGateway,
  WebSocketServer,
  OnGatewayConnection,
  OnGatewayDisconnect,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*', // Permitir todas las conexiones
  },
})
export class RealtimeGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;

  handleConnection(client: Socket) {
    console.log('✅ Cliente conectado:', client.id);
  }

  handleDisconnect(client: Socket) {
    console.log('❌ Cliente desconectado:', client.id);
  }

  // Métodos para emitir eventos
  emitColumnUpdated(column: any) {
    this.server.emit('columnUpdated', column);
  }

  emitCardUpdated(card: any) {
    this.server.emit('cardUpdated', card);
  }

  emitCardMoved(data: { cardId: string; newColumnId: string; newPosition: number }) {
    this.server.emit('cardMoved', data);
  }

  emitColumnAdded(column: any) {
    this.server.emit('columnAdded', column);
  }

  emitColumnDeleted(columnId: string) {
    this.server.emit('columnDeleted', columnId);
  }

  emitCardAdded(card: any) {
    this.server.emit('cardAdded', card);
  }

  emitCardDeleted(cardId: string) {
    this.server.emit('cardDeleted', cardId);
  }
}
