// src/models/Card.ts
export interface Card {
    name: string;
}

// Các loại card cụ thể
export class ExplodingKitten implements Card {
    name = "Exploding Kitten";
}

export class Defuse implements Card {
    name = "Defuse";
}

export class Shuffle implements Card {
    name = "Shuffle";
}

export class Skip implements Card {
    name = "Skip";
}

export class DrawFromBottom implements Card {
    name = "Draw From Bottom";
}

export class SeeTheFuture implements Card {
    name = "See The Future";
}
