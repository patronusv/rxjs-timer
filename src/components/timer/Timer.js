import { useEffect, useState } from 'react';
import { interval } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

import getTime from '../../helpers/helpers';

const Timer = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);
  const [count, setCount] = useState(0);

  const timer$ = interval(1000).pipe(
    map(v => v + time),
    takeWhile(() => running),
  );

  const startTimer = () => {
    setRunning(true);
  };

  const stopTimer = () => {
    setRunning(false);
    setTime(0);
    setCount(0);
  };

  const pauseTimer = () => {
    setRunning(!running);
    setCount(0);
  };

  const clickCounter = () => {
    setCount(count => count + 1);
    setTimeout(() => setCount(count => count - 1), 300);
  };

  const resetTimer = async () => {
    await stopTimer();
    startTimer();
    setCount(0);
  };

  useEffect(() => {
    if (running) {
      const subscription = timer$.subscribe(setTime);
      return () => subscription.unsubscribe();
    }
    // eslint-disable-next-line
  }, [running]);

  useEffect(() => {
    if (count === 2) {
      pauseTimer();
    }
    if (count < 0) {
      setCount(0);
    }
    // eslint-disable-next-line
  }, [count]);

  return (
    <div>
      <button onClick={running ? stopTimer : startTimer}>{running ? `STOP` : `START`}</button>
      <button onClick={clickCounter} disabled={!running}>
        WAIT
      </button>
      <button onClick={resetTimer} disabled={!running}>
        RESET
      </button>
      <p>
        {getTime(time).hours}:{getTime(time).minutes}:{getTime(time).seconds}
      </p>
    </div>
  );
};

export default Timer;
