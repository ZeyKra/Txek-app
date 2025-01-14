import { GameSate } from "../enums/GameState.ts";
import { txekPlayer } from "./txekPlayer.ts";
import functions from "../functions/functions.ts";

export interface Game {
    Id : string,
    players : txekPlayer[]
    state : GameSate
    round : number
}

function createGame(Id : string, players : txekPlayer[], state : GameSate) : Game {
    let game : Game = { Id : Id, players : players, state: state, round : 0}
    return game;
}

function countGame(game: Game) : number[] {
    console.time('bench-countGame');
    let game_points : number[] = [];
    game.players.map((player, i) => {
        console.time(`bench-${i}`);
        game_points.push(functions.countDeck(player));
        console.timeEnd(`bench-${i}`);
    })
    console.timeEnd('bench-countGame');
    return game_points
} 

export default { createGame, countGame }
