export type CardType = 'Exploding Kitten' | 'Defuse' | 'Shuffle' | 'Skip' | 'Draw From Bottom' | 'See The Future';

export interface Card {
  name: CardType;
}

export interface Player {
  name: string;
  hand: Card[];
}
