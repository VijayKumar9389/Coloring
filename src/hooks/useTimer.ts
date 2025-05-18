// src/hooks/useTimer.ts
import { useEffect, useState } from 'react';

const useTimer = (start = false) => {
    const [seconds, setSeconds] = useState(0);
    const [active, setActive] = useState(start);

    useEffect(() => {
        if (!active) return;
        const interval = setInterval(() => setSeconds(s => s + 1), 1000);
        return () => clearInterval(interval);
    }, [active]);

    return {
        seconds,
        startTimer: () => setActive(true),
        stopTimer: () => setActive(false),
    };
};

export default useTimer;