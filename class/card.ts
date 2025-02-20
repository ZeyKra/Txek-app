import type { CardColor } from "../enums/CardColor.ts";
import CardsValue from "../configs/cards-value.json" with { type: "json" };

export class Card {
    
    name : string;
    color : CardColor;
    value : number;

    /**
     * Represente une Carte.
     * @constructor
     * @param {string} name - Nom ou numero de la carte .
     * @param {CardColor} color - Couleur de la carte (Red/Black) .
     */
    constructor(name : string, color: CardColor) {
        this.name = name.toLowerCase();
        this.color = color;
        this.value = this.getCardPoint();
    }


    /**
     * Method afin de return la valeur d'une 
     * @method
     * @param {string} title - The title of the book.
     * @param {string} author - The author of the book.
     */
    getCardPoint() : number {

        if(this.name.length === 1) {
            return Number.parseInt(this.name);
        }

        let value = CardsValue[this.name]
        if(this.name === "couronne") {
            value = CardsValue[this.name][this.color]
        }

        return value;
    }
}
