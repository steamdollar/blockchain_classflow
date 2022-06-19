// BTC

interface ITxIn {
    txOutId : string,
    txOutIndex : number,
    signature? : any
}

interface ITxOut {
    address: string, // 보내는 사람 주소
    amount : number  // 보내는 코인 갯수
}

interface ITransaction {
    hash : string
    txins : [],
    txouts : ITxOut[]
}
