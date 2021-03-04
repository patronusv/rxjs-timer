import { useEffect, useState } from 'react';
import { interval } from 'rxjs';
import { map, takeWhile } from 'rxjs/operators';

import getTime from '../../helpers/helpers';
import { timerContainer, btnContainer, timerBtn, timerClockface } from './Timer.module.css';

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
  };

  const pauseTimer = () => {
    setRunning(!running);
  };

  const clickCounter = () => {
    setCount(count => count + 1);
    setTimeout(() => setCount(count => count - 1), 300);
  };

  const resetTimer = async () => {
    await stopTimer();
    startTimer();
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
    // eslint-disable-next-line
  }, [count]);

  return (
    <div className={timerContainer}>
      <div className={btnContainer}>
        <button onClick={running ? stopTimer : startTimer} className={timerBtn}>
          {running ? `STOP` : `START`}
        </button>
        <button onClick={clickCounter} disabled={!running} className={timerBtn}>
          WAIT
        </button>
        <button onClick={resetTimer} disabled={!running} className={timerBtn}>
          RESET
        </button>
      </div>
      <p className={timerClockface}>
        {getTime(time).hours}:{getTime(time).minutes}:{getTime(time).seconds}
      </p>
    </div>
  );
};

export default Timer;
