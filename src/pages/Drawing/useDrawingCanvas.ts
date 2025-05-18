// src/hooks/useDrawingCanvas.ts

import { type RefObject, useEffect, useRef } from 'react';
import type { RGBA } from '../Coloring/utils.ts';

/**
 * A custom hook that enables drawing on a canvas using mouse or touch input.
 * Supports dynamic resizing and drawing with RGBA stroke color.
 */
const useDrawingCanvas = (
    canvasRef: RefObject<HTMLCanvasElement | null>,
    color: RGBA
) => {
    const drawing = useRef(false); // Tracks whether user is currently drawing
    const ctxRef = useRef<CanvasRenderingContext2D | null>(null); // Canvas context

    /**
     * Resizes the canvas based on device pixel ratio and current DOM size.
     * Preserves existing image data and resets drawing settings.
     */
    const resizeCanvas = (canvas: HTMLCanvasElement) => {
        const dpr = window.devicePixelRatio || 1;
        const width = window.innerWidth;
        const height = window.innerHeight;

        // Set CSS size
        canvas.style.width = `${width}px`;
        canvas.style.height = `${height}px`;

        // Set drawing buffer size
        canvas.width = width * dpr;
        canvas.height = height * dpr;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Scale for high DPI
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.scale(dpr, dpr);

        // Set drawing styles
        ctx.lineJoin = 'round';
        ctx.lineCap = 'round';
        ctx.lineWidth = 5;

        ctxRef.current = ctx;
    };

    /**
     * Sets up canvas resize logic on mount and on window resize.
     */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        resizeCanvas(canvas); // Initial resize

        const handleResize = () => resizeCanvas(canvas);
        window.addEventListener('resize', handleResize);

        return () => window.removeEventListener('resize', handleResize);
    }, [canvasRef]);

    /**
     * Adds event listeners to enable drawing with mouse and touch input.
     * Updates stroke color whenever it changes.
     */
    useEffect(() => {
        const canvas = canvasRef.current;
        const ctx = ctxRef.current;
        if (!canvas || !ctx) return;

        // Gets pointer (mouse/touch) position relative to canvas
        const getPointerPos = (e: MouseEvent | TouchEvent) => {
            const rect = canvas.getBoundingClientRect();
            const dpr = window.devicePixelRatio || 1;

            const clientX = 'touches' in e ? e.touches[0]?.clientX : (e as MouseEvent).clientX;
            const clientY = 'touches' in e ? e.touches[0]?.clientY : (e as MouseEvent).clientY;

            return {
                x: (clientX - rect.left) * (canvas.width / rect.width) / dpr,
                y: (clientY - rect.top) * (canvas.height / rect.height) / dpr,
            };
        };

        // Start drawing
        const handleStart = (e: MouseEvent | TouchEvent) => {
            if (!ctxRef.current) return;

            ctxRef.current.strokeStyle = `rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})`;
            drawing.current = true;

            const { x, y } = getPointerPos(e);
            ctxRef.current.beginPath();
            ctxRef.current.moveTo(x, y);
        };

        // Continue drawing
        const handleMove = (e: MouseEvent | TouchEvent) => {
            if (!drawing.current || !ctxRef.current) return;
            e.preventDefault(); // Prevent scrolling on touch devices

            const { x, y } = getPointerPos(e);
            ctxRef.current.lineTo(x, y);
            ctxRef.current.stroke();
        };

        // Stop drawing
        const handleEnd = () => {
            drawing.current = false;
        };

        // Mouse events
        canvas.addEventListener('mousedown', handleStart);
        canvas.addEventListener('mousemove', handleMove);
        window.addEventListener('mouseup', handleEnd);

        // Touch events
        canvas.addEventListener('touchstart', handleStart, { passive: false });
        canvas.addEventListener('touchmove', handleMove, { passive: false });
        window.addEventListener('touchend', handleEnd);

        return () => {
            canvas.removeEventListener('mousedown', handleStart);
            canvas.removeEventListener('mousemove', handleMove);
            window.removeEventListener('mouseup', handleEnd);

            canvas.removeEventListener('touchstart', handleStart);
            canvas.removeEventListener('touchmove', handleMove);
            window.removeEventListener('touchend', handleEnd);
        };
    }, [canvasRef, color]); // Re-bind events if color or canvasRef changes
};

export default useDrawingCanvas;