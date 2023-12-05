import * as fs from 'fs';

if (process.argv.length < 3) {
  console.log('Please provide a file path');
  process.exit(1);
}

const filePath = process.argv[2]; // Assuming the file path is passed as the first command line argument
const fileString = fs.readFileSync(filePath).toString()

const chunks = (fileString.split("\n\n"))

const seeds = chunks.shift()?.split(":")[1].trim().split(" ").map(n => parseInt(n));

const maps = chunks.map(m => m.split(":")[1].trim().split("\n").map(l => l.trim().split(" ").map(n => parseInt(n))))

const remap = (n: number, map: number[][]) => {
  // range is [dest,source,len]
  for(let i = 0; i < map.length; i++) { 
    const [dest,source,len] = map[i]
    if(n >= source && n <= source + len) {
      return dest + (n - source)
    }
  }
  return n
}

const reducingRemap = (n:number, maps: number[][][]) => {
  return maps.reduce((acc, map) => remap(acc, map), n)
}

// console.log(seeds)
// console.log(maps)

const resultArray = seeds?.map(seed => reducingRemap(seed,maps))

console.log(JSON.stringify(resultArray))


console.log(resultArray, "the minimum of which is",Math.min(...resultArray!))
