import styles from './icon.module.scss';

interface XIconProps {
  fillColor?: string;
}

export const XIcon = ({ fillColor = '#f1f1f1' }: XIconProps) => {
  return (
    <svg
      className={styles.xIcon}
      xmlns="http://www.w3.org/2000/svg"
      width="46"
      height="48"
      viewBox="0 0 46 48"
      fill="none"
    >
      <g clipPath="url(#clip0_89_154)">
        <path
          d="M27.3762 20.8136L44.5008 0.907715H40.4428L25.5736 18.1917L13.6976 0.907715H0L17.9589 27.0442L0 47.9186H4.0582L19.7605 29.6661L32.3024 47.9186H46L27.3753 20.8136H27.3762ZM21.818 27.2745L19.9984 24.6719L5.52042 3.96267H11.7536L23.4375 20.6756L25.2571 23.2782L40.4447 45.0026H34.2116L21.818 27.2755V27.2745Z"
          fill={fillColor}
        />
      </g>
      <defs>
        <clipPath id="clip0_89_154">
          <rect width="46" height="47.035" fill={fillColor} transform="translate(0 0.907715)" />
        </clipPath>
      </defs>
    </svg>
  );
};
