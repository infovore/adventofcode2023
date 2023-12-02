import * as fs from 'fs';
import * as ohm from 'ohm-js';
import { minCubesForGame, powerForGame } from './lib/games';
import { sum } from '../lib/util';

if (process.argv.length < 3) {
  console.log('Please provide a file path');
  process.exit(1);
}

// this is an Ohm Grammar.
// I much prefer the approach of using a grammar to parse a fixed format,
// rather than just slicing strings or using regex.
// The Grammar can't be used on its own; it needs *Semantics* to be able
// to run operations (in this case, 'process') on a valid Game.

const gameGrammar = ohm.grammar(String.raw`
Games {
  Games = Game+
  Game = "Game " (digit+) ":" Draws+
  Draws = Draw+ "; "?
  Draw = ((digit+) (Color)) ", "?
  Color = "red" | "blue" | "green"    
}
`);

const s = gameGrammar.createSemantics();

s.addOperation('process', {
  _iter(...children) {
    // what to do with a list of Games
    return children.map(c => c.process());
  },
  Game(_g,digit,_sep,draws) {
    return {
      game:(parseInt(digit.sourceString)),
      draws: draws.process()
    }
  },
  Draws(list,_) {
    const processed = list.process()
    const h = {}
    processed.forEach(draw => h[draw[0]] = draw[1])
    return h
  },
  Draw(count,color,_) {
    return [color.sourceString, parseInt(count.sourceString)]
  },
  Color(colorString) {
    return colorString.sourceString
  }
})

const filePath = process.argv[2]; // Assuming the file path is passed as the first command line argument
const lines = fs.readFileSync(filePath).toString()

const matchResult = gameGrammar.match(lines)

if(matchResult.failed()) {
  console.log('Failed to parse input file')
  console.log(matchResult.message)
  process.exit(1)
}

const adapter = s(matchResult);
const gameData = adapter.process()

// gameData should be identical to that in pt2.ts
// console.log(JSON.stringify(gameData,null,2))

const processedGames = gameData.map(game => {
  return {
    ...game,
    minCubes: minCubesForGame(game),
    power: powerForGame(game),
  }
})

// console.log(JSON.stringify(processedGames,null,2))

const output = sum(processedGames.map(g => g.power))
console.log(output)
