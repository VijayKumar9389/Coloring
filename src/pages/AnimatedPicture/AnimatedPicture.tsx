import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type Petal = {
    id: number;
    cx: number;
    cy: number;
    rotate: number;
    color: string;
    falling: boolean;
};

const initialPetals: Petal[] = [
    { id: 1, cx: 100, cy: 50,  rotate: 0,   color: '#ff5eaa', falling: false },
    { id: 2, cx: 140, cy: 65,  rotate: 45,  color: '#ff8ed4', falling: false },
    { id: 3, cx: 160, cy: 110, rotate: 90,  color: '#ffa6de', falling: false },
    { id: 4, cx: 140, cy: 155, rotate: 135, color: '#ff8ed4', falling: false },
    { id: 5, cx: 100, cy: 170, rotate: 180, color: '#ff5eaa', falling: false },
    { id: 6, cx: 60,  cy: 155, rotate: 225, color: '#ff8ed4', falling: false },
    { id: 7, cx: 40,  cy: 110, rotate: 270, color: '#ffa6de', falling: false },
    { id: 8, cx: 60,  cy: 65,  rotate: 315, color: '#ff8ed4', falling: false },
];

const AnimatedPicture: React.FC = () => {
    const [petals, setPetals] = useState<Petal[]>(initialPetals);

    const handlePetalClick = (id: number) => {
        setPetals((prev) =>
            prev.map(p =>
                p.id === id ? { ...p, falling: true } : p
            )
        );
    };

    return (
        <svg
            viewBox="-10 -20 220 260"
            preserveAspectRatio="xMidYMid meet"
            style={{
                width: 'min(80vw, 80vh)',
                height: 'auto',
                display: 'block',
                margin: 'auto',
                background: 'linear-gradient(to bottom, #87CEEB 0%, #E0F7FA 100%)',
            }}
        >
            {/* Flower stem */}
            <line
                x1="100"
                y1="130"
                x2="100"
                y2="400"
                stroke="green"
                strokeWidth="6"
            />

            {/* Flower center */}
            <circle cx="100" cy="110" r="50" fill="#fff" />
            <circle cx="100" cy="110" r="20" fill="#ffc107" />

            <AnimatePresence>
                {petals.map(petal => (
                    <motion.ellipse
                        key={petal.id}
                        // use the original cx,cy as “base,” animate cy downwards
                        cx={petal.cx}
                        cy={petal.cy}
                        rx={20}
                        ry={40}
                        fill={petal.color}
                        transform={`rotate(${petal.rotate}, ${petal.cx}, ${petal.cy})`}
                        style={{ cursor: petal.falling ? 'default' : 'pointer' }}
                        onClick={() => !petal.falling && handlePetalClick(petal.id)}

                        // initial state: sitting on the flower
                        initial={{ cy: petal.cy, rotate: petal.rotate, opacity: 1 }}
                        // animate to falling state when flagged
                        animate={petal.falling
                            ? {
                                cy: petal.cy + 300,     // drop 300 units in SVG-space
                                rotate: petal.rotate + 120,
                                opacity: 0,
                            }
                            : {}}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 3, ease: 'easeInOut' }}

                        // remove from DOM once fall animation completes
                        onAnimationComplete={() =>
                            petal.falling &&
                            setPetals(prev => prev.filter(p => p.id !== petal.id))
                        }
                    />
                ))}
            </AnimatePresence>
        </svg>
    );
};

export default AnimatedPicture;
