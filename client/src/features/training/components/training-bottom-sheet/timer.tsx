import { useEffect, useState } from "react";
import { differenceInSeconds } from "date-fns";

import { useStore } from "@features/core/hooks/use-store";
import { Typography } from "@features/ui/components";

const formatTime = (elapsed: number) => {
  const hours = Math.floor(elapsed / 3600);
  const minutes = Math.floor((elapsed - hours * 3600) / 60);
  const seconds = Math.floor(elapsed - hours * 3600 - minutes * 60);

  const pad = (time: number) => time.toString().padStart(2, "0");

  return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}`;
};

export const Timer = () => {
  const startedAt = useStore((state) => state.session.startedAt);

  const [elapsed, setElapsed] = useState(0);

  useEffect(() => {
    const interval = setInterval(
      () => setElapsed(differenceInSeconds(new Date(), startedAt)),
      1000
    );

    return () => clearInterval(interval);
  }, [startedAt]);

  return <Typography className="text-lg">{formatTime(elapsed)}</Typography>;
};
