import * as fs from 'fs';
import { sum } from '../lib/util';

if (process.argv.length < 3) {
  console.log('Please provide a file path');
  process.exit(1);
}

const filePath = process.argv[2]; // Assuming the file path is passed as the first command line argument
const [r,n] = fs.readFileSync(filePath)
                .toString()
                .split("\n\n")
                .map(l => l.trim())

const routing = r.split("").map(n => n == "R" ? 1 : 0)
const network = n.split("\n").map(l => {
  const [source,last] = l.split(" = ");
  const routes = last.replace(/[\(\)]/g, "").split(",").map(r => r.trim())
  return {
    source,
    routes
  }
})

// console.log(routing,network)

let current = 'AAA'
let routingIndex = 0;
let currentEntry = network.find(n => n.source == current)
let stepCount = 0;

console.log(currentEntry)

if(!currentEntry) {
  throw new Error("impossible route, current Entry not found")
}

while(current != 'ZZZ') {
  const routeToTake = routing[routingIndex]
  current = currentEntry.routes[routeToTake]
  console.log(current)
  currentEntry = network.find(n => n.source == current)
  stepCount++;
  routingIndex = stepCount % routing.length
}

console.log(stepCount)

