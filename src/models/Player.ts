// src/models/Player.ts
import { Card, ExplodingKitten, Defuse, Shuffle, Skip, DrawFromBottom, SeeTheFuture } from './Card';
import { Deck } from './Deck';

export class Player {
    name: string;
    hand: Card[];

    constructor(name: string) {
        this.name = name;
        this.hand = [];
    }

    drawCard(deck: Deck): Card | undefined {
        const card = deck.draw();
        if (card && !(card instanceof ExplodingKitten)) { // Ensure not drawing Exploding Kitten initially
            this.hand.push(card);
            return card;
        }
        return undefined; // Handle the case where only Exploding Kitten is drawn initially
    }

    playCard(index: number, deck: Deck): boolean | string {
        if (index >= 0 && index < this.hand.length) {
            const card = this.hand.splice(index, 1)[0];
            if (card.name === "Defuse") return true;
            if (card.name === "Shuffle") {
                deck.shuffle();
                return true;
            }
            if (card.name === "Skip") return "skip";
            if (card.name === "Draw From Bottom") {
                this.drawFromBottom(deck);
                return "draw_from_bottom";
            }
            if (card.name === "See The Future") {
                this.seeTheFuture(deck);
                return "see_the_future";
            }
        }
        return false;
    }

    drawFromBottom(deck: Deck): Card | null {
        if (!deck.isEmpty()) {
            const card = deck.drawFromBottom();
            this.hand.push(card);
            return card;
        }
        return null;
    }

    defuseKitten(deck: Deck): boolean {
        const kittenIndex = this.hand.findIndex(card => card instanceof ExplodingKitten);
        if (kittenIndex !== -1) {
            const explodingKitten = this.hand.splice(kittenIndex, 1)[0];
            const position = ["top", "bottom", "random"][Math.floor(Math.random() * 3)];
            if (position === "top") {
                deck.cards.unshift(explodingKitten);
            } else if (position === "bottom") {
                deck.cards.push(explodingKitten);
            } else {
                deck.cards.splice(Math.floor(Math.random() * deck.cards.length), 0, explodingKitten);
            }
            return true;
        }
        return false;
    }

    seeTheFuture(deck: Deck): void {
        console.log(`${this.name} uses See The Future and sees the top 3 cards of the deck:`);
        const topCards = deck.peek(3);
        topCards.forEach((card, index) => console.log(`Card ${index + 1}: ${card.name}`));
    }
}
