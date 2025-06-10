import type { TxekMatch } from "@/models/TxekMatch";
import type { TxekPlayer } from "@/types/TxekPlayer";
import type { TxekRound } from "@/types/TxekRound";

function createGame(roundNumber : number) : TxekMatch  {
    const newMatch: TxekMatch = {
        roundMax: roundNumber,
        createdAt: new Date(),
        players: [],
        rounds: [],
    };
    return newMatch;
}

function createPlayer(name : string) : TxekPlayer {
    const newPlayer: TxekPlayer = {
        name : name,
        points : 0,
        deck : []
    }
    return newPlayer;
}

function createRound() : TxekRound {
    const newRound = {
        createdAt: new Date(),
    };
    return newRound;
}

function initGame(roundNumber: number,players: string[]) {
    const match: TxekMatch = createGame(roundNumber);
    if (players.length < 2) {
        throw new Error("Il faut au moins 2 joueurs");
    }
    players.map(player => {
        match.players.push(createPlayer(player));
    })
    
}

export { createGame, createPlayer, createRound, initGame }