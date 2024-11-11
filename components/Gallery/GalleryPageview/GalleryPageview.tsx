import { HeaderSection } from '@/components/Common/HeaderSection/HeaderSection';

import styles from './pageview.module.scss';

interface GalleryPageviewProps {
  heading: string;
  lead: string;
}

export const GalleryPageview = ({ heading, lead }: GalleryPageviewProps) => {
  return (
    <div className={styles.pageview}>
      <HeaderSection h1={true} heading={heading} lead={lead} />
    </div>
  );
};
