# 검색버튼있는데, 그냥 onClick 해서 globalSearch 함수를 실행시키는데, 
modifiedData 를 필더링해서 name, email,message 에 맞는 애를 찾는다

그럼 modifiedData 를 보자
dataWithAge를 map 해서 {body, ...item}
해서 ...item 에 key랑 message 를 담는다
결국 item를 modifiedData 에 담아주는데,
item 이 머냐면, fetch 해서 가져온 데이터를 
gridData에 넣고, map으로 돌리고 데이터 age를 추가하고 datawithAage에 담는다.