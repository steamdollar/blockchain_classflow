// genesis block configure
export const GENESIS: IBlock = {
    version: '1.0.0',
    height: 0,
    hash: '0'.repeat(64),
    timestamp: 1231006506,
    previousHash: '0'.repeat(64),
    merkleRoot: '0'.repeat(64),
    nonce : 0,
    difficulty : 0,
    data: ['Hello Block'],
}

// 난이도 측정 블록 수 n개 단위로 난이도 측정
export const DIFFICULTY_ADJUSTMENT_INTERVAL : number = 10

// 블럭 생성 시간
export const BLOCK_GENERATION_INTERVAL : number = 10
// timestamp 값의 차이를 넣어주면 된다. 10은 걍 아무거나 넣은거고..
// n 번 블럭 timestamp - (n-10)번 블럭 timestamp
// 이 값이 생각보다 크면 난이도 상승, vice versa 

// block 하나가 생성되는 시간 (이 값이 목표치임, 실제 걸리는 시간이 아니라)
// export const BLOCK_GENERATION_TIME : number = 60
export const UNIT : number = 60