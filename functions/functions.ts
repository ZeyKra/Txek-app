import { txekPlayer } from "../interfaces/txekPlayer.ts";

function countDeck(player : txekPlayer) {
    let count = 0;
    player.deck.map(carte => {
        if (carte.length < 2) {
            count += parseInt(carte);
        }    
    })
    return count;
}

export default { countDeck }