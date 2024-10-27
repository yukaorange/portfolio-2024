import { getImageProps } from 'next/image';

interface ResponsiveImageProps {
  className?: string;
  altText: string;
  imageSrcPC?: string;
  widthPc?: number;
  heightPc?: number;
  imageSrcSp?: string;
  widthSp?: number;
  heightSp?: number;
}

export const ResponsiveImage = ({
  className = '',
  altText = '',
  widthPc,
  heightPc,
  imageSrcPC,
  imageSrcSp,
  widthSp,
  heightSp,
}: ResponsiveImageProps) => {
  const commonProps = { alt: altText, sizes: '100vw' };

  const {
    props: { ...desktopSet },
  } = getImageProps({
    ...commonProps,
    src: imageSrcPC as string,
    width: widthPc,
    height: heightPc,
  });

  const {
    props: { ...mobileSet },
  } = getImageProps({
    ...commonProps,
    src: imageSrcSp as string,
    width: widthSp,
    height: heightSp,
  });
  return (
    <picture className={className}>
      <source media="(max-width: 780px)" srcSet={mobileSet.srcSet} />
      <img
        {...desktopSet}
        style={{
          width: '100%',
          height: 'auto',
        }}
        alt={altText}
      />
    </picture>
  );
};
