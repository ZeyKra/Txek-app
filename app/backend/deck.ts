import cardValues from './card-value.json';

type card = {
    color : string,
    value : string
}


/* Fonction qui compte le nombre de cartes dans un deck 

 * @param cardList : string[], ['<couleur>-<valeur>', *]
 * @returns number
 */
function countDeck(cardList : string[]) {
    let count = 0;
    cardList.map(carte => {
        // On transforme la valeur string en valeur json pour les comparaisons
        const parsedCard: card = {
            color : carte.split('-')[0],
            value : carte.split('-')[1]
        }

        // comptage des cartes a nombres
        if (parsedCard.value.length <= 2) {
            count += Number.parseInt(parsedCard.value);
        }

        // comptage des cartes a lettres
        else {
            if (parsedCard.value === 'crown') {
                count += cardValues[parsedCard.value][parsedCard.color];
            } else {
                count += cardValues[parsedCard.value];
            }
        }

    })
    return count;
}

export { countDeck }

