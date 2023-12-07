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
const cardRanks = ["J", "2", "3", "4", "5", "6", "7", "8", "9", "T", "Q","K", "A"]
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
    const jokerCount = scoreObj["J"] || 0
    delete(scoreObj["J"])
    let score = Object.values(scoreObj)
                        .sort((a,b) => b-a)
                        .map((v,i) => i == 0 ? v+jokerCount : v)
                        .join("")
    // goddamn edge cases
    if(jokerCount == 5) {
      // basically: if there are 5 jokers, they count
      // as the weakest five-of-a-kind, because otherwise
      // they try to boost the score of no other cards.
      score = "5"
    }
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

rankedHands.reverse().forEach(h => console.log(`${h.cards.join("")} ${h.bid}`))
console.log(sum(rankedHands.map(h => h.finalRank*h.bid)))
