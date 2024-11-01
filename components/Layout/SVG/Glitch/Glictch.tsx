import styles from '@/components/Layout/SVG/Glitch/glitch.module.scss';

export const GlitchFilters = () => {
  return (
    <svg
      aria-hidden="true"
      style={{ position: 'absolute', width: '100%', height: '100%' }}
      className={styles.glitch}
    >
      <defs>
        <svg
          id="glitchmask-effect1"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <line className={styles.topE1} x1="0" y1="0" x2="100%" y2="0" />
          <line className={styles.botE1} x1="0" y1="100%" x2="100%" y2="100%" />
        </svg>
        <svg
          id="glitchmask-effect2"
          width="100%"
          height="100%"
          viewBox="0 0 100 100"
          preserveAspectRatio="none"
        >
          <line className={styles.topE2} x1="0" y1="0" x2="100%" y2="0" />
          <line className={styles.botE2} x1="0" y1="100%" x2="100%" y2="100%" />
        </svg>

        <filter
          colorInterpolationFilters="sRGB"
          id="glitchFilter"
          x="0"
          y="0"
          width="100%"
          height="100%"
        >
          {/* base color */}
          <feFlood floodColor="#15151599" result="baseColor" />

          {/* effect1 */}
          <feFlood floodColor="#e3e619" result="EFFECT1_FLOOD_10" />
          <feComposite
            operator="in"
            in="EFFECT1_FLOOD_10"
            in2="SourceAlpha"
            result="EFFECT1_COMP_20"
          />
          <feOffset in="SourceGraphic" dx="-1" dy="0" result="EFFECT1_OFFSET_30" />
          <feMerge result="EFFECT1_MERGE_40">
            <feMergeNode in="baseColor" />
            <feMergeNode in="EFFECT1_COMP_20" />
            <feMergeNode in="EFFECT1_OFFSET_30" />
          </feMerge>
          <feImage
            preserveAspectRatio="none"
            xlinkHref="#glitchmask-effect1"
            result="EFFECT_IMG_50"
          />
          <feComposite
            in2="EFFECT_IMG_50"
            in="EFFECT1_MERGE_40"
            operator="out"
            result="EFFECT1_COMP_60"
          />

          {/* effect2 */}
          <feFlood floodColor="#e3e619" result="EFFECT2_FLOOD_10" />
          <feComposite
            operator="in"
            in="EFFECT2_FLOOD_10"
            in2="SourceAlpha"
            result="EFFECT2_COMP_20"
          />
          <feOffset in="SourceGraphic" dx="1" dy="0" result="EFFECT2_OFFSET_30" />
          <feMerge result="EFFECT2_MERGE_40">
            <feMergeNode in="black" />
            <feMergeNode in="EFFECT2_COMP_20" />
            <feMergeNode in="EFFECT2_OFFSET_30" />
          </feMerge>
          <feImage
            preserveAspectRatio="none"
            xlinkHref="#glitchmask-effect2"
            result="EFFECT2_IMG_50"
          />
          <feComposite
            in2="EFFECT2_IMG_50"
            in="EFFECT2_MERGE_40"
            operator="out"
            result="EFFECT2_COMP_60"
          />

          {/* Final merge */}
          <feMerge result="MERGE_10">
            <feMergeNode in="SourceGraphic" />
            <feMergeNode in="EFFECT1_COMP_60" />
            <feMergeNode in="EFFECT2_COMP_60" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
};
