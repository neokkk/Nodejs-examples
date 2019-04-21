// function a() {
//     console.log('A');
// }

const a = function() {
    console.log('A');
}

function showfunc(callback) {
    callback();
}

showfunc(a);