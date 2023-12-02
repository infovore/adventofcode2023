import * as fs from 'fs';
import * as readline from 'readline';

const filePath = process.argv[2]; // Assuming the file path is passed as the first command line argument

if (!filePath) {
  console.log('Please provide a file path');
  process.exit(1);
}

// have to use lookahead to deal with overlapping groups
const matchRegex = /(?=(one|two|three|four|five|six|seven|eight|nine|\d))/ig

const strToNum = (char: string) => {
  if(char.match(/\d/)) return parseInt(char);
  const numbers = ['zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine']
  return numbers.indexOf(char)
}

async function processLineByLine() {
  const fileStream = fs.createReadStream(filePath);
  let total = 0;

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity,
  });
  // Note: we use the crlfDelay option to recognize all instances of CR LF
  // ('\r\n') in input.txt as a single line break.

  rl.on('line', (line: string) => {
    let num = 0;

    const numChars = [...line.matchAll(matchRegex)].map(matchArray => matchArray[1])

    if(!numChars || numChars.length < 1) return;

    if (numChars.length < 2) {
      const n = strToNum(numChars[0]);
      num = parseInt(`${n}${n}`);
    } else {
      const n1 = strToNum(numChars[0])
      const n2 = strToNum(numChars.slice(-1)[0])
      num = parseInt(`${n1}${n2}`);
    }
    total += num;
  });

  rl.on("close", () => {
    console.log(total)
  })
}

processLineByLine(); 
