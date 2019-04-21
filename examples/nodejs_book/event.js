const EventEmitter = require("events");

const myEvent = new EventEmitter();

myEvent.addListener("방문", () => {
    console.log("방문해주셔서 감사합니다.");
});
myEvent.on("종료", () => {
    console.log("안녕히 가세요.");
});
myEvent.on("종료", () => {
    console.log("제발 좀 가세요.");
});
myEvent.once("특별이벤트", () => {
    console.log("한 번만 실행됩니다.");
});
// myEvent.emit("방문");
// myEvent.emit("종료");
myEvent.emit("특별이벤트");
myEvent.emit("특별이벤트");

myEvent.on("계속", () => {
    console.log("계속 리스닝");
});
myEvent.removeAllListenters("계속");
myEvent.emit("계속");