import functions from "./functions/functions.ts";
import { CardColor } from "./enums/CardColor.ts";
import { carte } from "./types/carte.ts";
import Game from "./interfaces/Game.ts";
import { GameSate } from "./enums/GameState.ts";

var cards: carte[] = [];
cards.push({name : "Coeur", value: 10, color: CardColor.black});
cards.push({name : "Treffle", value: 10, color: CardColor.black});
cards.push({name: "Txek", value: 25, color: CardColor.red});


const player1 = { name: "Jake", points: 10, deck : ["2", "Couronne", "Reverse", "9", "8", "7"] }
const player2 = { name: "Jason", points: 10, deck : ["2", "cc", "Reverse", "10", "8", "15"] }
const player3 = { name: "Jacob", points: 10, deck : ["5", "Couronne", "Reverse", "9", "8", "7"] }
const player4 = { name: "Jarod", points: 10, deck : ["2", "Couronne", "Reverse", "20", "0", "2"] }

let game = Game.createGame("xids", [player1, player2, player3, player4], GameSate.Waiting);

// console.log(functions.countDeck(player1));
console.log(game);
console.log(Game.countGame(game));



