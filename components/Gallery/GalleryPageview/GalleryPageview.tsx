import { HeaderSection } from '@/components/Common/HeaderSection/HeaderSection';

import styles from './pageview.module.scss';

export const GalleryPageview = () => {
  return (
    <div className={styles.pageview}>
      <HeaderSection h1={true} heading="gallery" lead="制作したコードやグラフィックを掲載しています。" />
    </div>
  );
};
