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
    // 블럭 갯수 구하기

    public getLatestBlock():Block {
        return this.blockchain[ this.blockchain.length - 1 ]
    }
    // 최신 블럭

    public addBlock(data :string[]) : Failable<Block, string> {
        // true라면 블럭체인 (배열)에 블럭을 푸시해 넣어줌.
        const previousBlock = this.getLatestBlock()
        const newBlock = Block.generateBlock(previousBlock,data)
        const isValid = Block.isValidNewBlock(newBlock, previousBlock)
        
        if(isValid.isError) return { isError : true, error : isValid.error }
        this.blockchain.push(newBlock)
        return {isError : false, value : newBlock }
        // 최초 블럭 생성시 애드블럭 함수 호출 > generateBLock 실행 > 
        // 마이닝이 완료된 블럭 > fineblock > 
    }

    public getAdjustmentBlock() {
        // block의 interval ( 난이도 측정 단위)를 상수로 일단 만들어보자.
        // 최신 블럭 - 10 (최소 제네시스 블럭)
        const currentLength = this.getLength()
        const adjustmentBlock : Block =
            currentLength < DIFFICULTY_ADJUSTMENT_INTERVAL ? Block.getGenesis()
            : this.blockchain[currentLength - DIFFICULTY_ADJUSTMENT_INTERVAL]
        return adjustmentBlock
    }
}

// chain은 static을 잘 안 씀. instance도 여러 개 필요없다.
// 