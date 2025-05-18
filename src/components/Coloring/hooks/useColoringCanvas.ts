import {type RefObject, useEffect} from 'react';
import {colorMatch, getColorAtPixel, isFillable, type RGBA, setPixelColor} from '../utils';

const useCanvasColoring = (
    canvasRef: RefObject<HTMLCanvasElement | null>,
    selectedColor: RGBA
) => {
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const floodFill = (x: number, y: number) => {
            const data = ctx.getImageData(0, 0, canvas.width, canvas.height);
            const width = canvas.width;
            const height = canvas.height;
            const targetColor = getColorAtPixel(data, x, y);

            if (!isFillable(targetColor, selectedColor) || colorMatch(targetColor, selectedColor)) return;

            const visited = new Uint8Array(width * height);
            const queue = [x, y];

            while (queue.length) {
                const y = queue.pop()!;
                const x = queue.pop()!;
                if (x < 0 || y < 0 || x >= width || y >= height) continue;

                const idx = (y * width + x);
                if (visited[idx]) continue;
                visited[idx] = 1;

                const currentColor = getColorAtPixel(data, x, y);
                if (!colorMatch(currentColor, targetColor) || !isFillable(currentColor, selectedColor)) continue;

                setPixelColor(data, x, y, selectedColor);

                queue.push(
                    x + 1, y,
                    x - 1, y,
                    x, y + 1,
                    x, y - 1
                );
            }

            ctx.putImageData(data, 0, 0);
        };

        const handleClick = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            const x = Math.floor((e.clientX - rect.left) * scaleX);
            const y = Math.floor((e.clientY - rect.top) * scaleY);

            floodFill(x, y);
        };

        canvas.addEventListener('click', handleClick);
        return () => canvas.removeEventListener('click', handleClick);
    }, [canvasRef, selectedColor]);
};

export default useCanvasColoring;