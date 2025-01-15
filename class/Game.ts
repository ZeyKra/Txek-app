import { GameSate } from "../enums/GameState.ts";
import { txekPlayer } from "../interfaces/txekPlayer.ts";
import functions from "../functions/functions.ts";

export class Game {
    id : string;
    players : txekPlayer[];
    state : GameSate;
    round : number;

    constructor(id: string, players : txekPlayer[], state: GameSate) {
        this.id = id;
        this.players = players;
        this.state = state;
    }

    countGame() : number[] {
        console.time('bench-countGame');
        let game_points : number[] = [];
        this.players.map((player, i) => {
            console.time(`bench-${i}`);
            game_points.push(functions.countDeck(player));
            console.timeEnd(`bench-${i}`);
        })
        console.timeEnd('bench-countGame');
        return game_points
    }

}