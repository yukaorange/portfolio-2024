import styles from './marquee.module.scss';

export const Marquee = () => {
  return (
    <div className={styles.marquee}>
      <div className={styles.marquee__inner}>
        <div className={`${styles.marquee__content} _en`}>LIFE IS JOURNEY</div>
        <div className={`${styles.marquee__content} _en`}>LIFE IS JOURNEY</div>
        <div className={`${styles.marquee__content} _en`}>LIFE IS JOURNEY</div>
        <div className={`${styles.marquee__content} _en`}>LIFE IS JOURNEY</div>
      </div>
    </div>
  );
};
