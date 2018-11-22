const { URL } = require("url");

const myURL = new URL("http://www.gilbut.co.kr/");
console.log("searchParams : ", myURL.searchParams);

// WHATWG 방식을 이용하는 경우 파라미터 수정, toString 사용 등이 유리
// url.parse 방식은 host name을 생략하는 경우에 사용