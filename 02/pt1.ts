import * as fs from 'fs';

if (process.argv.length < 3) {
  console.log('Please provide a file path');
  process.exit(1);
}

const filePath = process.argv[2]; // Assuming the file path is passed as the first command line argument

const lines = fs.readFileSync(filePath).toString().split('\n');

type Draw = {
  red?: number,
  blue?: number,
  green?: number
}

type Game = {
  game: number,
  draws: Draw[]
}

const parseDraws = (drawsString: string[]):Draw[] => {
  return drawsString.map(drawString => {
    return drawString.split(",").reduce((obj, s) => {
      const [count, color] = s.trim().split(/\s+/)
      return {
        ...obj,
        [color]: parseInt(count)
      }
    }, {})
  })
}

const parseLine = (line: string):Game => {
  // Game 12: 5 red, 4 blue; 1 blue, 8 green, 8 red; 15 green, 5 red, 4 blue
  const [gameString, ...drawsString] = line.split(/[:;]/).map(s => s.trim())

  const game = parseInt(gameString.trim().match(/\d+/)[0])
  const draws = parseDraws(drawsString)

  return {
    game,
    draws
  } 
}

const parseLines = (lines: string[]) => {
  return lines.map(l => parseLine(l))
}

const filterGames = (games: Game[], parameters:Draw) => {
  return games.filter(game => {
    const redDraws = game.draws.map(draw => draw.red).filter(Boolean)
    const greenDraws = game.draws.map(draw => draw.green).filter(Boolean)
    const blueDraws = game.draws.map(draw => draw.blue).filter(Boolean)

    if(parameters.red && redDraws.find(d => d && d > parameters.red)) return false;
    if(parameters.green && greenDraws.find(d => d && d > parameters.green)) return false;
    if(parameters.blue && blueDraws.find(d => d && d > parameters.blue)) return false;

    return true;
  })
}

const gameData = parseLines(lines)
const matchingGames = filterGames(gameData, {red: 12, green: 13, blue: 14})
// console.log(matchingGames)

const output = matchingGames.map(g => g.game).reduce((sum, n) => sum+n, 0)

console.log(output)

