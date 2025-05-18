/**
 * Represents an RGBA color with red, green, blue, and alpha (opacity) channels.
 */
export interface RGBA {
    r: number;
    g: number;
    b: number;
    a: number;
}

/**
 * A predefined list of named colors and their corresponding RGBA values.
 */
export const COLORS: { name: string; color: RGBA }[] = [
    { name: 'Red', color: { r: 255, g: 0, b: 0, a: 255 } },
    { name: 'Green', color: { r: 0, g: 255, b: 0, a: 255 } },
    { name: 'Blue', color: { r: 0, g: 0, b: 255, a: 255 } },
    { name: 'Yellow', color: { r: 255, g: 255, b: 0, a: 255 } },
    { name: 'Cyan', color: { r: 0, g: 255, b: 255, a: 255 } },
    { name: 'Magenta', color: { r: 255, g: 0, b: 255, a: 255 } },
    { name: 'Orange', color: { r: 255, g: 165, b: 0, a: 255 } },
    { name: 'Purple', color: { r: 128, g: 0, b: 128, a: 255 } },
    { name: 'Brown', color: { r: 165, g: 42, b: 42, a: 255 } },
    { name: 'Teal', color: { r: 0, g: 128, b: 128, a: 255 } },
];

/**
 * Converts an RGBA object to a CSS-compatible rgba() string.
 */
export const toRGBA = ({ r, g, b, a }: RGBA) => `rgba(${r}, ${g}, ${b}, ${a / 255})`;

/**
 * Retrieves the RGBA color at a specific (x, y) coordinate from ImageData.
 */
export const getColorAtPixel = (data: ImageData, x: number, y: number): RGBA => {
    const i = (y * data.width + x) * 4;
    return {
        r: data.data[i],
        g: data.data[i + 1],
        b: data.data[i + 2],
        a: data.data[i + 3],
    };
};

/**
 * Sets the RGBA color at a specific (x, y) coordinate in ImageData.
 */
export const setPixelColor = (data: ImageData, x: number, y: number, color: RGBA) => {
    const i = (y * data.width + x) * 4;
    data.data.set([color.r, color.g, color.b, color.a], i);
};

/**
 * Checks if two RGBA colors are exactly equal.
 */
export const colorMatch = (a: RGBA, b: RGBA) =>
    a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;

/**
 * Determines whether a pixel is fillable based on the current color.
 * A pixel is fillable if:
 * - It's fully transparent (alpha = 0),
 * - It's pure white and fully opaque,
 * - It matches a predefined color in the COLORS list,
 * - Or it matches the selected color directly.
 */
export const isFillable = (color: RGBA, selectedColor: RGBA) =>
    color.a === 0 ||
    (color.r === 255 && color.g === 255 && color.b === 255 && color.a === 255) ||
    COLORS.some(({ color: c }) => colorMatch(c, color)) ||
    colorMatch(color, selectedColor);