import { WebSocket } from 'ws'

//chain
import { Chain } from '@core/blockchain/chain'

enum MessageType {
    latest_block = 0,
    all_block = 1,
    receivedChain = 2
}

interface Message {
    type : MessageType
    payload : any,
}



export class P2PServer extends Chain{
    
    public sockets : WebSocket[]
    // public blockchain : Chain

    constructor() {
        super()
        // this.blockchain = new Chain()
        this.sockets = []
    }

    // 서버 시작 실행 코드
    listen() {
        const server = new WebSocket.Server( { port : 7545 })
        server.on( 'connection', (socket) => {
            console.log( 'websocket connection' )
            this.sockets.push(socket)
            this.connectSocket(socket)
            // websocket이 외와 연결될 경우 코드 실행, 콘솔 찍고 sockets 배열에 푸시
            // 나 자신은 제외다. 상대방에 대해서만 실행됨
        })
        // on은 이벤트 리스너라고 보면 될 것 같다.
        // 커넥션이 된다? > 콜백을 실행
    }
    // 클라이언트가 나에게 연결을 시도했을 때만 실행되는 코드

    // 클라이언트 연결 코드
    connectToPeer(newPeer : string) {
        const socket = new WebSocket(newPeer)
        // 원하는 ip로 요청을 보낼 수 있게..
        socket.on('open', () => {
            this.connectSocket(socket)
        })
    }

    //
    connectSocket(socket : WebSocket) {
        this.sockets.push(socket)
        // 연결된 socket을 배열에 추가
        this.messageHandler(socket)
        // 연결된 소켓에 대해 메시지 수신에 대한 이벤트 등록
        // 연결된 소켓이 내게 보낸 메시지.. 

        const data : Message = {
            type : MessageType.latest_block,
            payload : {}
        }
        
        // socket.send('bitcoin is ponzi')
        // 나와 연결된 클라리언트에 내용을 전송
        // 트리거없이 그냥..
        // 얘가 위에 oscket.on보다 먼저 실행되서 메시지 실행 후, 콜백 실행
        // qwui를 매개변수로 받는다.
        //socket.send(JSON.stringify(data))
        // 상대에게 최신 블럭을  스트링으로 전송
        this.send(socket)(data)
        // 메시지 전송 > node2의 마지막 블럭 데이터을 받기 위해..
        // node2는 요청 받은 데이터를 보내줌
    }

    messageHandler (socket : WebSocket) {
        const callback = (data :string) => {
            console.log(data) // buffer
            // console.log(Buffer.from(data).toString()) // buffer > string
            // const Block : Message = P2PServer.dataParse<Message>(data)
            const message : Message = P2PServer.dataParse<Message>(data)
            const send = this.send(socket)
            switch (message.type) {
                case MessageType.latest_block : {
                    const message : Message = {
                        type : 1,
                        payload : [this.getLatestBlock()]
                    }
                    send(message)
                    // console.log(message)
                    break
                }
                // 내가 서버일때 클라이언트에게 메시지를 보내는 케이스
                
                case MessageType.all_block : {
                    const message : Message = {
                        type: MessageType.receivedChain,
                        payload : this.getChain()
                    }
                    // 블럭 검증 코드 실행 이후, 블럭을 체인에 넣을지 말지 결정
                    send(message)
                    break
                }

                case MessageType.receivedChain : {
                    const receivedChain : IBlock[] = message.payload
                    console.log(receivedChain)
                    break
                }
                // 내가 클라이언트일 때 서버에서 전체 블럭을 달라고 요청하는 코드
            }
        }
        socket.on('message', callback)
    }

    //
    send(_socket : WebSocket) {
        return (_data : Message) => {
            _socket.send(JSON.stringify(_data))
        }
    }
 
    // 이 고차함수를 connectSocket에서 실행


    // 소켓에서도 데이터 타입에따라 어떻게 처리를 할지 정해줘야한다.     
    static dataParse<T>(_data: string) : T {
        // const result = JSON.parse(Buffer.from(_data).toString())
        // if( result === undefined ) return { isError : true, error : 'conversion failed'}
        // return { isError : false, value : result }
            return JSON.parse(Buffer.from(_data).toString())
    }
}
