import { HeaderSection } from '@/components/Common/HeaderSection/HeaderSection';

import styles from './pageview.module.scss';

interface ArticlePageviewProps {
  title?: string;
  description?: string;
}

export const ArticlePageview = ({
  title = 'article',
  description = '実績・デモの詳細',
}: ArticlePageviewProps) => {
  return (
    <div className={styles.pageview}>
      <HeaderSection h1={true} heading={title} lead={description} />
    </div>
  );
};
