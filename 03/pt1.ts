import * as fs from 'fs';
import kleur from 'kleur';

if (process.argv.length < 3) {
  console.log('Please provide a file path');
  process.exit(1);
}

const filePath = process.argv[2]; // Assuming the file path is passed as the first command line argument

const schematic = fs.readFileSync(filePath)
                    .toString()
                    .split('\n')
                    .map(line => line.split(''))            

type Cell = {
  content: string;
  x: number;
  y: number;
  isPart: boolean;
  hasPartNumber: boolean;
}

schematic.forEach((row, y) => {
  row.forEach((cell, x) => {
    const isPart = !!cell.match(/[^\d\.]/)
    // const hasPartNumber = isPart && (
      // (schematic[y-1]?.[x] === ' ') ||
      // (schematic[y+1]?.[x] === ' ') ||
      // (schematic[y][x-1] === ' ') ||
      // (schematic[y][x+1] === ' ')
    // )
    const c: Cell = {
      content: cell,
      x,
      y,
      isPart,
      hasPartNumber: false
    }
    if(c.isPart) {
      if(c.hasPartNumber) {
        process.stdout.write(kleur.green(c.content))
      } else {
        process.stdout.write(kleur.red(c.content))
      }
    } else {
      process.stdout.write(kleur.dim(c.content))
    }
  })
  process.stdout.write('\n')
})
