import styles from './nav.module.scss';

export const GalleryNav = () => {
  const categories = [
    { category: 'webGL' },
    { category: 'webApp' },
    { category: 'Graphic' },
    { category: 'UI' },
    { category: '3D Model' },
  ];

  return (
    <>
      <div className={styles.nav}>
        <h2 className={styles.title}>カテゴリー</h2>
        <nav className={styles.list}>
          {categories.map((category, key) => {
            return (
              <span key={key} className={`${styles.gategory} _en`}>
                {category.category}
              </span>
            );
          })}
        </nav>
      </div>
    </>
  );
};
