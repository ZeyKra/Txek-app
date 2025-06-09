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
    
    updateCurrentRound(round: TxekRound) {
        this.rounds[this.rounds.length - 1] = round;
    }
    
    createNewRound() {
        const newRound: TxekRound = {
            createdAt: new Date(),
        }
        this.players.map(player => {
            newRound[player.name] = [];
        })
        this.rounds.push(newRound);
    }
}
