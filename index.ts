import { BlockChain } from "./src/core/index";
import { P2PServer } from "./src/serve/p2p";
import express from 'express'


const app = express()
const bc = new BlockChain()
const ws = new P2PServer()

app.use(express.json())

app.get('/', (req, res)=> {
    res.send('bitcoin is ponzi')
})

app.get('/chains', (req, res) => {
    res.json(bc.chain.getChain())
})
// block 내용

app.post('/mineBlock', (req, res) => {
    const { data } = req.body
    const newBlock = bc.chain.addBlock(data)
    if( newBlock.isError == true) return res.status(500).send(newBlock.error)

    res.send(newBlock.value)
})
// block 채굴

app.post('/addToPeer', (req, res) => {
    const { peer } = req.body
    ws.connectToPeer(peer)
})

app.listen(3000, () => {
    console.log('server run 3000')
})

ws.listen()