import styles from '@/components/Top/TopWorks/Marquee/marquee.module.scss';

export const Marquee = () => {
  return (
    <>
      <div className={`${styles.marquee} _en`}>
        <div className={styles.marquee__inner}>
          <div className={styles.marquee__content}></div>
          <div className={styles.marquee__content}></div>
        </div>
        <div className={styles.marquee__bg}>
          {Array(10)
            .fill(0)
            .map((_, index) => {
              return <div className={styles.marquee__bg__banner} key={index}></div>;
            })}
        </div>
      </div>
    </>
  );
};
