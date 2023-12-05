import * as fs from 'fs';

if (process.argv.length < 3) {
  console.log('Please provide a file path');
  process.exit(1);
}

const filePath = process.argv[2]; // Assuming the file path is passed as the first command line argument
const fileString = fs.readFileSync(filePath).toString()

const chunks = (fileString.split("\n\n"))

const seedRangeMatches = chunks.shift()?.split(":")[1].trim().matchAll(/(\d+\s\d+)/ig)
const seedRanges = [...seedRangeMatches!].map(m => m[0].split(" ").map(n => parseInt(n)));

console.log(seedRanges)

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

process.stdout.write("Seeds (this is going to take a while):\n")
const resultArray:number[] = []

seedRanges.forEach(([start,len], j) => {
  for(let i = start; i < start+len; i++) {
    resultArray.push(reducingRemap(i,maps))
  }
})

process.stdout.write("\n")
console.log("the minimum of which is",Math.min(...resultArray!))
