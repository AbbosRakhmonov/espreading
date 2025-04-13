import { useEffect, useState } from "react";

export const useTime = ({ time = 0, completed = false }) => {
  const [timeLeft, setTimeLeft] = useState(time);

  useEffect(() => {
    if (completed) return;
    const timer = setInterval(() => {
      setTimeLeft((prevTime) => prevTime + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [completed]);

  return { timeLeft, setTimeLeft };
};
