// import Image from 'next/image';

import { LeadTop } from '@/components/Common/LeadTop/LeadTop';
import { TransitionLink } from '@/components/Common/TransitionLink/TransitionLink';
// import { BgApplication } from '@/components/Top/TopProfile/BgApplication/BgApplication';
import styles from '@/components/Top/TopProfile/profile.module.scss';
// import { Stats } from '@/components/Top/TopProfile/Stats/Stats';
// import { Tag } from '@/components/Top/TopProfile/Tag/Tag';
import { Ticket } from '@/components/Top/TopProfile/Ticket/Ticket';

export const TopProfile = () => {
  return (
    <section id="top-profile" className={styles.profile}>
      <div className={styles.profile__inner}>
        <div className={styles.profile__content}>
          <div className={styles.profile__lead}>
            <LeadTop text="declaration" />
          </div>
          <div className={`${styles.profile__textbox} _shadow--blue`}>
            <p className={`${styles.profile__text} ${styles.kerning} _helvetica`}>
              I began learning to become a frontend engineer. I want to provide technical support to
              help create great websites. I am improving my technical skills to implement diverse
              idea flexibility. I focus not only on learning frontend development but also mastering
              useful design tools. I want to be a member of creative teams.
            </p>
            <p className={`${styles.profile__text}`}>
              Webサイトの創造的な表現に魅了され、その実現を技術面からサポートするフロントエンドエンジニアを目指して学習を始めました。
              <br />
              多様なアイデアを柔軟に実装できるよう、技術力の向上に努めています。
              また、センスを磨くために知識は幅広く持っておく方が良いと考えるため、フロントエンド開発に必要な言語を学ぶだけでなく、デザイン技術やツールの習得にも力を入れています。
              <br />
              多様な専門性を持つクリエイティブチームの一員として、技術的な側面からプロジェクトに貢献したいと考えています。
            </p>
          </div>
        </div>
        {/* <div className={styles.profile__content}>
          <div className={styles.profile__lead}>
            <LeadTop text="person introduction" />
          </div>
          <div className={styles.profile__status}>
            <div className={styles.profile__tag}>
              <Tag />
            </div>
            <div className={styles.profile__stats}>
              <Stats />
            </div>
            <div className={styles.profile__photo}>
              <Image src="/images/top/id_photo.jpg" alt="profile image" width={900} height={900} />
            </div>
          </div>
          <BgApplication />
        </div> */}
        <div className={styles.profile__content}>
          <div className={styles.profile__lead}>
            <LeadTop text="detailed profile" />
          </div>
          <div className={styles.profile__link}>
            <p className={`${styles.profile__text}`}>
              私のエンジニアスキルの詳細を記載しています。
            </p>
            <TransitionLink href={'/about'} scroll={false}>
              <Ticket />
            </TransitionLink>
          </div>
        </div>
      </div>
    </section>
  );
};
