// src/pages/ColorPicker.tsx
import { Grid, Button } from '@mui/material';
import { COLORS, type RGBA, toRGBA, colorMatch} from "../pages/Coloring/utils.ts";

interface ColorPickerProps {
    selectedColor: RGBA;
    setSelectedColor: (color: RGBA) => void;
}

const ColorPicker = ({ selectedColor, setSelectedColor }: ColorPickerProps) => (
    <Grid container spacing={2} justifyContent="center" sx={{ backgroundColor: '#f0f0f0', p: 2, borderRadius: 2 }}>
        {COLORS.map(({ name, color }) => (
            <Grid key={name}>
                <Button
                    onClick={() => setSelectedColor(color)}
                    disableRipple
                    sx={{
                        width: 32,
                        height: 32,
                        minWidth: 0,
                        padding: 0,
                        borderRadius: '50%',
                        backgroundColor: toRGBA(color),
                        opacity: 0.6,
                        backdropFilter: 'blur(2px)', // subtle blur gives a glassy feel
                        border: '1px solid rgba(255, 255, 255, 0.2)', // thin, elegant border
                        transition: 'all 0.25s ease-in-out',
                        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.15)', // subtle depth

                        '&:hover': {
                            opacity: 1,
                            transform: 'scale(1.1)',
                            boxShadow: `0 0 10px 3px ${toRGBA(color)}, 0 0 1px 1px rgba(255,255,255,0.1)`,
                        },

                        ...(colorMatch(color, selectedColor)
                            ? {
                                boxShadow: `0 0 0 3px ${toRGBA(color)}, 0 0 10px 2px ${toRGBA(color)}`,
                                transform: 'scale(1.15)',
                                border: '2px solid #fff',
                                opacity: 1,
                            }
                            : {}),
                    }}
                />
            </Grid>
        ))}
    </Grid>
);

export default ColorPicker;