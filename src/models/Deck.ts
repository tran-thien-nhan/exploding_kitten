// src/models/Deck.ts
import { Card, ExplodingKitten, Defuse, Shuffle, Skip, DrawFromBottom, SeeTheFuture } from './Card';

export class Deck {
    cards: Card[];

    constructor() {
        this.cards = [];
        this.createDeck();
        this.shuffle();
    }

    createDeck() {
        this.cards = [];
        for (let i = 0; i < 4; i++) this.cards.push(new ExplodingKitten());
        for (let i = 0; i < 2; i++) this.cards.push(new Defuse());
        for (let i = 0; i < 4; i++) this.cards.push(new Shuffle());
        for (let i = 0; i < 4; i++) this.cards.push(new Skip());
        for (let i = 0; i < 4; i++) this.cards.push(new DrawFromBottom());
        for (let i = 0; i < 3; i++) this.cards.push(new SeeTheFuture());
    }

    shuffle() {
        for (let i = this.cards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [this.cards[i], this.cards[j]] = [this.cards[j], this.cards[i]];
        }
    }

    draw(): Card {
        if (this.isEmpty()) throw new Error("The deck is empty!");
        return this.cards.shift()!;
    }

    drawFromBottom(): Card {
        if (this.isEmpty()) throw new Error("The deck is empty!");
        return this.cards.pop()!;
    }

    isEmpty(): boolean {
        return this.cards.length === 0;
    }

    peek(num: number): Card[] {
        return this.cards.slice(0, num);
    }
}
