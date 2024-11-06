import { GalleryLayout } from '@/components/Gallery/GalleryLayout/GalleryLayout';
import { GalleryList } from '@/components/Gallery/GalleryList/GalleryList';
import { GalleryNav } from '@/components/Gallery/GalleryNav/GalleryNav';
import { GalleryPageview } from '@/components/Gallery/GalleryPageview/GalleryPageview';

import styles from './gallery.module.scss';

export default function gallery() {
  return (
    <div className={styles.gallery}>
      {/* fv */}
      <GalleryPageview />
      {/* content */}
      <GalleryLayout list={<GalleryList />} nav={<GalleryNav />} />
    </div>
  );
}
