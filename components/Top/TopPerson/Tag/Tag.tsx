import styles from './tag.module.scss';

export const Tag = () => {
  return (
    <dl className={styles.tag}>
      <div className={`${styles.tag__row} _en`}>
        <dt className={styles.tag__term}>name</dt>
        <dd className={styles.tag__desc}>takaoka</dd>
      </div>
      <div className={`${styles.tag__row} _en`}>
        <dt className={styles.tag__term}>residence</dt>
        <dd className={styles.tag__desc}>kansai</dd>
      </div>
    </dl>
  );
};
