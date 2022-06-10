import { Block } from '@core/blockchain/block'
describe('Block 검증', () => {
    /**
     * 어차핀 제네시스블럭은 하드코딩한 값이다.
     */
    let newBlock:Block 
    
    let genesisBlock: Block = {
        version: '1.0.0',
        height: 0,
        hash: '0'.repeat(64),
        timestamp: 1231006506,
        previousHash: '0'.repeat(64),
        merkleRoot: '0'.repeat(64),
        data: ['Hello Block'],
    }
    it('블록생성', () => {
        const data = ['Block #2']
        newBlock = new Block(genesisBlock, data)
        const newBlock2 = new Block(newBlock, data)

        console.log(newBlock)
        console.log(newBlock2)
    })

    it('block confirmation', () => {
        // const isValidBlock = Block.isValidNewBlock(newBlock, genesisBlock)
        // console.log(isValidBlock)
        try {
            const isValidBlock = Block.isValidNewBlock(newBlock, genesisBlock)
            if(isValidBlock.isError) throw new Error(isValidBlock.error)
            console.log(isValidBlock.value)
            expect (isValidBlock.isError).toBe(false)
        }
        catch (e) {
            if (e instanceof Error) console.error(e.message)
            expect(false).toBe(true)
        }
    })
})
