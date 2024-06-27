import { Card, CardType } from './types';

export const shuffle = (array: Card[]): Card[] => {
  let currentIndex = array.length, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }

  return array;
};

export const createDeck = (): Card[] => {
  let deck: Card[] = [];

  const addCards = (type: CardType, count: number) => {
    for (let i = 0; i < count; i++) {
      deck.push({ name: type });
    }
  };

  addCards('Exploding Kitten', 4);
  addCards('Defuse', 2);
  addCards('Shuffle', 4);
  addCards('Skip', 4);
  addCards('Draw From Bottom', 4);
  addCards('See The Future', 3);

  return shuffle(deck);
};
