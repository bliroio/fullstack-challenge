import { useEffect, useState } from 'react';

export interface CountdownState {
  formattedTime: string;
  minutesRemaining: number;
  isActive: boolean;
}

export const useCountdown = (targetDate: Date | null): CountdownState => {
  const [timeRemaining, setTimeRemaining] = useState<number>(0);

  useEffect(() => {
    if (!targetDate) {
      setTimeRemaining(0);
      return;
    }

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate.getTime() - now.getTime();
      setTimeRemaining(Math.max(0, difference));
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  const formatTime = (milliseconds: number): string => {
    if (milliseconds <= 0) return '00:00';

    const totalSeconds = Math.ceil(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.ceil(totalSeconds % 60);

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  };

  return {
    formattedTime: formatTime(timeRemaining),
    minutesRemaining: Math.floor(timeRemaining / (1000 * 60)),
    isActive: timeRemaining > 0,
  };
};
