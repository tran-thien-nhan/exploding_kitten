// src/models.ts
export class Card {
    name: string;

    constructor(name: string) {
        this.name = name;
    }
}

export class ExplodingKitten extends Card {
    constructor() {
        super("Exploding Kitten");
    }
}

export class Defuse extends Card {
    constructor() {
        super("Defuse");
    }
}

export class Shuffle extends Card {
    constructor() {
        super("Shuffle");
    }
}

export class Skip extends Card {
    constructor() {
        super("Skip");
    }
}

export class DrawFromBottom extends Card {
    constructor() {
        super("Draw From Bottom");
    }
}

export class SeeTheFuture extends Card {
    constructor() {
        super("See The Future");
    }
}

export class Player {
    name: string;
    hand: Card[];

    constructor(name: string) {
        this.name = name;
        this.hand = [];
    }

    drawCard(deck: Deck): Card | null {
        if (!deck.isEmpty()) {
            const card = deck.draw();
            this.hand.push(card);
            return card;
        } else {
            return null;
        }
    }

    playCard(index: number, deck: Deck): boolean | string {
        if (0 <= index && index < this.hand.length) {
            const card = this.hand.splice(index, 1)[0];
            if (card.name === "Defuse") {
                return true;
            } else if (card.name === "Shuffle") {
                deck.shuffle();
                return true;
            } else if (card.name === "Skip") {
                return "skip";
            } else if (card.name === "Draw From Bottom") {
                this.drawFromBottom(deck);
                return "draw_from_bottom";
            } else if (card.name === "See The Future") {
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
        } else {
            return null;
        }
    }

    seeTheFuture(deck: Deck): void {
        const topCards = deck.peek(3);
        console.log(`${this.name} uses See The Future and sees the top 3 cards of the deck:`);
        topCards.forEach((card, index) => {
            console.log(`Card ${index + 1}: ${card.name}`);
        });
    }
}

export class Deck {
    cards: Card[];

    constructor() {
        this.cards = [];
        this.createDeck();
        this.shuffle();
    }

    createDeck(): void {
        this.cards = [];
        for (let i = 0; i < 4; i++) {
            this.cards.push(new ExplodingKitten());
        }
        for (let i = 0; i < 2; i++) {
            this.cards.push(new Defuse());
        }
        for (let i = 0; i < 4; i++) {
            this.cards.push(new Shuffle());
        }
        for (let i = 0; i < 4; i++) {
            this.cards.push(new Skip());
        }
        for (let i = 0; i < 4; i++) {
            this.cards.push(new DrawFromBottom());
        }
        for (let i = 0; i < 3; i++) {
            this.cards.push(new SeeTheFuture());
        }
    }

    shuffle(): void {
        this.cards = this.cards.sort(() => Math.random() - 0.5);
    }

    draw(): Card {
        if (!this.isEmpty()) {
            return this.cards.shift()!;
        } else {
            throw new Error("The deck is empty!");
        }
    }

    drawFromBottom(): Card {
        if (!this.isEmpty()) {
            return this.cards.pop()!;
        } else {
            throw new Error("The deck is empty!");
        }
    }

    isEmpty(): boolean {
        return this.cards.length === 0;
    }

    peek(num: number): Card[] {
        return this.cards.slice(0, num);
    }
}

export class Game {
    deck: Deck;
    players: Player[];
    currentPlayerIndex: number;

    constructor(player1Name: string, player2Name?: string) {
        this.deck = new Deck();
        this.players = [new Player(player1Name)];
        if (player2Name) {
            this.players.push(new Player(player2Name));
        }
        this.currentPlayerIndex = 0;
        this.distributeInitialCards();
    }

    distributeInitialCards(): void {
        for (let player of this.players) {
            for (let i = 0; i < 4; i++) {
                player.hand.push(this.deck.draw());
            }
            player.hand.push(new Defuse()); // Ensure each player has only 1 Defuse card
        }
    }

    nextPlayer(): void {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }
}
