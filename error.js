// try ... catch 문으로 잡지 못한 에러 한번에 처리
process.on("uncaughtException", (err) => {
    console.error("예기치 못한 에러", err);
})

setInterval(() => {
    throw new Error("서버를 고장내주마");
}, 1000);

setTimeout(() => {
    console.log("실행됩니다.");
}, 2000);