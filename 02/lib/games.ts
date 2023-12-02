export type Draw = {
  red?: number,
  blue?: number,
  green?: number
}

export type Game = {
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
  const gameMatches = gameString.match(/\d+/)
  if(!gameMatches || gameMatches.length == 0) throw new Error(`Invalid game string: ${gameString}`)

  const game = parseInt(gameMatches[0])
  const draws = parseDraws(drawsString)

  return {
    game,
    draws
  } 
}

export const parseLines = (lines: string[]) => {
  return lines.map(l => parseLine(l))
}

export const filterGames = (games: Game[], parameters:Draw) => {
  return games.filter(game => {
    const redDraws = game.draws.map(draw => draw.red).filter(Boolean)
    const greenDraws = game.draws.map(draw => draw.green).filter(Boolean)
    const blueDraws = game.draws.map(draw => draw.blue).filter(Boolean)

    if(redDraws.find(d => d && parameters.red && d > parameters.red)) return false;
    if(greenDraws.find(d => d && parameters.green && d > parameters.green)) return false;
    if(blueDraws.find(d => d && parameters.blue && d > parameters.blue)) return false;

    return true;
  })
}
