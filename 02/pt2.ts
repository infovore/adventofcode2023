import * as fs from 'fs';
import { parseLines, minCubesForGame, powerForGame } from './lib/games'

if (process.argv.length < 3) {
  console.log('Please provide a file path');
  process.exit(1);
}

const filePath = process.argv[2]; // Assuming the file path is passed as the first command line argument
const lines = fs.readFileSync(filePath).toString().split('\n');

const gameData = parseLines(lines)

const processedGames = gameData.map(game => {
  return {
    ...game,
    minCubes: minCubesForGame(game),
    power: powerForGame(game),
  }
})

// console.log(JSON.stringify(processedGames,null,2))

const output = processedGames.map(g => g.power).reduce((sum, n) => sum+n, 0)
console.log(output)

