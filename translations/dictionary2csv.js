const fs = require('fs');

const cmdArgs = process.argv.slice(2);
if (cmdArgs.length < 1) throw "not enough arguments";
let rawdata = fs.readFileSync(cmdArgs[0]);
let dictionary = JSON.parse(rawdata);

let result = 'Tag;Original;German;Spanish\n';
for (let i in dictionary) {
  if (dictionary.hasOwnProperty(i)) {
    result += `"${i}";"${dictionary[i]}";;\n`;
  }
}
console.log(result);


// console.log(dictionary);