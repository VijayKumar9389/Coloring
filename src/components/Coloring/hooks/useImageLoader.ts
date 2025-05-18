// src/hooks/useImageLoader.ts
import {type RefObject, useEffect} from 'react';

const useImageLoader = (
    canvasRef: RefObject<HTMLCanvasElement | null>,
    imageSrc: string
) => {
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = canvas?.getContext('2d');
        if (!canvas || !ctx) return;

        const image = new Image();
        image.src = imageSrc;

        image.onload = () => {
            const aspectRatio = image.width / image.height;
            canvas.width = window.innerWidth;
            canvas.height = canvas.width / aspectRatio;
            ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
        };
    }, [canvasRef, imageSrc]);
};

export default useImageLoader;