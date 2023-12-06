import * as fs from 'fs';
import { product } from '../lib/util';

if (process.argv.length < 3) {
  console.log('Please provide a file path');
  process.exit(1);
}

const filePath = process.argv[2]; // Assuming the file path is passed as the first command line argument
const [timeString, distanceString] = fs.readFileSync(filePath).toString().split('\n');

const times = [timeString.split("").filter(n => n.match(/\d/)).join("")].map(n => parseInt(n, 10))
const distances = [distanceString.split("").filter(n => n.match(/\d/)).join("")].map(n => parseInt(n, 10))


const output = times.map((timeLimit,i) => {
  const minDistance = distances[i];
  const n = timeLimit % 2=== 0 ? timeLimit/2 +1 : timeLimit/2
  const results = [...Array.from(Array(Math.round(n)))].map((_,s) => {
    const t = timeLimit - s;
    return s*t;
  })
  const offset = timeLimit % 2 === 0 ? 1 : 0
  return results.filter(r => r > minDistance).length * 2 - offset
})

console.log(product(output))
