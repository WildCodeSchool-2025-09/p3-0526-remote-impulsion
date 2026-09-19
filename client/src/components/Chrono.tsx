import { useEffect, useState } from "react";
import ClockIcon from "../assets/icons/seance/clock.svg?react";

type ChronoProps = {
  startedAt: string;
};

const formatElapsedTime = (totalSeconds: number) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const paddedTime = [minutes, seconds]
    .map((part) => String(part).padStart(2, "0"))
    .join(":");

  return hours > 0
    ? `${String(hours).padStart(2, "0")}:${paddedTime}`
    : paddedTime;
};

const Chrono = ({ startedAt }: ChronoProps) => {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  const totalSeconds = Math.max(
    0,
    Math.floor((now - new Date(startedAt).getTime()) / 1000),
  );

  return (
    <div className="flex shrink-0 items-center gap-2 rounded-lg border border-accent/30 bg-accent/10 px-3 py-1.5 font-display font-extrabold text-accent text-lg italic tabular-nums lg:px-4 lg:py-2 lg:text-xl">
      <ClockIcon aria-hidden="true" className="size-4 lg:size-5" />
      {formatElapsedTime(totalSeconds)}
    </div>
  );
};

export default Chrono;
