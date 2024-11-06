import styles from './fv.module.scss';

export const TopFv = () => {
  return (
    <div className={styles.fv}>
      <div className={styles.fv__inner}>
        <div className={styles.fv__content}>
          <div className={styles.fv__subcopy}>
            <div className={styles.fv__subcopy__arrows}>
              <div className={styles.fv__subcopy__arrow}>
                <Arrow />
              </div>
              <div className={styles.fv__subcopy__arrow}>
                <Arrow />
              </div>
              <div className={styles.fv__subcopy__arrow}>
                <Arrow />
              </div>
            </div>
            <div className={`${styles.fv__subcopy__textbox} _en _shadow--blue`}>
              <span className={styles.fv__subcopy__text}>crafting</span>
              <span className={styles.fv__subcopy__text}>user</span>
              <span className={styles.fv__subcopy__text}>experience</span>
            </div>
            <div className={styles.fv__subcopy__icon}>
              <Icon />
            </div>
            <div className={`${styles.fv__subcopy__textbox} _en`}>
              <span className={`${styles.fv__subcopy__text} ${styles.mobile__hidden}`}>I</span>
              <span
                className={`${styles.fv__subcopy__text} ${styles.lowercase} ${styles.mobile__hidden}`}
              >
                am
              </span>
            </div>
          </div>
          <div className={styles.fv__maincopy}>
            <div className={`${styles.fv__maincopy__textbox} _en _shadow--blue`}>
              <span className={styles.fv__maincopy__text}>FRONT</span>
              <span className={styles.fv__maincopy__text}>END</span>
              <span className={`${styles.fv__maincopy__text} ${styles.lastword}`}>ENGINEER</span>
            </div>
          </div>
          <h1 className="reader-only">I an FrontEnd Engineer in Japan</h1>
        </div>
      </div>
    </div>
  );
};

interface IconProps {
  width?: string;
  height?: string;
  fill?: string;
}
const Icon = ({ width = '43', height = '18', fill = '#E3E619' }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 43 18"
      fill="none"
      role="img"
      aria-label="gogle"
    >
      <path d="M0 0.5V9.5L14 17.5L20 11.5H23L29 17.5L43 9.5V0.5H0Z" fill={fill} />
    </svg>
  );
};

interface ArrowProps {
  width?: string;
  height?: string;
  fill?: string;
}
const Arrow = ({ width = '14', height = '20', fill = '#F1F1F1' }: ArrowProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 14 20"
      fill="none"
      role="img"
      aria-label="Right arrow"
    >
      <g clipPath="url(#clip0_19_117)">
        <path
          d="M0 0.666656L9.33333 9.99999L0 19.3333H4.66667L14 9.99999L4.66667 0.666656H0Z"
          fill={fill}
        />
      </g>
      <defs>
        <clipPath id="clip0_19_117">
          <rect width="14" height="18.6667" fill="white" transform="translate(0 0.666656)" />
        </clipPath>
      </defs>
    </svg>
  );
};
