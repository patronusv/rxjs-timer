import { useEffect, useState } from 'react';
import { interval, fromEvent } from 'rxjs';
import { map, takeWhile, bufferCount, filter } from 'rxjs/operators';

import getTime from '../../helpers/helpers';
import { timerContainer, btnContainer, timerBtn, timerClockface } from './Timer.module.css';

const Timer = () => {
  const [time, setTime] = useState(0);
  const [running, setRunning] = useState(false);

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
    setRunning(false);
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
    const btn = document.getElementById('waitBtn');
    const clickNumber = 2;
    const clickInterval = 300;
    const click$ = fromEvent(btn, 'click')
      .pipe(
        map(() => new Date().getTime()),
        bufferCount(clickNumber, 1),
        filter(timestamps => {
          return timestamps[0] > new Date().getTime() - clickInterval;
        }),
      )
      .subscribe(pauseTimer);
    return () => click$.unsubscribe();
  }, []);

  return (
    <div className={timerContainer}>
      <div className={btnContainer}>
        <button onClick={running ? stopTimer : startTimer} className={timerBtn}>
          {running ? `STOP` : `START`}
        </button>
        <button disabled={!running} className={timerBtn} id="waitBtn">
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
