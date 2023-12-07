import * as fs from 'fs';
import { sum } from '../lib/util';

if (process.argv.length < 3) {
  console.log('Please provide a file path');
  process.exit(1);
}

type Hand = {
  originalCards: string;
  cards: string[];
  bid: number;
  score?: any;
  rank?: number;
}
const cardRanks = ["2", "3", "4", "5", "6", "7", "8", "9", "T", "J", "Q","K", "A"]
const scoreRanks = [
  "11111",
  "2111",
  "221",
  "311",
  "32",
  "41",
  "5"
]

const filePath = process.argv[2]; // Assuming the file path is passed as the first command line argument
const hands = fs.readFileSync(filePath)
                .toString()
                .split('\n')
                .map(hand => {
                  const [c,b] = hand.trim().split(' ')
                  const bid = parseInt(b,10)
                  const cards = c.split('')
                  return {cards,bid}
                })
              
const scoreHands = (hands:Hand[]) => {
  return hands.map(({cards,bid}) => {  
    const scoreObj = cards.reduce((acc,card) => {
      Object.keys(acc).includes(card) ? acc[card] += 1 : acc[card] = 1
      return acc
    },{})
    const score = Object.values(scoreObj).sort((a,b) => b-a).join("")
    return {cards,bid,score}
  })
}

const rankHands = (scoredHands:Hand[]) => {
  return scoredHands.map((h) => {
    return {...h, rank: scoreRanks.indexOf(h.score) }
  }).sort((a,b) => {
    let r = a.rank - b.rank
    let i = 0;
    while(r==0) {
      r = cardRanks.indexOf(a.cards[i]) - cardRanks.indexOf(b.cards[i])
      i++;
    }
    return r
  }).map((h,i) => ({...h, finalRank:i+1}))
}

const scoredHands = scoreHands(hands);
const rankedHands = rankHands(scoredHands);

console.log(sum(rankedHands.map(h => h.finalRank*h.bid)))
