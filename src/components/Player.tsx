// src/components/Player.tsx
import React from 'react';
import { Card } from '../models/Card';

interface PlayerProps {
    name: string;
    hand: Card[];
}

const Player: React.FC<PlayerProps> = ({ name, hand }) => {
    return (
        <div className="p-4">
            <h2 className="font-bold">{name}</h2>
            <div className="flex">
                {hand.map((card, index) => (
                    <span key={index} className="inline-block m-2 p-2 bg-gray-200 rounded shadow">
                        {card.name}
                    </span>
                ))}
            </div>
        </div>
    );
};

export default Player;
