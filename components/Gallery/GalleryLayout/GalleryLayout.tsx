import styles from './layout.module.scss';

interface GalleryLayoutProps {
  content: React.ReactNode;
  nav?: React.ReactNode;
}

export const GalleryLayout = ({ content, nav = null }: GalleryLayoutProps) => {
  return (
    <div
      className={`${styles.layout} 
    ${!nav && styles.single_column}`}
    >
      <div className={styles.layout__content}>{content}</div>
      {nav && <div className={styles.layout__nav}>{nav}</div>}
    </div>
  );
};
