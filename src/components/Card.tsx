// src/components/Card.tsx
import React from 'react';

interface CardProps {
    name: string;
}

const Card: React.FC<CardProps> = ({ name }) => {
    return (
        <div className="m-2 p-2 bg-gray-200 rounded shadow">
            {name}
        </div>
    );
};

export default Card;
