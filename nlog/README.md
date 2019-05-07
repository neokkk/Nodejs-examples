## nlog - memo

- 메인 화면 (template.ejs)
  <br>
  <br>

  > 수정 데이터가 없으면 form.ejs, 있으면 form_update.ejs
  > 게시물 목록이 있으면 (result.length !== 0) -> list 출력

- 메모 생성 (/create)

> form submit하면 memo_text, memo_id, memo_date를 list.ejs로 전달 후 출력
> modify, delete 버튼에 memo_id 삽입
> db에 insert
> 메인 화면으로 redirect

<br>
- 메모 수정 (/modify/:id) (/update)

> id가 같은 튜플 값만 전달
> update 버튼 클릭 시 db 업데이트 및 메인 화면으로 redirect

<br>
- 메모 삭제 (/delete/:id)

> id가 같은 튜플 삭제
> id 업데이트
> 메인 화면으로 redirect
