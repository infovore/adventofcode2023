import * as fs from 'fs';
import { parseLines, filterGames } from './lib/games'
import { sum } from '../lib/util';

if (process.argv.length < 3) {
  console.log('Please provide a file path');
  process.exit(1);
}

const filePath = process.argv[2]; // Assuming the file path is passed as the first command line argument
const lines = fs.readFileSync(filePath).toString().split('\n');

const gameData = parseLines(lines)
const matchingGames = filterGames(gameData, {red: 12, green: 13, blue: 14})
// console.log(matchingGames)

const output = sum(matchingGames.map(g => g.game))

console.log(output)
