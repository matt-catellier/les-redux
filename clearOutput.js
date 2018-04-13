const fs = require('fs');
const path = require('path');

const clearOutput = () => {
  const directory = __dirname + '/output'
  fs.readdir(directory, (err, files) => {
    if (err) throw err;

    for (const file of files) {
      fs.unlink(path.join(directory, file), err => {
        if (err) throw err;
      });
    }
  });
};

module.exports = clearOutput;

