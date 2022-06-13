import { SHA256 } from 'crypto-js'
import merkle from 'merkle'
import { BlockHeader } from './blockHeader'
import { BLOCK_GENERATION_INTERVAL, DIFFICULTY_ADJUSTMENT_INTERVAL, GENESIS, UNIT } from "@core/config"

export class Block extends BlockHeader implements IBlock {
    public hash: string
    public merkleRoot: string
    public data: string[]
    public difficulty : number
    public nonce : number

    constructor(_previousBlock: Block, _data : string[], _adjustmentBlock : Block) {
        super(_previousBlock)
        const merkleRoot = Block.getMerkleRoot(_data)
        this.merkleRoot = merkleRoot
        this.hash = Block.createBlockHash(this)
        this.nonce = 0
        this.difficulty = Block.getDifficulty(this, _adjustmentBlock, _previousBlock)
        this.data = _data
    }

    public static getGenesis():Block {
        return GENESIS
    }

    public static getMerkleRoot<T>(_data : T[]):string {
        const merkleTree = merkle('sha256').sync(_data)
        return merkleTree.root() || '0'.repeat(64)
    }

    public static createBlockHash(_block:Block):string {
        const { version, timestamp, merkleRoot, previousHash, height} = _block

        const values: string = `${version}${timestamp}${merkleRoot}${previousHash}${height}`
        return SHA256(values).toString()
    }

    // 블록 생성 작업 증명

    public static generateBlock(_previousBlock: Block, _data : string[], _adjustmentBlock : Block): Block {
        const generateBlock = new Block (_previousBlock, _data, _adjustmentBlock)
        const newBlock = Block.findBlock(generateBlock)
        return newBlock
    }

    public static findBlock (_generateBlock : Block) : Block {
        return _generateBlock
    }

    public static getDifficulty(_newBlock : Block, _adjustmentBlock : Block, _previousBlock : Block) : number {
        if(_adjustmentBlock.height === 0 ) return 0
        if(_newBlock.height < 9 ) return 0
        if(_newBlock.height < 19) return 1
        if(_newBlock.height % DIFFICULTY_ADJUSTMENT_INTERVAL !== 0 ) return _previousBlock.difficulty
        
        const timeTaken : number = _newBlock.timestamp - _adjustmentBlock.timestamp
        const timeExpected : number = UNIT * BLOCK_GENERATION_INTERVAL * DIFFICULTY_ADJUSTMENT_INTERVAL // 6000
        
        if( timeTaken < timeExpected / 2 ) return _adjustmentBlock.difficulty + 1
        else if ( timeTaken >= timeExpected * 2 ) return _adjustmentBlock.difficulty - 1
        else return _adjustmentBlock.difficulty
    }

    public static isValidNewBlock(_newBlock:Block, _previouseBlock:Block): Failable <Block, string> {
        if (_previouseBlock.height + 1 !== _newBlock.height) return { isError : true, error: 'block height is different'}
        if (_previouseBlock.hash !== _newBlock.previousHash) return { isError : true, error : 'hash value doesn match'}
        if ( Block.createBlockHash(_newBlock) !== _newBlock.hash ) return { isError : true, error : 'hash value is wrong'}

        return {isError : false, value: _newBlock}
    }
}