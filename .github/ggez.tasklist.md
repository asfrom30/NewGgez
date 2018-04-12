# Important
* State problem (ui - route)
    * detail에 들어갔다 나오면
        * infinite-scroll이 다시 처음부터, 맨위로 올라감
        * 정렬이나 검색조건도 모두 사라져버림
* Scroll하면 검색이나 정렬조건은 params에 없기 때문에 다음 페이지 pageIndex++가 안됨
* Freeboard Notice Ajax가 너무 자주 호출됨... app-nav에 있어서, 디테일 들어갈때마다... 로컬에 저장해놔야 할듯.

# Freeboard
* freeboard detail index.html
    * modify : Not yet impl

# User
* close account