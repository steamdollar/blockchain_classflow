import { BlockChain } from "./src/core/index";
import { P2PServer } from "./src/serve/p2p";
import peers from './peer.json'
import express from 'express'


const app = express()
const bc = new BlockChain()
const ws = new P2PServer()

app.use(express.json())

app.get('/', (req, res)=> {
    res.send('bitcoin is ponzi')
})

app.get('/chains', (req, res) => {
    res.json(ws.getChain())
})
// block 내용

app.post('/mineBlock', (req, res) => {
    const { data } = req.body
    const newBlock = ws.addBlock(data)
    if( newBlock.isError == true) return res.status(500).send(newBlock.error)

    res.send(newBlock.value)
})
// block 채굴

app.post('/addToPeer', (req, res) => {
    const { peer } = req.body
    ws.connectToPeer(peer)
})

app.get('/addPeers', (req,res) => {
    peers.forEach((peer) => {
        ws.connectToPeer(peer)
    })
})

app.get('/peers', (req, res) => {
    const sockets = ws.getSockets().map ((s:any) => 
    s._socket.remoteAddress + ':' + s._sockets.remotePort)
    res.json(sockets)
    // 연결된 소켓들 가져오기
    // send할때 몯느 사람들에게 한 번에 보낼 수 있다는걸 의미
})

app.listen(3000, () => {
    console.log('server run 3000')
})

ws.listen()