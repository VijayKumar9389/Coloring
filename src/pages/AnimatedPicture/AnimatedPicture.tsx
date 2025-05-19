import React, { useRef, useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Box } from '@mui/material';

type Petal = {
    id: number;
    cx: number;
    cy: number;
    rotate: number;
    color: string;
};

// Initial petals arranged around the flower
const initialPetals: Petal[] = [
    { id: 1, cx: 100, cy: 50, rotate: 0, color: '#ff5eaa' },
    { id: 2, cx: 140, cy: 65, rotate: 45, color: '#ff8ed4' },
    { id: 3, cx: 160, cy: 110, rotate: 90, color: '#ffa6de' },
    { id: 4, cx: 140, cy: 155, rotate: 135, color: '#ff8ed4' },
    { id: 5, cx: 100, cy: 170, rotate: 180, color: '#ff5eaa' },
    { id: 6, cx: 60, cy: 155, rotate: 225, color: '#ff8ed4' },
    { id: 7, cx: 40, cy: 110, rotate: 270, color: '#ffa6de' },
    { id: 8, cx: 60, cy: 65, rotate: 315, color: '#ff8ed4' },
];

const AnimatedPicture: React.FC = () => {
    // Reference to the SVG element to calculate positions
    const svgRef = useRef<SVGSVGElement | null>(null);

    // State for petals currently falling (detached from flower)
    const [fallingPetals, setFallingPetals] = useState<Petal[]>([]);

    // State for petals still attached to the flower (static)
    const [remainingPetals, setRemainingPetals] = useState<Petal[]>(initialPetals);

    // Stores the screen position of each falling petal for absolute positioning
    const [fallingPositions, setFallingPositions] = useState<{ [id: number]: { x: number; y: number } }>({});

    // Scale factor to keep falling petals sized correctly on window resize
    const [scaleFactor, setScaleFactor] = useState(1);

    // Update scale factor on mount and when window resizes
    useEffect(() => {
        const handleResize = () => {
            if (svgRef.current) {
                const bbox = svgRef.current.getBoundingClientRect();
                const viewBoxWidth = 200; // SVG viewBox width is 200 units
                const newScale = bbox.width / viewBoxWidth;
                setScaleFactor(newScale);
            }
        };

        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle petal click event: initiate the falling animation
    const handlePetalClick = (petal: Petal) => {
        // Check if SVG reference is available
        if (!svgRef.current) return;

        // Use requestAnimationFrame for smooth position calculation before state updates
        requestAnimationFrame(() => {
            const svg = svgRef.current!;
            const pt = svg.createSVGPoint();

            // Set the point to petal's SVG coordinates
            pt.x = petal.cx;
            pt.y = petal.cy;

            // Get current transformation matrix to convert SVG coords to screen coords
            const screenCTM = svg.getScreenCTM();
            if (!screenCTM) return;

            // Calculate screen coordinates for the petal's center
            const screenPoint = pt.matrixTransform(screenCTM);

            // Save petal's screen position for absolute positioning of falling animation
            setFallingPositions((prev) => ({
                ...prev,
                [petal.id]: {
                    x: screenPoint.x,
                    y: screenPoint.y,
                },
            }));

            // Delay to allow state update for position before removing petal from flower
            setTimeout(() => {
                // Remove petal from flower (static petals)
                setRemainingPetals((prev) => prev.filter((p) => p.id !== petal.id));

                // Add petal to falling petals state to render and animate falling petals
                setFallingPetals((prev) => [...prev, petal]);
            }, 100);
        });
    };

    return (
        <Box
            sx={{
                position: 'relative',
                width: '100%',
                height: '100%',
                overflow: 'visible',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                background: 'linear-gradient(to bottom, #bbdefb, white)',
            }}
        >
            {/* Flower SVG with petals still attached */}
            <svg
                ref={svgRef}
                viewBox="-10 -20 220 260"
                preserveAspectRatio="xMidYMid meet"
                style={{
                    width: 'min(60vw, 60vh)',
                    height: 'auto',
                    position: 'relative',
                    zIndex: 1, // Lower z-index to stay below falling petals container
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
                {/* Flower center and base circle */}
                <circle cx="100" cy="110" r="50" fill="#fff" />
                <circle cx="100" cy="110" r="20" fill="#ffc107" />

                {/* Static petals - clickable to start falling */}
                {remainingPetals.map((petal) => (
                    <motion.ellipse
                        key={petal.id}
                        cx={petal.cx}
                        cy={petal.cy}
                        rx="20"
                        ry="40"
                        fill={petal.color}
                        transform={`rotate(${petal.rotate}, ${petal.cx}, ${petal.cy})`}
                        onClick={() => handlePetalClick(petal)}
                        style={{ cursor: 'pointer' }}
                    />
                ))}
            </svg>

            {/* Container for falling petals - absolutely positioned over SVG */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'none', // Let clicks pass through this container
                    zIndex: 10, // Higher z-index to render above the flower SVG
                }}
            >
                <AnimatePresence>
                    {fallingPetals.map((petal) => {
                        const position = fallingPositions[petal.id];
                        if (!position) return null; // Wait until position is known

                        // Size the falling petal SVG based on current scale factor
                        const width = 40 * scaleFactor;
                        const height = 80 * scaleFactor;

                        return (
                            <motion.svg
                                key={petal.id}
                                initial={{
                                    x: 0,
                                    y: 0,
                                    rotate: petal.rotate,
                                    opacity: 1,
                                }}
                                animate={{
                                    // Animate x and y to simulate a falling, drifting petal
                                    x: [0, 30, -20],
                                    y: [0, 300, window.innerHeight + 100 - position.y],
                                    rotate: [petal.rotate, petal.rotate + 60, petal.rotate + 120],
                                    opacity: [1, 0.8, 0.6, 0],
                                }}
                                transition={{
                                    duration: 3.5,
                                    ease: 'easeInOut',
                                    times: [0, 0.3, 0.6, 1],
                                }}
                                exit={{ opacity: 0 }}
                                width={width}
                                height={height}
                                viewBox="0 0 40 80"
                                style={{
                                    position: 'absolute',
                                    // Position the petal on screen exactly where it started
                                    left: position.x - width / 2,
                                    top: position.y - height / 2,
                                    pointerEvents: 'none', // Prevent interaction with falling petals
                                }}
                            >
                                <ellipse cx="20" cy="40" rx="20" ry="40" fill={petal.color} />
                            </motion.svg>
                        );
                    })}
                </AnimatePresence>
            </Box>
        </Box>
    );
};

export default AnimatedPicture;
