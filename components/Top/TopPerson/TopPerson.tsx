import Image from 'next/image';

import { LeadTop } from '@/components/Common/LeadTop/LeadTop';

import { BgApplication } from './BgApplication/BgApplication';
import { CTAButton } from './CTAButton/CTAButton';
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
          <div className={styles.person__textbox}>
            <p className={`${styles.person__text} _en`}>
              I tackle challenging tasks with strong curiosity and passion. I am committed to
              continuous learning and growth. I craft experiences with a focus on usability and
              engagement. If you are interested in me, feel free to reach out via DM on X (formerly
              Twitter).
            </p>
            <p className={styles.person__text}>
              困難な課題には強い探求心と熱意をもって挑みます。表現やアイデアの幅を広げるために日々研鑽しております。
              <br />
              ユーザーの立場に立ち、使い心地の良さと体験の豊かさを大切にしたものづくりを目指しています。
              <br />
              もしご興味を持っていただけましたら、いつでもお声かけください。
            </p>
            <p className={styles.person__text}>
              X（旧:Twitter）のDMからご連絡をお待ちしております。
            </p>
          </div>
          <div className={styles.person__contact}>
            <CTAButton />
          </div>
          <BgApplication />
        </div>
      </div>
    </section>
  );
};
