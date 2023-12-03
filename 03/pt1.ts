import * as fs from 'fs';
import kleur from 'kleur';

if (process.argv.length < 3) {
  console.log('Please provide a file path');
  process.exit(1);
}

const filePath = process.argv[2]; // Assuming the file path is passed as the first command line argument

type Cell = {
  content: string;
  x: number;
  y: number;
  isPart: boolean;
  hasPartNumber: boolean;
  isPartNumber: boolean;
  isPartNumberOrigin: boolean;
  partNumber?: number;
}

const schematicToCells = (schematic: string[][]) => {
  return schematic.map((row, y) => {
    return row.map((cell, x) => {
      return {
          content: cell,
          x,
          y,
          isPart: !!cell.match(/[^\d\.]/),
          hasPartNumber: false,
          isPartNumber: false,
          isPartNumberOrigin: false,
          partNumber: undefined,
      } as Cell
    })
  })
}

const schematic = fs.readFileSync(filePath)
                    .toString()
                    .split('\n')
                    .map(line => line.split('')) 

const schematicCells = schematicToCells(schematic);

schematicCells.forEach((row, y) => {
  row.forEach((cell, x) => {
    let hasPartNumber = false
    for(let offsetX = -1; offsetX <= 1; offsetX++) {
      if(x + offsetX < 0) continue;
      if(x + offsetX >= row.length) continue;

      for(let offsetY = -1; offsetY <= 1; offsetY++) {
        if(y + offsetY < 0) continue;
        if(y + offsetY >= schematicCells.length) continue;

        const neighbour = schematicCells[y+offsetY][x+offsetX]

        if(cell.isPart && neighbour.content.match(/\d/)) {
          cell.hasPartNumber = true
          neighbour.isPartNumber = true
          let numString = neighbour.content
          let neighbourOffset = 1
          while(x+offsetX+neighbourOffset < row.length && schematicCells[y+offsetY][x+offsetX+neighbourOffset].content.match(/\d/)) {
            schematicCells[y+offsetY][x+offsetX+neighbourOffset].isPartNumber = true
            numString += schematicCells[y+offsetY][x+offsetX+neighbourOffset].content
            neighbourOffset++
          }
          neighbourOffset = -1
          while(x+offsetX+neighbourOffset >= 0 && schematicCells[y+offsetY][x+offsetX+neighbourOffset].content.match(/\d/)) {
            schematicCells[y+offsetY][x+offsetX+neighbourOffset].isPartNumber = true
            numString = schematicCells[y+offsetY][x+offsetX+neighbourOffset].content + numString
            neighbourOffset--
          }
          if(schematicCells[y+offsetY][x+offsetX+neighbourOffset]) {
            schematicCells[y+offsetY][x+offsetX+neighbourOffset+1].isPartNumberOrigin = true
            schematicCells[y+offsetY][x+offsetX+neighbourOffset+1].partNumber = parseInt(numString)
          }
        }
      }
    }
  })
})

const drawSchematic = (cells: Cell[][]) => {
  cells.forEach((row, y) => {
    row.forEach((cell, x) => {
      if(cell.isPart) {
        if(cell.hasPartNumber) {
          process.stdout.write(kleur.green(cell.content))
        } else {
          process.stdout.write(kleur.red(cell.content))
        }
      } else if(cell.isPartNumberOrigin) {
        process.stdout.write(kleur.blue(cell.content))
      } else if(cell.isPartNumber) {
        process.stdout.write(kleur.yellow(cell.content))
      } else {
        process.stdout.write(kleur.dim(cell.content))
      }
    })
    process.stdout.write('\n')
  })
}
drawSchematic(schematicCells);
