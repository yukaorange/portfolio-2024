import { useEffect, useState } from 'react';

import styles from './timezone.module.scss';

interface TimeZone {
  city: string;
  timeZone: string;
  offset: number;
}

const areas: TimeZone[] = [
  { city: 'TOKYO', timeZone: 'Asia/Tokyo', offset: 9 },
  { city: 'NEW YORK', timeZone: 'America/New_York', offset: -4 },
  { city: 'LONDON', timeZone: 'Europe/London', offset: 1 },
  { city: 'JAKARTA', timeZone: 'Asia/Jakarta', offset: 7 },
  { city: 'HONG KONG', timeZone: 'Asia/Hong_Kong', offset: 8 },
];

export const TimeZone = () => {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getTimeForCity = ({ offset }: TimeZone) => {
    const utc = currentTime.getTime() + currentTime.getTimezoneOffset() * 60000; //日本の場合、UTC+9時間なので、getTimezoneOffsetは540分である、よってここに60000を乗算してミリ秒に換算

    const time = new Date(utc + 3600000 * offset); //各国との標準時差に60000*60を乗算してミリ秒に換算

    const hours = time.getHours().toString().padStart(2, '0');
    const minutes = time.getMinutes().toString().padStart(2, '0');

    const timeset = {
      hours: hours,
      minutes: minutes,
    };

    return timeset;
  };

  return (
    <div className={styles.timezone}>
      <ul className={`${styles.timezone__list} _en`}>
        {areas.map(({ city, timeZone, offset }, index) => {
          return (
            <li key={index} className={styles.timezone_list__item}>
              <span className={styles.timezone__city}>{city}</span>
              <span className={styles.timezone__time}>
                <span className={styles.timezone__time__hour}>
                  {
                    getTimeForCity({
                      city: city,
                      timeZone: timeZone,
                      offset: offset,
                    }).hours
                  }
                </span>
                <span className={styles.timezone__time__coron}>:</span>
                <span className={styles.timezone__time__minute}>
                  {
                    getTimeForCity({
                      city: city,
                      timeZone: timeZone,
                      offset: offset,
                    }).minutes
                  }
                </span>
              </span>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
