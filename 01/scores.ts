import * as fs from 'fs';
import * as readline from 'readline';

if (process.argv.length < 3) {
  console.log('Please provide a file path');
  process.exit(1);
}

const filePath = process.argv[2]; // Assuming the file path is passed as the first command line argument

const readInterface = readline.createInterface({
  input: fs.createReadStream(filePath),
  output: process.stdout,
  terminal: false
});

let total = 0;

const lines = fs.readFileSync(filePath).toString().split("\n");
lines.forEach((line) => {
  // Process each line here
  console.log(line);
  const numChars = line.split("").filter(c => c.match(/\d/))
  console.log(numChars)
  if(numChars.length < 1) {
    return;
  }
  if(numChars.length < 2) {
    const num = parseInt(`${numChars[0]}${numChars[0]}`)
    console.log(num)
    total += num;
    return;
  }
  const num = parseInt(`${numChars.slice(0,1)}${numChars.slice(-1)}`)
  console.log(num)
  total += num;
});

console.log(total)
