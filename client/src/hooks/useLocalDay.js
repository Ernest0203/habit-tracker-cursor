import { useEffect, useState } from 'react';
import { formatTimezoneLabel, getUserTimezone, todayString } from '../utils/dates.js';

/**
 * «Сегодня» по локальному часовому поясу.
 * В 00:00 обновляет дату и вызывает onDayChange (галочки сбрасываются без перезагрузки страницы).
 */
export function useLocalDay(onDayChange) {
  const [today, setToday] = useState(todayString);
  const timezone = getUserTimezone();
  const timezoneLabel = formatTimezoneLabel(timezone);

  useEffect(() => {
    let timerId;

    const scheduleNextMidnight = () => {
      const now = new Date();
      const nextMidnight = new Date(now);
      nextMidnight.setDate(now.getDate() + 1);
      nextMidnight.setHours(0, 0, 0, 0);

      const ms = nextMidnight.getTime() - now.getTime();

      timerId = setTimeout(() => {
        setToday(todayString());
        onDayChange?.();
        scheduleNextMidnight();
      }, ms);
    };

    scheduleNextMidnight();
    return () => clearTimeout(timerId);
  }, [onDayChange]);

  return { today, timezone, timezoneLabel };
}
