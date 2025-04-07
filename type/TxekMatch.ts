import type { TxekPlayer } from "@/type/TxekPlayer";
import type { TxekRound } from "@/type/TxekRound";

export interface TxekMatch {
    createdAt: Date,
    players: TxekPlayer[],
    rounds: TxekRound[],
    winner?: TxekPlayer,
}