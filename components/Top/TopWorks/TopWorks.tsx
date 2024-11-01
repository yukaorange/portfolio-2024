import { LeadTop } from '@/components/Common/LeadTop/LeadTop';
import { Archive } from '@/components/Top/TopWorks/Archive/Archive';
import { Marquee } from '@/components/Top/TopWorks/Marquee/Marquee';
import styles from '@/components/Top/TopWorks/works.module.scss';

export const TopWorks = () => {
  return (
    <div className={styles.works}>
      <div className={styles.works__inner}>
        <div className={styles.works__content}>
          <div className={styles.works__lead}>
            <LeadTop text="works" />
          </div>
          <div className={`${styles.works__textbox} _shadow-blue`}>
            <p className={styles.works__text}>
              過去に手がけたWebサイト制作の実績や、技術向上のために作成したコーディングのデモ等を掲載しています。
            </p>
          </div>
          <div className={styles.works__archive}>
            <Archive />
          </div>
        </div>
      </div>
      <div className={styles.works__marquee}>
        <Marquee />
      </div>
    </div>
  );
};
