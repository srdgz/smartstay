import { FC, useEffect, useState, useSyncExternalStore } from "react";

type Props = {
  endValue: number;
  duration: number;
};

const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

const subscribeToMotionPreference = (onChange: () => void) => {
  const query = window.matchMedia(REDUCED_MOTION);
  query.addEventListener("change", onChange);
  return () => query.removeEventListener("change", onChange);
};

const prefersReducedMotion = () => window.matchMedia(REDUCED_MOTION).matches;

const CountUpNumber: FC<Props> = ({ endValue, duration }) => {
  const [count, setCount] = useState(0);
  const reducedMotion = useSyncExternalStore(
    subscribeToMotionPreference,
    prefersReducedMotion,
    () => false
  );

  useEffect(() => {
    if (reducedMotion) return;

    let startTime: number;
    let animationFrameId: number;
    const updateCount = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = timestamp - startTime;
      if (progress < duration) {
        setCount(Math.min(endValue, (progress / duration) * endValue));
        animationFrameId = requestAnimationFrame(updateCount);
      } else {
        setCount(endValue);
      }
    };
    animationFrameId = requestAnimationFrame(updateCount);
    return () => cancelAnimationFrame(animationFrameId);
  }, [endValue, duration, reducedMotion]);

  return (
    <p className="text-3xl font-extrabold tracking-tight">
      {Math.round(reducedMotion ? endValue : count)}
    </p>
  );
};

export default CountUpNumber;
