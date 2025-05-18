import { useRef, useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import Plane from '../../assets/Plane.gif';
import Mandala from '../../assets/Mandala.gif';
import { COLORS } from './utils';

import useTimer from './hooks/useTimer';
import useImageLoader from './hooks/useImageLoader';
import useCanvasColoring from "./hooks/useColoringCanvas.ts";
import ColorPicker from './components/ColorPicker.tsx';

// Add more images here if you have more
const IMAGES = [Plane, Mandala];

const Coloring = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedColor, setSelectedColor] = useState(COLORS[0].color);
    const { seconds, stopTimer } = useTimer(true);

    // Pick a random image on mount
    const [image, setImage] = useState<string>(() => {
        const randomIndex = Math.floor(Math.random() * IMAGES.length);
        return IMAGES[randomIndex];
    });

    useImageLoader(canvasRef, image);
    useCanvasColoring(canvasRef, selectedColor);

    const handleFinish = () => {
        stopTimer();
        alert(`Finished in ${Math.floor(seconds / 60)}m ${seconds % 60}s`);
    };

    return (
        <Box
            sx={{
                p: 2,
                mx: 'auto',
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                gap: 2
            }}
        >
            {/* Header */}
            <Box
                sx={{
                    width: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <Typography variant="h5" fontWeight={600} color="text.primary">
                    Start Coloring
                </Typography>
                <Button variant="contained" onClick={handleFinish}>
                    Done
                </Button>
            </Box>

            {/* Canvas */}
            <canvas
                ref={canvasRef}
                style={{
                    maxWidth: '100%',
                    border: '1px solid #ccc',
                    borderRadius: '8px'
                }}
            />

            {/* Color Picker */}
            <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor} />
        </Box>
    );
};

export default Coloring;