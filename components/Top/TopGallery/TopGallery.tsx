import { CanvasGallery } from '@/components/Top/TopGallery/CanvasGallery/CanvasGallery';
import styles from '@/components/Top/TopGallery/gallery.module.scss';

export const Topgallery = () => {
  return (
    <section className={styles.gallery}>
      <div className={styles.gallery__inner}>
        <div className={styles.gallery__content}>
          <CanvasGallery />
        </div>
      </div>
    </section>
  );
};
