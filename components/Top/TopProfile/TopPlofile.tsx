import styles from '@/components/Top/TopProfile/profile.module.scss';

export const TopProfile = () => {
  return (
    <section className={styles.profile}>
      <div className={styles.profile__inner}>
        <div className={styles.profile__content}></div>
      </div>
    </section>
  );
};
