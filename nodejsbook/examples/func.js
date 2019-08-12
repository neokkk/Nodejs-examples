const { odd, even } = require('./var.js');

function checkOddOrEven(num){
    if(num % 2)
        return odd;
    else
        return even;
}

module.exports = checkOddOrEven;