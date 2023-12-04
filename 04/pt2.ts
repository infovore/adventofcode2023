import * as fs from 'fs';
import { sum } from '../lib/util';

if (process.argv.length < 3) {
  console.log('Please provide a file path');
  process.exit(1);
}

const filePath = process.argv[2]; // Assuming the file path is passed as the first command line argument
const lines = fs.readFileSync(filePath).toString().split('\n');

const cards = lines.map(line => {
  const [title,game] = line.split(":").map(s => s.trim())
  const [winning, entry] = game.split("|")
                               .map(s => s.trim())
                               .map(s => s.split(/\s+/)
                               .map(n => parseInt(n)))

  const matches = entry.filter(n => winning.includes(n)).length

  return {
    winning,
    entry,
    matches,
    instances: 1
  }
})

cards.forEach((card, i) => {
  for(let j = 0; j < card.instances; j++) {
    for(let k = 0; k < card.matches; k++) {
      const nextIndex = i+k+1
      if(cards[nextIndex]) {
        cards[nextIndex].instances++
      }
    }
  }
})

console.log("Card instances: ", sum(cards.map(g => g.instances)))
