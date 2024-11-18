import { ClientWrapper } from '@/app/ClientWrapper';
import { AboutDesign } from '@/components/About/AboutDesign/AboutDedign';
import { AboutDevelopment } from '@/components/About/AboutDevelopment/AboutDevelopment';
import { AboutIdeology } from '@/components/About/AboutIdeology/AboutIdeology';
import { CommonSection } from '@/components/About/CommonSection/CommonSection';

import styles from './about.module.scss';

export default function About() {
  return (
    <ClientWrapper>
      <div className={styles.about}>
        <h1 className="reader-only">
          about:私のフロントエンド言語とデザインツールのスキルについて
        </h1>
        <CommonSection heading="about me" lead="エンジニアとしての私について">
          <AboutIdeology />
        </CommonSection>
        <CommonSection
          heading="development"
          lead="フロントエンドエンジニアリングに関するスキルと取り組む姿勢"
        >
          <AboutDevelopment />
        </CommonSection>
        <CommonSection heading="design" lead="デザインツールのスキルと学習意図">
          <AboutDesign />
        </CommonSection>
      </div>
    </ClientWrapper>
  );
}
