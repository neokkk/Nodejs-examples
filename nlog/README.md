## nlog - memo
<br>
### Screenshots
<img src="https://user-images.githubusercontent.com/35194760/58231089-0cbcff80-7d71-11e9-81ca-8f3678b56eec.png" width="100%">
<br>

- 메인 화면 (template.ejs)
  <br>

  > 수정 데이터가 없으면 form.ejs, 있으면 form_update.ejs
  > 게시물 목록이 있으면 (result.length !== 0) -> list 출력
  > <br>

- 메모 생성 (/create)
  <br>

  > form submit하면 memo_text, memo_id, memo_date를 list.ejs로 전달 후 출력
  > modify, delete 버튼에 memo_id 삽입
  > db에 insert
  > 메인 화면으로 redirect
  > <br>

- 메모 수정 (/modify/:id) (/update)
  <br>

  > id가 같은 튜플 값만 전달
  > update 버튼 클릭 시 db 업데이트 및 메인 화면으로 redirect
  > <br>

- 메모 삭제 (/delete/:id)
  <br>
  > id가 같은 튜플 삭제
  > id 업데이트
  > 메인 화면으로 redirect

<br>
<br>

### 업데이트 할 것 (블로그와 연동하면서 기능 추가하자)

- 회원가입 및 로그인 (깃헙 등 타 사이트 연동도 해보기)
- 프로필 설정 및 수정
- 페이징 처리
- 검색 및 해시태그 기능
