import * as fs from 'fs';
import { sum } from '../lib/util';

if (process.argv.length < 3) {
  console.log('Please provide a file path');
  process.exit(1);
}

const filePath = process.argv[2]; // Assuming the file path is passed as the first command line argument
const lines = fs.readFileSync(filePath).toString().split('\n');

const games = lines.map(line => {
  const [title,game] = line.split(":").map(s => s.trim())
  const [winning, entry] = game.split("|").map(s => s.trim()).map(s => s.split(/\s+/).map(n => parseInt(n)))
  // crap language doesn't le met do this
  // const intersection = winning & entry;

  const intersection = entry.filter(n => winning.includes(n))
  let score = 0;
  if(intersection.length > 0) score = Math.pow(2, intersection.length - 1)

  return {
    winning,
    entry,
    intersection,
    score
  }
})

console.log("Games score: ", sum(games.map(g => g.score)))
