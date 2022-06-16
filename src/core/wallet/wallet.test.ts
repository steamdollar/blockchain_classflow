import { randomBytes } from "crypto";
import elliptic from 'elliptic'
import { SHA256 } from 'crypto-js'


const ec = new elliptic.ec('secp256k1')

describe('지갑이해하기', () => {
    let privKey : string, pubKey : string , signature : elliptic.ec.Signature
    it('privateKey', () => {
        privKey = randomBytes(32).toString('hex')
        // console.log(privKey.length) // 64

    })

    it('create public key', () => {
        const keyPair = ec.keyFromPrivate(privKey)
        pubKey = keyPair.getPublic().encode('hex', true)
        console.log(pubKey)

    })

    it('digital sig', () => {
        // 서명 만들 떄 필요한 값
        // 개인키 ,해시 값 (tx hash)
        //
        const keyPair = ec.keyFromPrivate(privKey)
        const hash = SHA256('txhash').toString()

        // ec.sign(keyPair, hash) 아랫줄과 동일 의미
        // console.log(keyPair.sign(hash,'hex'))
        signature = keyPair.sign(hash, 'hex') 
        // 얘를 서버가 전송한다. 이를 다시 개인키로 바꾸는건 불가능함
        // 서버는 받은 hash를 가지고 publickey와 함께 사용해 맞는 해시인지 확인 가능 (타원 곡선 알고리즘에 의해)
        // 
    })

    it(' sig verify', () => {
        // sig, hash, public key
        const hash = 'txhash'
        const verify = ec.verify(hash, signature, ec.keyFromPublic(pubKey, 'hex'))
    })
    // 이 검증은 블록체인 안에 있어야 한다.

    it('create account', () => {
        const buffer = Buffer.from(pubKey)
        const address = buffer.slice(26).toString()
        console.log(address)
    })
})