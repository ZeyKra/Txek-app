import { txekPlayer } from "../interfaces/txekPlayer.ts";

function countDeck(player : txekPlayer) {
    let _ = 0;
    player.deck.map(carte => {
        if (carte.length < 2) {
            _ += parseInt(carte);
        }    
    })
    return _;
}

export default { countDeck }