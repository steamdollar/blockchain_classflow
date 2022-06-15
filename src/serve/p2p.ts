import { WebSocket } from 'ws'

export class P2PServer {
    
    public sockets : WebSocket[]

    constructor() {
        this.sockets = []
    }

    // 서버 시작 실행 코드
    listen() {
        const server = new WebSocket.Server( { port : 7545 })
        server.on( 'connection', (socket) => {
            console.log( 'websocket connection' )
            this.connectSocket(socket)
            // websocket이 외와 연결될 경우 실행할 코드
            // 콘솔 찍고 connectSocket 함수 실행
        })
    }

    // 클라이언트 연결 코드
    connectToPeer(newPeer : string) {
        const socket = new WebSocket(newPeer)
        // 원하는 ip로 요청을 보낼 수 있게..
        socket.on('open', () => {
            this.connectSocket(socket)
        })
    }

    connectSocket(socket : WebSocket) {
        this.sockets.push(socket)
        socket.on('message', (data : string) => {
            console.log(data)
            console.log(Buffer.from(data).toString())
        })
        // 메시지 수신에 대한 이벤트 등록

        socket.send('bitcoin is ponzi')
        // 나와 연결된 클라리언트에 내용을 전송
        // 트리거없이 그냥..
        // 얘가 위에 oscket.on보다 먼저 실행되서 메시지 실행 후, 콜백 실행
        // qwui를 매개변수로 받는다.
    }
}
