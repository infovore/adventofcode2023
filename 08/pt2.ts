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

let starts = network.filter(({source,routes}) => source.match(/..A/))
let factors:number[] = []


starts.forEach(({ source, routes }, i) => {
  let routingIndex = 0;
  let stepCount = 0;

  let current = source;
  let currentEntry = network.find((n) => n.source == current);

  while (current.match(/..[^Z]/)) {
    const routeToTake = routing[routingIndex];
    current = currentEntry.routes[routeToTake];
    console.log(current);
    currentEntry = network.find((n) => n.source == current);
    stepCount++;
    routingIndex = stepCount % routing.length;
  }
  console.log("Complete", i);
  factors.push(stepCount);
});

const gcd = (a:number,b:number) => {
  if(b == 0) {
    return a
  }
  return gcd(b,a%b)
}

const lcm = (a:number,b:number) => {
  return a*b / gcd(a,b)
}

const lcmlist = (nums:number[]) => {
  return nums.reduce((acc,num) => lcm(acc,num),1)
}

console.log(factors)
console.log(lcmlist(factors))
