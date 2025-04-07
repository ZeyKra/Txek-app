import type { TxekMatch } from "@/type/TxekMatch";
import type { TxekPlayer } from "@/type/TxekPlayer";
import type { TxekRound } from "@/type/TxekRound";

function countDeck(player : TxekPlayer) {
    let count = 0;
    player.deck.map(carte => {
        if (carte.length < 2) {
            count += Number.parseInt(carte);
        }    
    })
    return count;
}

function createGame()  {
    const newMatch: TxekMatch = {
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

function initGame(match : TxekMatch, players: string[]) {
    if (players.length < 2) {
        throw new Error("Il faut au moins 2 joueurs");
    }
    players.map(player => {
        match.players.push(createPlayer(player));
    })
    
}

export default { countDeck, createGame }