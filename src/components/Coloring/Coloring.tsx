import {useRef, useEffect, useState} from 'react';
import Plane from '../../assets/Plane.gif';
import {
    Box,
    Typography,
    Button,
    Grid,
} from '@mui/material';

interface RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
}

const COLORS: { name: string; color: RGBA }[] = [
    {name: 'Red', color: {r: 255, g: 0, b: 0, a: 255}},
    {name: 'Green', color: {r: 0, g: 255, b: 0, a: 255}},
    {name: 'Blue', color: {r: 0, g: 0, b: 255, a: 255}},
    {name: 'Yellow', color: {r: 255, g: 255, b: 0, a: 255}},
    {name: 'Cyan', color: {r: 0, g: 255, b: 255, a: 255}},
    {name: 'Magenta', color: {r: 255, g: 0, b: 255, a: 255}},
    {name: 'Orange', color: {r: 255, g: 165, b: 0, a: 255}},
    {name: 'Purple', color: {r: 128, g: 0, b: 128, a: 255}},
    {name: 'Brown', color: {r: 165, g: 42, b: 42, a: 255}},
    {name: 'Teal', color: {r: 0, g: 128, b: 128, a: 255}},
];

const getColorAtPixel = (data: ImageData, x: number, y: number): RGBA => {
    const idx = (y * data.width + x) * 4;
    return {
        r: data.data[idx],
        g: data.data[idx + 1],
        b: data.data[idx + 2],
        a: data.data[idx + 3],
    };
};

const setPixelColor = (data: ImageData, x: number, y: number, color: RGBA) => {
    const idx = (y * data.width + x) * 4;
    data.data.set([color.r, color.g, color.b, color.a], idx);
};

const colorMatch = (a: RGBA, b: RGBA) =>
    a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;

const isFillable = (color: RGBA, selectedColor: RGBA) =>
    color.a === 0 || // transparent
    (color.r === 255 && color.g === 255 && color.b === 255 && color.a === 255) || // white
    COLORS.some(({color: c}) => colorMatch(c, color)) ||
    colorMatch(color, selectedColor);

const Coloring = () => {
    // Refs and State
    const canvasRef = useRef<HTMLCanvasElement>(null); // Reference to the canvas element
    const [selectedColor, setSelectedColor] = useState(COLORS[0].color); // Currently selected color for filling
    const [seconds, setSeconds] = useState(0); // Timer state (in seconds)
    const [timerActive, setTimerActive] = useState(true); // Controls whether timer is running

    // Increments the timer every second when active
    useEffect(() => {
        if (!timerActive) return;
        const interval = setInterval(() => setSeconds(s => s + 1), 1000);
        return () => clearInterval(interval); // Clear interval on unmount or when timer is stopped
    }, [timerActive]);

    // Handler to stop the timer and show an alert when task is completed
    const handleFinish = () => {
        setTimerActive(false);
        alert(`Finished in ${Math.floor(seconds / 60)}m ${seconds % 60}s`);
    };

    // Loads the base image and draws it on the canvas
    useEffect(() => {
        // Load the image and draw it on the canvas
        const canvas = canvasRef.current;
        if (!canvas) return;

        // Set canvas dimensions to match the image
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Create a new image and set its source
        const image = new Image();
        image.src = Plane; // Load source image (e.g., an outline to fill)
        image.onload = () => {
            canvas.width = image.width;
            canvas.height = image.height;
            ctx.drawImage(image, 0, 0); // Draw image on canvas
        };
    }, []);

    // 🎨 Coloring Effect: Handles flood-fill when clicking on canvas
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        /**
         * Flood fill algorithm to check each pixel in the canvas and fill it with the selected color
         */
        const floodFill = (x: number, y: number) => {
            // Get image data from the canvas
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
            // Get the color of the pixel at (x, y)
            const targetColor = getColorAtPixel(data, x, y);

            // Avoid filling if target is already the selected color or the image lines
            if (!isFillable(targetColor, selectedColor) || colorMatch(targetColor, selectedColor)) return;

            const visited = new Set<string>();
            const queue = [{x, y}];

            // Use a queue for BFS to explore all connected pixels
            while (queue.length) {
                const {x, y} = queue.pop()!;
                const key = `${x},${y}`;

                // Skip if out of bounds or already visited
                if (x < 0 || y < 0 || x >= canvas.width || y >= canvas.height || visited.has(key)) continue;
                visited.add(key);

                // Get the color of the current pixel
                const currentColor = getColorAtPixel(data, x, y);

                // Continue only if the current pixel matches the original target color
                if (!colorMatch(currentColor, targetColor) || !isFillable(currentColor, selectedColor)) continue;

                // Set the pixel to the selected color
                setPixelColor(data, x, y, selectedColor);

                // Add neighboring pixels to the queue
                queue.push(
                    {x: x + 1, y},
                    {x: x - 1, y},
                    {x, y: y + 1},
                    {x, y: y - 1}
                );
            }

            // Draw updated image data back onto canvas
            ctx.putImageData(data, 0, 0);
        };

        /**
         * Converts mouse click coordinates into canvas coordinates
         * and triggers the flood fill operation
         */
        const handleClick = (e: MouseEvent) => {
            // Get the canvas element and its bounding rectangle
            const rect = canvas.getBoundingClientRect();

            // Calculate canvas-relative coordinates
            const x = Math.floor((e.clientX - rect.left) * (canvas.width / rect.width));
            const y = Math.floor((e.clientY - rect.top) * (canvas.height / rect.height));

            floodFill(x, y);
        };

        canvas.addEventListener('click', handleClick);

        // Clean up click listener on unmount or when selectedColor changes
        return () => canvas.removeEventListener('click', handleClick);
    }, [selectedColor]);

    return (
        <Box sx={{p: 2, mx: 'auto', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2}}>
            {/* Header */}
            <Box sx={{
                width: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                position: 'relative'
            }}>
                <Typography variant="h6" fontWeight={600} color={"black"}>Start Coloring</Typography>
                <Box sx={{
                    position: 'absolute',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: '#333',
                    color: '#fff',
                    px: 2,
                    py: 0.5,
                    borderRadius: '20px',
                    fontSize: '0.95rem',
                    fontWeight: 500,
                    boxShadow: 2
                }}>
                    ⏱️ {Math.floor(seconds / 60)}:{String(seconds % 60).padStart(2, '0')}
                </Box>
                <Button variant="contained" onClick={handleFinish}>Done</Button>
            </Box>

            {/* Canvas */}
            <canvas ref={canvasRef} style={{maxWidth: '100%', border: '1px solid #ccc', borderRadius: '8px'}}/>

            {/* Color Picker */}
            <Grid container spacing={1}
            sx={{ width: '100%', padding: 2, borderRadius: '8px', backgroundColor: '#f9f9f9', display: 'flex', justifyContent: 'center' }}>
                {COLORS.map(({name, color}) => (
                    <Grid key={name}>
                        <Button
                            onClick={() => setSelectedColor(color)}
                            sx={{
                                minWidth: 40,
                                minHeight: 40,
                                borderRadius: '50%',
                                backgroundColor: `rgba(${color.r},${color.g},${color.b},${color.a / 255})`,
                                border: colorMatch(color, selectedColor) ? '2px solid black' : '1px solid #ccc',
                                '&:hover': {opacity: 0.8},
                            }}
                        />
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
};

export default Coloring;