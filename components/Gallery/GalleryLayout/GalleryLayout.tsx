import styles from './layout.module.scss';

interface GalleryLayoutProps {
  list: React.ReactNode;
  nav: React.ReactNode;
}

export const GalleryLayout = ({ list, nav }: GalleryLayoutProps) => {
  return (
    <div className={styles.layout}>
      <div className={styles.layout__list}>{list}</div>
      <div className={styles.layout__nav}>{nav}</div>
    </div>
  );
};
