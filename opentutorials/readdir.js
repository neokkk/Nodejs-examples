const testFolder = './o_data',
      fs = require('fs');

fs.readdir(testFolder, (err, list) => {
    console.log(list);
});