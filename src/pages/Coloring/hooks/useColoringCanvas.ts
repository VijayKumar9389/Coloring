import { type RefObject, useEffect } from 'react';
import {
    colorMatch,
    getColorAtPixel,
    isFillable,
    type RGBA,
    setPixelColor
} from '../utils';

const useCanvasColoring = (
    canvasRef: RefObject<HTMLCanvasElement | null>,
    selectedColor: RGBA
) => {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        /**
         * Performs a flood fill operation starting from (x, y).
         */
        const floodFill = (x: number, y: number) => {
            // Get entire canvas pixel data.
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const width = canvas.width;
            const height = canvas.height;

            // Get the color at the clicked pixel.
            const targetColor = getColorAtPixel(data, x, y);

            // If the pixel is not fillable (e.g., already filled or shouldn't be filled), exit.
            if (!isFillable(targetColor, selectedColor)) return;

            // Array to keep track of visited pixels to avoid reprocessing.
            const visited = new Uint8Array(width * height);

            // Stack-based flood fill queue (x, y pairs).
            const queue = [x, y];

            // Process pixels in the queue.
            while (queue.length) {
                const y = queue.pop()!;
                const x = queue.pop()!;

                // Ignore out-of-bounds pixels.
                if (x < 0 || y < 0 || x >= width || y >= height) continue;

                const idx = y * width + x;

                // Skip already visited pixels.
                if (visited[idx]) continue;
                visited[idx] = 1;

                const currentColor = getColorAtPixel(data, x, y);

                // Continue only if the pixel matches the target color and is eligible to be filled.
                if (!colorMatch(currentColor, targetColor) || !isFillable(currentColor, selectedColor)) continue;

                // Apply selected color to the pixel.
                setPixelColor(data, x, y, selectedColor);

                // Add neighboring pixels (right, left, down, up) to the stack.
                queue.push(
                    x + 1, y,
                    x - 1, y,
                    x, y + 1,
                    x, y - 1
                );
            }

            // Write the updated pixel data back to the canvas.
            ctx.putImageData(data, 0, 0);
        };

        /**
         * Converts a mouse click event to canvas pixel coordinates and triggers flood fill.
         */
        const handleClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;

            const x = Math.floor((e.clientX - rect.left) * scaleX);
            const y = Math.floor((e.clientY - rect.top) * scaleY);

            floodFill(x, y);
        };

        // Attach click event listener to canvas.
        canvas.addEventListener('click', handleClick);

        // Clean up listener on unmount.
        return () => {
            canvas.removeEventListener('click', handleClick);
        };
    }, [canvasRef, selectedColor]);
};

export default useCanvasColoring;