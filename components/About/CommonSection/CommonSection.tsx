import { HeaderSection } from '@/components/Common/HeaderSection/HeaderSection';

import commonStyles from './common.module.scss';

interface CommonSectionProps {
  children: React.ReactNode;
  heading: string;
  lead: string;
}

export const CommonSection = ({ children, heading, lead }: CommonSectionProps) => {
  return (
    <div className={commonStyles.section}>
      <HeaderSection heading={heading} lead={lead} />
      <div className={commonStyles.section__content}>{children}</div>
    </div>
  );
};
