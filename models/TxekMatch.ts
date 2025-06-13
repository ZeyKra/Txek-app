import { countDeck } from "@/app/backend/deck";
import type { TxekPlayer } from "@/types/TxekPlayer";
import type { TxekRound } from "@/types/TxekRound";

export default class TxekMatch {
    roundMax: number;
    createdAt: Date;
    players: TxekPlayer[];
    rounds: TxekRound[];
    currentRound: number;
    winner?: TxekPlayer;
    
    constructor(roundMax: number) {
        this.roundMax = roundMax;
        this.currentRound = 1;
        this.createdAt = new Date();
        this.players = [];
        this.rounds = [];
    }
    
    getRound() {
        return this.rounds.length + 1;
    }
    
    getWinner() {
        return this.winner; 
    }

    getPlayers() : TxekPlayer[] {
        return this.players;
    }

    setWinner(winner: TxekPlayer) {
        this.winner = winner;
    }

    getRounds() : TxekRound[] {
        return this.rounds; 
    }

    
    getCurrentRound() : TxekRound {
        return this.rounds[this.rounds.length - 1];
    }

    getCurrentRoundIndex() : number {
        return this.rounds.length - 1;
    }

    updatePlayerPoints(player : TxekPlayer) {
        const playerIndex = this.players.findIndex(p => p.name === player.name);
        if (playerIndex !== -1) {

            let points = 0;
            this.getRounds().map(round => {
                points += countDeck(round[player.name] as string[]);
            })
            
            this.players[playerIndex].points = points;
        }

    }
    
    updateCurrentRound(round: TxekRound) {
        this.rounds[this.rounds.length - 1] = round;
    }
    
    createNewRound() {
        const newRound: TxekRound = {
            created_at: new Date(),
        }
        this.players.map(player => {
            newRound[player.name] = [];
        })
        this.rounds.push(newRound);
    }
}
