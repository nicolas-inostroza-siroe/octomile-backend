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

    @SubscribeMessage('updateProduct')
    async handleProductUpdate(client: Socket, data: { 
        idSession: number,
        codigoProducto: string,
        pinchadoPor: string 
    }) {
        try {
            console.log('Updating product:', data); // Debug log

            // Join room if not already joined
            client.join(`session-${data.idSession}`);

            const result = await this.sessionsService.pincharProducto({
                idSession: data.idSession,
                codigoProducto: data.codigoProducto,
                pinchadoPor: data.pinchadoPor
            });

            // Emit to specific room
            this.server.to(`session-${data.idSession}`).emit('productUpdated', {
                status: 'success',
                data: result
            });

            // Get and broadcast fresh session data
            const updatedSession = await this.sessionsService.getAllDetailsBySession(data.idSession);
            this.server.to(`session-${data.idSession}`).emit('sessionUpdate', updatedSession);

            // Confirm to sender
            client.emit('updateConfirmed', {
                status: 'success',
                sessionId: data.idSession
            });

        } catch (error) {
            console.error('Update error:', error);
            client.emit('error', { 
                status: 'error',
                message: error.message 
            });
        }
    }

    async emitSessionUpdate(sessionId: number) {
        const sessionData = await this.sessionsService.getAllDetailsBySession(sessionId);
        this.server.to(`session-${sessionId}`).emit('sessionUpdate', sessionData);
    }
}