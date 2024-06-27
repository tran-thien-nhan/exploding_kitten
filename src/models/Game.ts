// src/models/Game.ts
import { Defuse, ExplodingKitten } from './Card';
import { Deck } from './Deck';
import { Player } from './Player';

export class Game {
    deck: Deck;
    players: Player[];
    currentPlayerIndex: number;

    constructor(player1Name: string, player2Name?: string) {
        // Create a new deck for the game
        this.deck = new Deck();

        // Create an array to hold the players
        this.players = [new Player(player1Name)];
        if (player2Name) {
            this.players.push(new Player(player2Name));
        }

        this.currentPlayerIndex = 0;

        // tạo 1 mảng deck 44 lá bài, trong đó có 4 lá ExplodingKitten, 6 lá Defuse, 4 lá Shuffle, 4 lá Skip, 4 lá DrawFromBottom, 3 lá SeeTheFuture
        const deck = new Deck();
        deck.createDeck();
        //loại bỏ hết các lá bài ExplodingKitten và Defuse khỏi deck
        deck.cards = deck.cards.filter(card => !(card instanceof ExplodingKitten) && !(card instanceof Defuse));
        // xáo trộn deck
        deck.shuffle();
        // tạo 1 mảng chứa 4 lá ExplodingKitten và 6 lá Defuse
        const explodingKittens = Array(4).fill(new ExplodingKitten());
        const defuses = Array(6).fill(new Defuse());
        // phát bài cho người chơi
        this.players.forEach(player => {
            // phát 4 lá bài cho người chơi
            for (let i = 0; i < 4; i++) {
                let card;
                do {
                    card = deck.draw();
                } while (card instanceof ExplodingKitten);
                player.hand.push(card);
            }
            // phát 1 lá Defuse cho người chơi
            player.hand.push(new Defuse());
        });

        // nếu trong mỗi bộ bài của người chơi có ít nhất 1 lá ExplodingKitten thì xếp chúng lại vào bộ bài và rút 1 lá bài khác
        //, nếu vẫn gặp phải lá Exploding Kitten thì vẫn sẽ xếp lại và rút cho đến khi không rút phải Exploding Kitten thì mới bắt đầu trò chơi
        if (this.players.some(player => player.hand.some(card => card instanceof ExplodingKitten))) {
            this.players.forEach(player => {
                while (player.hand.some(card => card instanceof ExplodingKitten)) {
                    const explodingKittenIndex = player.hand.findIndex(card => card instanceof ExplodingKitten);
                    const explodingKitten = player.hand.splice(explodingKittenIndex, 1)[0];
                    this.deck.cards.push(explodingKitten);
                    this.deck.shuffle();
                    let card;
                    do {
                        card = this.deck.draw();
                    } while (card instanceof ExplodingKitten);
                    player.hand.push(card);
                }
            });
        }

        // phát 1 lá defuse cho người chơi
        this.players.forEach(player => {
            player.hand.push(new Defuse());
        });

        // xếp lại các lá bài ExplodingKitten và Defuse vào deck
        this.deck.cards.push(...explodingKittens, ...defuses);
        this.deck.shuffle();

        // bắt đầu trò chơi
        this.play();
    }

    distributeInitialCards() {
        // Distribute 4 cards to each player ensuring no Exploding Kitten cards are given
        this.players.forEach(player => {
            for (let i = 0; i < 4; i++) {
                let card;
                do {
                    card = this.deck.draw();
                } while (card instanceof ExplodingKitten);
                player.hand.push(card);
            }
            // Give each player one Defuse card
            player.hand.push(new Defuse());
        });
    }

    nextPlayer() {
        this.currentPlayerIndex = (this.currentPlayerIndex + 1) % this.players.length;
    }

    playerTurn(player: Player): boolean {
        // Logic for player turn
        if (player.hand.some(card => card instanceof ExplodingKitten)) {
            // Check if the player has a Defuse card
            const defuseIndex = player.hand.findIndex(card => card instanceof Defuse);
            if (defuseIndex >= 0) {
                player.hand.splice(defuseIndex, 1);
                this.deck.cards.push(new ExplodingKitten());
                this.deck.shuffle();
                console.log(`${player.name} drew an Exploding Kitten but defused it!`);
            } else {
                console.log(`${player.name} drew an Exploding Kitten and exploded!`);
                return false;
            }
        }
        return true;
    }

    play() {
        
        // nếu trong mỗi bộ bài của người chơi có ít nhất 1 lá ExplodingKitten thì xếp chúng lại vào bộ bài và rút 1 lá bài khác
        //, nếu vẫn gặp phải lá Exploding Kitten thì vẫn sẽ xếp lại và rút cho đến khi không rút phải Exploding Kitten thì mới bắt đầu trò chơi

        // if (this.players.some(player => player.hand.some(card => card instanceof ExplodingKitten))) {
        //     this.players.forEach(player => {
        //         while (player.hand.some(card => card instanceof ExplodingKitten)) {
        //             const explodingKittenIndex = player.hand.findIndex(card => card instanceof ExplodingKitten);
        //             const explodingKitten = player.hand.splice(explodingKittenIndex, 1)[0];
        //             this.deck.cards.push(explodingKitten);
        //             this.deck.shuffle();
        //             let card;
        //             do {
        //                 card = this.deck.draw();
        //             } while (card instanceof ExplodingKitten);
        //             player.hand.push(card);
        //         }
        //     });
        // }


        while (this.players.length > 1) {
            const currentPlayer = this.players[this.currentPlayerIndex];
            console.log(`${currentPlayer.name}'s turn`);
            if (!this.playerTurn(currentPlayer)) {
                this.players.splice(this.currentPlayerIndex, 1);
                if (this.players.length === 1) break;
            }
            this.nextPlayer();
        }
        if (this.players.length === 1) {
            console.log(`${this.players[0].name} is the winner!`);
        } else {
            console.log("No winner! The deck is empty.");
        }
    }
}
