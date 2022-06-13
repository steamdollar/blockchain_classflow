import { WebSocket } from 'ws'

export class P2PServer {
    listen() {
        const server = new WebSocket.Server( { port : 7545 })
        server.on( 'connection', (socket) => {
            console.log( 'websocket connection' )
        })
    }

    connectToPeer(newPeer : string) {
        const socket = new WebSocket(newPeer)
        // 원하는 ip로 요청을 보낼 수 있게..
    }
}
