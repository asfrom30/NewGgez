​
# Complete Task

- [x] Crawl Speed 적용하기
- [x] cron-server 배포 파이프라인 
    1. dist folder에 gulp로 만들어진다.
    1. filezilla. ftp로 파일을전송한다.
    1. 전송이 완료되면 pm2 명령어를 실행한다. or restart한다.
- [x] bug fix below
    * ~~.pm2 dist폴더러도 안옮겨지고 linux로도 안옮겨짐... 포함 pattern 삽입할것.~~
    * ~~npm install, npm running test in linux~~
    * ~~'bluehost:clean:cron'~~
    * ~~dist path variable로 만들기..~~
- [x] check cron working properly in bluehost.
- [x] .ssh폴더만들기 & private key 추가
    * gulp dist:bluehost:test
    * gulp run:bluehost:test
- [x] cron server shell로 옮겨서 production 모드에서 동작하게 할것...


# 20171231
- [x] cron에서 입력할때 오늘 데이터 뿐만이 아니라 current에도 입력할것.
- [x] server and angular auto deploy 설정할것...
    * 되는지 테스트해볼것...
- [x] mail로 상태 받아오기... slack이나..
- [x] 해당 파일을 json으로 dump해서 내 home서버에 저장하기...
- [x] pm2 directory not moved...

# 20180101
- [x] deploy되지 않음 angular model...
- [x] ~~'remote:bluehost:clean:cron' 동작확인~~
- [x] without asset
- [x] api dum

# Server Task
# Cron Task
- [x] Crawl Speed 측정
- [x] Crawl Speed 설정해서 동작

## Webpack setting

# Develop
- [x] 헤더 쪽 추천, 랜덤파도타기
- [x] 최근전적 갱신하기
- [x] 서머리수정하기
- [x] 친구전적검색
- [x] 히어로 셀렉터쪽 만들기

- [x] cron-server
    * dev mode에서도 전체 크롤링을 하지만.. dev mode에서는 50개만 샘플로 던져보고 사용자 입력을 받아서진행할지... sample reduce function chceker를 만들어서 시스템이 안떨어지게 할것.
    * crawling-time 구현하기 (크롤스피드가 얼마나 되었느는지 3.4s/player)
    * server cron 기능 추가.
		: 몇명 크롤링 완료했는지 슬랙으로 푸쉬 혹은 이메일
		: 크롤링할때 log 시간나오게 할것.
	* daily data를 일괄로 받아서 내 서버에 저장하는 기능 만들기...

## Deploy
- [x] set node and mongodb in bluehost
- [x] make simple index.html. using filezilla
- [x] deploy pipeline
- [x] cron server speed x5
- [x] client측 port dev mode vs prod mode
- [x] router check
    * index.html 올려보기
    * angular module 올려보기
- [x] deploy pipe line 구축할것(배포 자동화.)
- [x] npm script에 pm2 적용할것. deploy 모드에서.








