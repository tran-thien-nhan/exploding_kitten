import React, { useState, useEffect } from 'react';
import { ExplodingKitten, Game, Player, Deck } from '../models';

const GameComponent: React.FC = () => {
    const [game, setGame] = useState<Game | null>(null);
    const [currentPlayerIndex, setCurrentPlayerIndex] = useState<number>(0);
    const [message, setMessage] = useState<string | null>(null);

    useEffect(() => {
        const initializeGame = () => {
            // Initialize players
            const player1 = new Player("Player 1");
            const player2 = new Player("Player 2");
            const players: Player[] = [player1, player2];

            // Initialize deck without Exploding Kitten in players' hands
            const initialDeck = new Deck();
            const explodingKittenIndex = initialDeck.cards.findIndex(card => card.name === 'Exploding Kitten');
            if (explodingKittenIndex !== -1) {
                initialDeck.cards.splice(explodingKittenIndex, 1); // Remove Exploding Kitten from the deck
            }

            // Distribute cards to players
            players.forEach(player => {
                for (let i = 0; i < 4; i++) { // Distribute 4 cards to each player
                    const card = initialDeck.draw;
                    if (card) {
                        player.hand.push(card);
                    }
                }
            });

            // Create new Game object
            //const newGame = new Game(players);
            const newGame = new Game("Player 1", "Player 2");
            setGame(newGame);
        };

        initializeGame();
    }, []);

    const handleSetGame = (prevGame: Game | null) => {
        if (prevGame) {
            setGame(prevGame => ({
                ...prevGame!,
                distributeInitialCards: prevGame!.distributeInitialCards, // Ensure to copy distributeInitialCards if needed
                nextPlayer: prevGame!.nextPlayer, // Ensure to copy nextPlayer if needed
                players: [...prevGame!.players], // Copy players array
                deck: prevGame!.deck, // Copy deck reference
                currentPlayerIndex: prevGame!.currentPlayerIndex // Copy current index
            }));
        }
    };

    const handlePlayerAction = (action: string, cardIndex?: number) => {
        if (!game) return;
        const currentPlayer = game.players[currentPlayerIndex];
        const deck = game.deck;

        if (action === 'draw') {
            try {
                const card = currentPlayer.drawCard(deck);
                if (card) {
                    if (card instanceof ExplodingKitten) {
                        const defuseCardIndex = currentPlayer.hand.findIndex(card => card.name === "Defuse");
                        if (defuseCardIndex >= 0) {
                            currentPlayer.hand.splice(defuseCardIndex, 1);
                            deck.cards.push(card); // Place Exploding Kitten back into the deck
                            setMessage(`${currentPlayer.name} rút phải Exploding Kitten nhưng đã sử dụng Defuse!`);
                        } else {
                            setMessage(`${currentPlayer.name} rút phải Exploding Kitten và đã nổ!`);
                            game.players.splice(currentPlayerIndex, 1); // Remove player from the game
                            if (game.players.length === 1) {
                                setMessage(`${game.players[0].name} là người chiến thắng!`);
                            }
                        }
                    } else {
                        setMessage(`${currentPlayer.name} rút một lá bài.`);
                    }
                    handleSetGame(game); // Update game state
                    if (game.players.length > 1) {
                        setCurrentPlayerIndex((currentPlayerIndex + 1) % game.players.length);
                    }
                }
            } catch (error) {
                setMessage(`Không còn lá bài nào để rút!`);
            }
        } else if (action === 'play' && cardIndex !== undefined) {
            const result = currentPlayer.playCard(cardIndex, deck);
            if (result === "skip") {
                setMessage(`${currentPlayer.name} sử dụng Skip!`);
            } else if (result === "draw_from_bottom") {
                setMessage(`${currentPlayer.name} rút một lá bài từ dưới đáy bộ bài.`);
            } else if (result === "see_the_future") {
                setMessage(`${currentPlayer.name} sử dụng See The Future!`);
            } else if (result === true) {
                setMessage(`${currentPlayer.name} sử dụng một lá bài.`);
            } else {
                setMessage(`${currentPlayer.name} không thể sử dụng lá bài này.`);
            }
            handleSetGame(game); // Update game state
        }
    };

    return (
        <div className="p-4">
            {game && (
                <>
                    <h1 className="text-2xl font-bold">Exploding Kitten</h1>
                    <div>
                        {game.players.map((player, index) => (
                            <div key={index} className={`p-4 ${currentPlayerIndex === index ? 'bg-blue-200' : ''}`}>
                                <h2>{player.name}</h2>
                                <div>
                                    {player.hand.map((card, cardIndex) => (
                                        <span key={cardIndex} className="inline-block m-2 p-2 bg-gray-200">
                                            {card.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                    <div>
                        <button onClick={() => handlePlayerAction('draw')} className="mt-4 p-2 bg-green-500 text-white">
                            Draw Card
                        </button>
                        {game.players[currentPlayerIndex].hand.map((card, index) => (
                            <button
                                key={index}
                                onClick={() => handlePlayerAction('play', index)}
                                className="mt-4 ml-2 p-2 bg-blue-500 text-white"
                            >
                                Play {card.name}
                            </button>
                        ))}
                    </div>
                    {message && <div className="mt-4 p-2 bg-yellow-200">{message}</div>}
                </>
            )}
        </div>
    );
};

export default GameComponent;
