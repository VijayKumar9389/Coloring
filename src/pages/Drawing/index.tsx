import {useRef, useState} from 'react';
import {Box, Typography, Button} from '@mui/material';
import {COLORS} from "../Coloring/utils.ts";
import useTimer from "../../hooks/useTimer.ts";
import ColorPicker from "../../components/ColorPicker.tsx";
import useDrawingCanvas from "./useDrawingCanvas.ts";

const PROMPTS = ['a bee', 'a flower', 'a tree', 'a rocket', 'a rainbow', 'a dog', 'a castle', 'a spaceship'];

const Drawing = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [selectedColor, setSelectedColor] = useState(COLORS[0].color);
    const {seconds, stopTimer} = useTimer(true);
    const [prompt] = useState<string>(() => {
        const randomIndex = Math.floor(Math.random() * PROMPTS.length);
        return PROMPTS[randomIndex];
    });

    useDrawingCanvas(canvasRef, selectedColor);

    const handleFinish = () => {
        stopTimer();
        alert(`You drew ${prompt} in ${Math.floor(seconds / 60)}m ${seconds % 60}s`);
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
                    justifyContent: 'space-between',
                }}
            >
                <Typography variant="h5" fontWeight={600} color="text.primary">
                    Draw {prompt}
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
                    maxHeight: '60vh',
                    border: '1px solid #ccc',
                    borderRadius: '8px',
                }}
            />

            {/* Color Picker */}
            <ColorPicker selectedColor={selectedColor} setSelectedColor={setSelectedColor}/>
        </Box>
    );
};

export default Drawing;