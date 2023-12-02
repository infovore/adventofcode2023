import * as fs from 'fs';
import { parseLines, minCubesForGame, powerForGame } from './lib/games'

if (process.argv.length < 3) {
  console.log('Please provide a file path');
  process.exit(1);
}

const filePath = process.argv[2]; // Assuming the file path is passed as the first command line argument
const lines = fs.readFileSync(filePath).toString().split('\n');

const gameData = parseLines(lines)
// const matchingGames = filterGames(gameData, {red: 12, green: 13, blue: 14})
// console.log(matchingGames)

const processedGames = gameData.map(g => {
  return {
    ...g,
    minCubes: minCubesForGame(g),
    power: powerForGame(g),
  }
})

// console.log(JSON.stringify(processedGames,null,2))

const output = processedGames.map(g => g.power).reduce((sum, n) => sum+n, 0)
console.log(output)

