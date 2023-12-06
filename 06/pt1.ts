import * as fs from 'fs';
import { sum } from '../lib/util';

if (process.argv.length < 3) {
  console.log('Please provide a file path');
  process.exit(1);
}

const filePath = process.argv[2]; // Assuming the file path is passed as the first command line argument
const [timeString, distanceString] = fs.readFileSync(filePath).toString().split('\n');

const times = timeString.split(/\s+/).filter(n => n.match(/\d+/)).map(n => parseInt(n, 10))
const distances = distanceString.split(/\s+/).filter(n => n.match(/\d+/)).map(n => parseInt(n, 10))


const output = times.map((timeLimit,i) => {
  const minDistance = distances[i];
  // const results = [...Array.from(Array(timeLimit))]
    // console.log(results)
  const results = [...Array.from(Array(timeLimit))].map((_,s) => {
    const t = timeLimit - s;
    // console.log(t,s)
    return s*t;
  })
  return results.filter(r => r > minDistance).length
}).reduce((a,b) => a*b,1)

console.log(output)
