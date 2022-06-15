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
    
    private sockets : WebSocket[]
    // public blockchain : Chain

    constructor() {
        super()
        // this.blockchain = new Chain()
        this.sockets = []
    }

    getSockets() {
        return this.sockets
    }

    // 서버 시작 실행 코드
    listen() {
        const server = new WebSocket.Server( { port : 7545 })
        server.on( 'connection', (socket) => {
            console.log( 'websocket connection' )
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
    // 상대방이 내게 연결할때

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
        this.errorHandler(socket)
        this.send(socket)(data)
        // 메시지 전송 > node2의 마지막 블럭 데이터을 받기 위해..
        // node2는 요청 받은 데이터를 보내줌
    }

    messageHandler (socket : WebSocket) {
        const callback = (data :string) => {
            console.log(data) // buffer
            // console.log(Buffer.from(data).toString()) // buffer > string
            // const Block : Message = P2PServer.dataParse<Message>(data)
            const result : Message = P2PServer.dataParse<Message>(data)
            const send = this.send(socket)

            switch (result.type) {
                case MessageType.latest_block : {
                    console.log('zxvdbvbv')
                    const message : Message = {
                        type : MessageType.all_block,
                        payload : [this.getLatestBlock()]
                    }
                    send(message)
                    console.log(message)
                    break
                }
                // 내가 서버일때 클라이언트로부터 요청을 받음
                // > 클라이언트에게 응답 (send message)
                // 서버가 이 코드가 실행되면 클라이언트는 아래 코드가 실행됨
                // 이 코드의 message = 아래의 result.payload
        

                case MessageType.all_block : {
                    const message : Message = {
                        type: MessageType.receivedChain,
                        payload : this.getChain()
                    }
                    // 블럭 검증 코드 실행 이후, 블럭을 체인에 넣을지 말지 결정
                    // 내가 가진 체인의 최신 블럭, 받은 블럭을 비교
                    // 내 hash와 상대방 previousHash가 같다면 길이 차이는 1, 상대방 체인 길이가 1 길다.
                    // 이 경우, 내 체인에 상대방 블럭을 추가
                    const [ receivedBlock ] = result.payload // this.getLatestBlock()
                    const isValid = this.addToChain(receivedBlock)
                    console.log(isValid)
                    if (!isValid.isError ) break
                    // chain에 블럭이 추가되었다면 메시지를 따로 보내지 않고 종료

                    send(message)
                    break
                }
                // 

                case MessageType.receivedChain : {
                    const receivedChain : IBlock[] = result.payload
                    this.handleChainResponse(receivedChain)
                    // 상대방 체인을 가져와  내 체인과 비교
                    // 이 함수는 하단에 작성
                    break
                }
                // 내가 클라이언트일 때 서버에서 전체 블럭을 달라고 요청하는 코드
            }
        }
        socket.on('message', callback)
    }

    errorHandler(socket : WebSocket) {
        // 매개 변수 socket은 에러난 사람의 socket을 의미함
        const close = () => {
            this.sockets.splice(this.sockets.indexOf(socket),1)
        }

        socket.on( 'close', close )
        socket.on( 'error', close )
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

    // broadcaast
    broadCast(message:Message) : void {
        this.sockets.forEach((socket) => this.send(socket)(message))
    }

    handleChainResponse(receivedChain:IBlock[]) : Failable < Message | undefined, string > {
        const isValidChain = this.isValidChain(receivedChain)
        // 우선 전달받은 체인을 검증
        if(isValidChain.isError ) return { isError : true, error:isValidChain.error}
        // 내 체인, 상대 체인에 대해 검사할 때,
        // i) 상대 체인보다 내 체인이 길다면 - 상대방 체인을 볼 필요가 없다. return
        // ii) 받은 체인 최신블럭.previousHash == 내 체인의 hash ? return
        // iii) 받은 체인 길이가 1 > 상대방 체인에 제네시스뿐일 때 return 
        // iii) 의 경우는 블럭을 추가하면 됨
        // 여기서 return 이란건 내 체인을 업데이트 할 필요가 없다는 말

        const isValid = this.replaceChain(receivedChain)
        if (isValid.isError ) return { isError : true, error : isValid.error }
        // 이 모든 조건을 피한 경우, 내 체인이 더 짧다 = 업데이트 할 필요가 있다.
        // chain.ts에 replaceChain 함수 작성

        // 체인을 최신화 했다면 이를 연결된 node들에게 broadcast한다
        const message : Message = {
            type: MessageType.receivedChain,
            payload : receivedChain 
        }

        this.broadCast(message)
        return { isError : false, value : undefined}
    }

}
