import styles from './template.module.scss';

interface TemplateProps {
  children: React.ReactNode;
}

export default function Template({ children }: TemplateProps) {
  return <div className={styles.template}>{children}</div>;
}
