import Image from 'next/image';

import { LeadTop } from '@/components/Common/LeadTop/LeadTop';
import { BgApplication } from './BgApplication/BgApplication';
import styles from './person.module.scss';
import { Stats } from './Stats/Stats';
import { Tag } from './Tag/Tag';

export const TopPerson = () => {
  return (
    <section id="top-person" className={styles.person}>
      <div className={styles.person__inner}>
        <div className={styles.person__content}>
          <div className={styles.person__lead}>
            <LeadTop text="person introduction" />
          </div>
          <div className={styles.person__status}>
            <div className={styles.person__tag}>
              <Tag />
            </div>
            <div className={styles.person__stats}>
              <Stats />
            </div>
            <div className={styles.person__photo}>
              <Image src="/images/top/id_photo.jpg" alt="person image" width={900} height={900} />
            </div>
          </div>
          <BgApplication />
        </div>
      </div>
    </section>
  );
};
