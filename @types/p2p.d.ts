declare enum MessageType {
    latest_block = 0
}

declare interface Message {
    type : MessageType
    payload : any,
}



/* 
const a: Message ={ 
    안에 반드시 type, data가 들어가야함.    
}

const a : Message = {
    type : MessageType.latest_block,
    data: 'asdq'
}
*/