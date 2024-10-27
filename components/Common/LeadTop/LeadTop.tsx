import styles from '@/components/Common/LeadTop/lead.module.scss';

interface LeadTopProps {
  text: string;
}

export const LeadTop = ({ text }: LeadTopProps) => {
  return (
    <div className={styles.lead}>
      <h2 className={`${styles.lead__text} _en _shadow--blue`}>{text}</h2>
      <div className={styles.lead__bars}>
        <div className={styles.lead__bar1}></div>
        <div className={styles.lead__bar2}></div>
      </div>
    </div>
  );
};
