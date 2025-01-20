import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { SessionsService } from '../sessions/sessions.service';

//El web socket esta corriendo en el puerto default del proyecto (3000)

@WebSocketGateway()
export class webSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor(
        private readonly sessionsService: SessionsService
    ) {}

    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log('Client connected');
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected');
    }

    @SubscribeMessage('joinSession')
    async handleJoinSession(client: Socket, data: { id: number }) {
        const session = await this.sessionsService.getAllDetailsBySession(data.id);
        client.join(`session-${data.id}`);
        this.server.to(`session-${data.id}`).emit('sessionUpdate', session);
    }

    async emitSessionUpdate(sessionId: number) {
        const sessionData = await this.sessionsService.getAllDetailsBySession(sessionId);
        this.server.to(`session-${sessionId}`).emit('sessionUpdate', sessionData);
    }
}