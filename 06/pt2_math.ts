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
  const a = -1;
  const b = timeLimit;
  const c = -distances[i];
  const discriminant = b*b - 4*a*c;
  const r1 = (-b + Math.sqrt(discriminant))/(2*a);
  const r2 = (-b - Math.sqrt(discriminant))/(2*a);
  const delta = (Math.abs(Math.floor(r1)-Math.ceil(r2)))-1;

  return delta;
})

console.log(product(output))
