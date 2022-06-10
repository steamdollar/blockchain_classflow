import { Block } from '@core/blockchain/block'
import { GENESIS } from '@core/config'

describe('Block 검증', () => {
    /**
     * 어차핀 제네시스블럭은 하드코딩한 값이다.
     */
    let newBlock:Block 

    
    it('블록생성', () => {
        const data = ['Block #2']
        // newBlock = new Block(genesisBlock, data)
        newBlock = Block.generateBlock(GENESIS, data)
        const newBlock2 = new Block(newBlock, data)

        console.log(newBlock)
        console.log(newBlock2)
    })

    it('block confirmation', () => {
        // const isValidBlock = Block.isValidNewBlock(newBlock, genesisBlock)
        // console.log(isValidBlock)
        // try {
        //     const isValidBlock = Block.isValidNewBlock(newBlock, genesisBlock)
        //     if(isValidBlock.isError) throw new Error(isValidBlock.error)
        //     console.log(isValidBlock.value)
        //     expect (isValidBlock.isError).toBe(false)
        // }
        // catch (e) {
        //     if (e instanceof Error) console.error(e.message)
        //     expect(false).toBe(true)
        // }
        const isValidBlock = Block.isValidNewBlock(newBlock, GENESIS)

        if( isValidBlock.isError) {
            console.error(isValidBlock.error)
            return expect(true).toBe(false)
        }
        expect(isValidBlock.isError).toBe(false)
    })

})
