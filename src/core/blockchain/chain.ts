import { Block } from "@core/blockchain/block"
import { DIFFICULTY_ADJUSTMENT_INTERVAL } from "@core/config"

export class Chain {
    public blockchain:Block[]

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
}
