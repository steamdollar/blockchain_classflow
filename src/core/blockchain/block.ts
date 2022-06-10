import { SHA256 } from 'crypto-js'
import merkle from 'merkle'
import { BlockHeader } from './blockHeader'

export class Block extends BlockHeader implements IBlock {
    public hash: string
    public merkleRoot: string
    public data: string[]

    constructor(_previousBlock: Block, _data : string[]) {
        // this : { }
        super(_previousBlock)
        // this : { previouBlock 속성값을 상속받아 채움}
        const merkleRoot = Block.getMerkleRoot(_data)
        this.merkleRoot = merkleRoot
        // 여기까지 채운 this를 getMerkleRoot의 인자값으로 준다.
        this.hash = Block.createBlockHash(this)
        // = 지금까지 만든 이 객체를 넘겨준다
        this.data = _data
    }

    public static getMerkleRoot<T>(_data : T[]):string {
        const merkleTree = merkle('sha256').sync(_data)
        return merkleTree.root() || '0'.repeat(64)
    }

    public static createBlockHash(_block:Block):string {
        // { data, hash, ...rest} : Block << 이렇게 매개변수에 줘도 된다.
        // { version, timetstamp, merkleRoot, previoushash, height }

        // let block2:object = {
        //     version : _block.version,
        //     timestamp : _block.timestamp,
        //     height: _block.height,
        //     previousHash : _block.previousHash,
        //     merkelRoot : _block.merkleRoot
        // }
        const { version, timestamp, merkleRoot, previousHash, height} = _block

        const values: string = `${version}${timestamp}${merkleRoot}${previousHash}${height}`
        return SHA256(values).toString()
    }

    public static isValidNewBlock(_newBlock:Block, _previouseBlock:Block): Failable <Block, string> {
        // Failable : 에러가 없으면 Block, 있으면 string
        // 1. 이전블럭 height + 1  === new Block의 height ? 
        // 2. 이전블럭 해시값 === 현재블럭.이전블럭해시 값 ?
        // 3. _newBlock의 속성들을 가져와 hash 새로 생성 === _newBlock의 hash ? 
        if (_previouseBlock.height + 1 !== _newBlock.height) return { isError : true, error: 'block height is different'}
        if (_previouseBlock.hash !== _newBlock.previousHash) return { isError : true, error : 'hash value doesn match'}
        if ( Block.createBlockHash(_newBlock) !== _newBlock.hash ) {
            console.log(Block.createBlockHash(_newBlock))
            console.log(_newBlock.hash)
            return { isError : true, error : 'hash value is wrong'}
        }
        return {isError : false, value: _newBlock}
    }
}

/*
 hash = version + timestamp + height + previousHash + merkleRoot  
*/