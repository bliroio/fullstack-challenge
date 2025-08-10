import { useRef, useState, useEffect } from "react";

interface CountDownTimerProps {
    startTime: string;
    endTime: string;
}

const getTimeRemaining = (startTime: string, endTime: string) => {
    const now = Date.now();
    const total =
        Date.parse(startTime) - now;
    
    const isMeetingInProgress = (now > Date.parse(startTime) && now < Date.parse(endTime));
    const isPastMeeting = (Date.parse(endTime) - now) < 0;
    
    if (isPastMeeting) return {remaining: `🔴 Past Meeting`};
    if (isMeetingInProgress) return {remaining: `🟢 Meeting in Progress`};

    const seconds = Math.floor(total / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    // Use the modulo operator to get the remainder for each unit
    const remainingSeconds = seconds % 60;
    const remainingMinutes = minutes % 60;
    const remainingHours = hours % 24;

    let remaining = `Scheduled in `;
    if (days > 0) remaining += `${days}d `;
    if (remainingHours > 0) remaining += `${remainingHours}h `;
    if (remainingMinutes > 0) remaining += `${remainingMinutes}m `;
    if (remainingSeconds > 0) remaining += `${remainingSeconds}s`;
    // const remaining = `${days}d ${remainingHours}h ${remainingMinutes}m ${remainingSeconds}s`;
    return {
        total,
        remaining
    };
};

export const CountdownTimer = ({startTime, endTime}: CountDownTimerProps) => {
    const [timeLeft, setTimeLeft] = useState("");
    const intervalRef = useRef<any>(null);
    
    useEffect(() => {
        // Start the interval
        intervalRef.current = setInterval(() => {
            const { remaining } = getTimeRemaining(startTime, endTime);
            setTimeLeft(remaining);
        }, 1000);

        // Set initial value immediately
        // const { remaining } = getTimeRemaining(startTime);
        // setTimeLeft(remaining);

        // Cleanup on unmount or when startTime changes
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [startTime]);

    return (
        <>{timeLeft}</>
    );
}