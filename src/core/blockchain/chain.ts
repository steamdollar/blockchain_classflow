import { Block } from "@core/blockchain/block"
import { DIFFICULTY_ADJUSTMENT_INTERVAL } from "@core/config"

export class Chain {
    private blockchain:Block[]

    constructor() {
        this.blockchain = [Block.getGenesis()]
    }

    public getChain() : Block[] {
        return this.blockchain
    }

    public getLength() : number {
        return this.blockchain.length
    }

    public getLatestBlock():Block {
        return this.blockchain[ this.blockchain.length - 1 ]
    }

    public addBlock(data :string[]) : Failable<Block, string> {
        const previousBlock = this.getLatestBlock()
        const adjustmentBlock : Block = this.getAdjustmentBlock()
        const newBlock = Block.generateBlock( previousBlock, data, adjustmentBlock )
        const isValid = Block.isValidNewBlock(newBlock, previousBlock)
        
        if(isValid.isError) return { isError : true, error : isValid.error }
        this.blockchain.push(newBlock)
        console.log(newBlock)
        return {isError : false, value : newBlock }
        // 최초 블럭 생성시 애드블럭 함수 호출 > generateBLock 실행 > 
        // 마이닝이 완료된 블럭 > fineblock > 
    }

    public getAdjustmentBlock() {
        const currentLength = this.getLength()
        const adjustmentBlock : Block =
            currentLength < DIFFICULTY_ADJUSTMENT_INTERVAL 
            ? Block.getGenesis()
            : this.blockchain[currentLength - DIFFICULTY_ADJUSTMENT_INTERVAL]
        return adjustmentBlock
    }

    public addToChain ( _receivedBlock : Block) : Failable < undefined, string > {
        // 자주 사용하는 함수는 throw를 사용
        const isValid = Block.isValidNewBlock(_receivedBlock, this.getLatestBlock())
        if ( isValid.isError ) return { isError :true, error : isValid.error }

        this.blockchain.push(_receivedBlock)
        return { isError : false, value : undefined } 
    }

    public isValidChain(_chain : Block[]):Failable<undefined, string> {
        // 제네시스 블럭을 검증하는 코드 필요
        // 블럭에서 만들고 그걸 호출한다. 여기선 스킵
        const genesis = _chain[0]
        // 체인이 그 내용에 문제가 없는지 체크
        for (let i = 1; i <_chain.length; i++ ) {
            const newBlock = _chain[i]
            const previousBlock = _chain [i - 1]
            const isValid = Block.isValidNewBlock(newBlock, previousBlock)
            if( isValid.isError ) return { isError : true, error : isValid.error }
        } 
        return { isError: false, value : undefined }
    }

    replaceChain(receivedChain : Block[]) : Failable<undefined, string> {

        const latestReceivedBlock : Block = receivedChain[receivedChain.length - 1]
        const latestBlock : Block = this.getLatestBlock()

        if( latestReceivedBlock.height === 0 ) {
            return { isError : true, error : ' recent block is genesis' }
        }

        if( latestReceivedBlock.previousHash === latestBlock.hash ) {
            return { isError : true, error : ' one block short' }
        }
        
        if( latestReceivedBlock.height <= latestBlock.height ) {
            return { isError : true, error : 'my current blockchain is longer than received one or at least same' }
        }


        // 이상 3개 조건이 체인을 안바꿔도 되는 경우에 대한 것

        // 이 아래로 chain을 바꿔주는 코드 작성
        this.blockchain = receivedChain

        return { isError : false, value : undefined}
    }
}
