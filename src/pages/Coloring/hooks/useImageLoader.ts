import { type RefObject, useEffect } from 'react';

/**
 * Custom hook to load an image onto a canvas element.
 */
const useImageLoader = (
    canvasRef: RefObject<HTMLCanvasElement | null>,
    imageSrc: string
) => {
    useEffect(() => {
        // Get the current canvas element and its 2D drawing context.
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        // Create a new Image object and set its source.
        const image = new Image();
        image.src = imageSrc;

        // Once the image is fully loaded, draw it onto the canvas.
        image.onload = () => {
            // Calculate the image's aspect ratio (width / height).
            const aspectRatio = image.width / image.height;

            // Set the canvas width to match the full window width.
            canvas.width = window.innerWidth;

            // Adjust canvas height to preserve the image's aspect ratio.
            canvas.height = canvas.width / aspectRatio;

            // Draw the image to fill the resized canvas.
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
    }, [canvasRef, imageSrc]);
};

export default useImageLoader;