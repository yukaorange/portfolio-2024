import { LeadTop } from '@/components/Common/LeadTop/LeadTop';
import { Archive } from '@/components/Top/TopWorks/Archive/Archive';
import { Marquee } from '@/components/Top/TopWorks/Marquee/Marquee';
import styles from '@/components/Top/TopWorks/works.module.scss';

export const TopWorks = () => {
  return (
    <section id="top-works" className={styles.works} data-section="gallery">
      <div className={styles.works__inner}>
        <div className={styles.works__content}>
          <div className={styles.works__lead}>
            <LeadTop text="works & gallery" />
          </div>
          <div className={`${styles.works__textbox} _shadow-blue`}>
            <p className={styles.works__text}>
              過去に手がけたWebサイト制作の実績や、技術向上のために作成したコーディングのデモ等を掲載しています。
            </p>
          </div>
          <div className={styles.works__archive}>
            <Archive />
          </div>
        </div>
      </div>
      <div className={styles.works__marquee}>
        <Marquee />
      </div>
      {/* <div className={styles.works__next}>
        <div className={styles.works__arrows}>
          <div className={styles.works__arrow}>
            <Arrow />
          </div>
          <div className={styles.works__arrow}>
            <Arrow />
          </div>
          <div className={styles.works__arrow}>
            <Arrow />
          </div>
        </div>
      </div> */}
    </section>
  );
};

// interface ArrowProps {
//   width?: string;
//   height?: string;
//   fill?: string;
// }
// const Arrow = ({ width = '14', height = '20', fill = '#808080' }: ArrowProps) => {
//   return (
//     <svg
//       xmlns="http://www.w3.org/2000/svg"
//       width={width}
//       height={height}
//       viewBox="0 0 14 20"
//       fill="none"
//       role="img"
//       aria-label="Right arrow"
//     >
//       <g clipPath="url(#clip0_19_117)">
//         <path
//           d="M0 0.666656L9.33333 9.99999L0 19.3333H4.66667L14 9.99999L4.66667 0.666656H0Z"
//           fill={fill}
//         />
//       </g>
//       <defs>
//         <clipPath id="clip0_19_117">
//           <rect width="14" height="18.6667" fill="white" transform="translate(0 0.666656)" />
//         </clipPath>
//       </defs>
//     </svg>
//   );
// };
