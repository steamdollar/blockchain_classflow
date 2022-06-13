업데이트 간격을 10이라고 잡으면 10개 블럭이 생성되는 시간을 타임스탬프 차를 이용해 구한다.
기준을 한 6천초로 맞추고 싶은데 5800이 나왔다? 난이도를 높히던가 별 차이가 없다 싶으면 놔두고..
난이도를 바꾸고 싶으면 difficulty를 높히면 됨.

addblock 함수에서 조건식을 만들자.
addblock 함수의 실행은 아직 만들어지진 않았지만 이제 만들거라는 의미이기 때문.

config.ts에 만들어준 상수들이 그거임..

아무튼 이제 이걸 구현해보자.

1. 생성할 블럭의 높이값을 가져온다.

height = previousBlock.height + 1

2. 10개 전 블럭의 높이?

이건 음수가 나올 수도 있다. > 그럼 블럭이 10개 안된다는거니까 그냥 제네시스 블럭을 바라보게 하면 된다.

그게 ? Block.getGenesis()

10보다 크면 currentLength - interval > 이 높이에 해당하는 Block을 반환한다.

이상의 내용을 가진 함수 getAdjustment를 addBlock에 넣어주면 됨.

//

이제 난이도를 구한다.

timestamp의 차를 구해 10개 블럭의 생성 시간을 이용해 찾을 수 있다.

addBlock 안에는 아직 생성할 블럭에 관한 정보가 없기 떄문에 이 안에서 해결할 수는 없다.

addBlock 함수 내에서 호출한 generateBlock 함수에 인자값을 하나 추가해주면 된다.

_addjustmentBlock 을 매개변수로 추가한다.

+ block.ts로 가서 getDifficulty 함수를 추가한다.

여기서 해야 생성된 블럭의 정보가 존재해서 그걸 가져올 있음

함수를 완성했으면

이걸 constructor의 difficulty에 넣어줘야 하는데, 매개변수 2개가 각각

this, _adjustmentBlock이다.

근데 adjustmentBlock은 매개변수로 넣어주려면 먼저 generate 블럭에 _adjustmentBlock을 넣어야 한다.

여까지 하면 난이도를 구한거..

이제 테스트 해보자.

chain.test.ts

에러 낭ㅁ..

난이도를 바꾸는데는 전 블럭의 난이도 (변화 없을 경우) or adjustmentBlock 의 난이도 + 1 을 가져오면 된다.

//////////////////

0613- 2 

hash는 16진수, 16진수는 2진수랑 관계가 깊다.

16 진수 한 글자 = 4 bit, 두 글자는 8bit = 1 byte

16글자는 32바이트

2진수 0000 ~ 1111 => 16진수 0 ~ F 한글자로 변환이 됨

만약 16진수를 2진수로 바꾸면 무적권 4배의 digit을 가지게 된다.

POW는 hash 값을 통해 앞에 몇개 자릿수가 0으로 채워지는지를 보는거다.

난이도가 1일 때

hash 를 2진수를 바꾸면 첫 1개의 digit이 0인수를 찾는거..

이 사실을 바탕으로 findBlock 함수에 마이닝 관련 코드를 만들어보자.

여기서 do while문이 개입한다.

특정 조건을 만족할때까지 계속 연산을 돌려야 하므로..


