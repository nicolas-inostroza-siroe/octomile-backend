import { OnGatewayConnection, OnGatewayDisconnect, WebSocketGateway, WebSocketServer, SubscribeMessage } from '@nestjs/websockets';
import { Server, Socket } from "socket.io";
import { SessionsService } from '../sessions/sessions.service';

//El web socket esta corriendo en el puerto default del proyecto (3000)

@WebSocketGateway({
    cors: {
        origin: '*', 
        methods: ['GET', 'POST'],
        credentials: true
    }
})
export class webSocketGateway implements OnGatewayConnection, OnGatewayDisconnect {
    constructor() {}

    @WebSocketServer()
    server: Server;

    handleConnection(client: Socket) {
        console.log('Client connected');
    }

    handleDisconnect(client: Socket) {
        console.log('Client disconnected');
    }

    @SubscribeMessage('joinSession')
    async handleJoinSession(client: Socket, data: {name: string, id: number }) {

        console.log("conectando ");

        const rooms = Array.from(client.rooms).filter(room => room !== client.id);
        rooms.forEach(room => client.leave(room));

        client.join(`${data.name}-${data.id}`);
    }

    emitSessionUpdate(sessionId: any, updatedSession: any) {
        this.server.to(`session-${sessionId}`).emit('sessionUpdate', updatedSession);
    }

    emitProductScanned(routeId: any, updatedProduct: any) {
        this.server.to(`route-${routeId}`).emit('productScanned', updatedProduct);
    }

    emitReceptionProduct(updatedProduct: any){
        this.server.to(`reception-products`).emit('receptionProductScanned', updatedProduct);
    }
}