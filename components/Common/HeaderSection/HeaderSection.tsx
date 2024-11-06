import styles from './header.module.scss';

interface HeaderSectionProps {
  h1?: boolean;
  heading: string;
  lead: string;
}

export const HeaderSection = ({ h1 = false, heading, lead }: HeaderSectionProps) => {
  return (
    <div className={`${styles.header}`}>
      <div className={styles.header__inner}>
        {h1 ? (
          <h1 className={`${styles.header__heading} _en`}>{heading}</h1>
        ) : (
          <h2 className={`${styles.header__heading} _en`}>{heading}</h2>
        )}
        <div className={styles.header__lead__bars}>
          <span className={`${styles.header__lead__bar} ${styles.header__lead__bar1}`}></span>
          <span className={`${styles.header__lead__bar} ${styles.header__lead__bar2}`}></span>
        </div>
      </div>
      {lead && <p className={`${styles.header__lead}`}>{lead}</p>}
    </div>
  );
};
