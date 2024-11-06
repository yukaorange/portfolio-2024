import Image from 'next/image';
import Link from 'next/link';

import styles from './list.module.scss';

export const GalleryList = () => {
  const contents = [
    {
      thumbnail: '/images/icons/training.svg',
      date: '2024/11/06',
      title: 'Color Training App',
      description: '色彩感覚トレーニングのためのWebアプリケーション',
      link: '/introductionColorApp',
      categories: ['WebGL', 'WebApp'],
      newTab: false,
    },
    {
      thumbnail: '/images/icons/blender.svg',
      date: '2024/11/06',
      title: 'character',
      description: '自主制作3Dモデル',
      link: '/character',
      categories: ['Graphic', '3D Model'],
      newTab: false,
    },
    {
      thumbnail: '/images/icons/webgl.svg',
      date: '2024/11/06',
      title: 'Globe Phenomenon',
      description: 'NASAのAPIを使用した自然現象マップ',
      link: 'https://point-of-globe-environment.vercel.app/',
      categories: ['WebGL', 'UI'],
      newTab: true,
    },
    {
      thumbnail: '/images/icons/webgl.svg',
      date: '2024/11/06',
      title: 'Infinite Scroll Gallery',
      description: '円形を描く無限スクロールギャラリー',
      link: '',
      categories: ['WebGL', 'UI'],
      newTab: true,
    },
    {
      thumbnail: '/images/icons/webgl.svg',
      date: '2024/11/06',
      title: 'refraction dispersion',
      description: '6色に分割された屈折表現',
      link: 'https://refraction-dispersion-maxime.vercel.app/',
      categories: ['WebGL'],
      newTab: true,
    },
    {
      thumbnail: '/images/icons/webgl.svg',
      date: '2024/11/06',
      title: 'kirifuda interaction',
      description: 'スクロール連動のcanvasアニメーション',
      link: 'https://kirifuda-interaction-challenge.vercel.app/',
      categories: ['WebGL', 'UI'],
      newTab: true,
    },
    {
      thumbnail: '/images/icons/webgl.svg',
      date: '2024/11/06',
      title: 'Glitch Theater',
      description: '3Dモデルとグリッチ演出を一覧化したもの',
      link: 'https://glitch-theater-challenge.vercel.app/',
      categories: ['WebGL', 'UI'],
      newTab: true,
    },
    {
      thumbnail: '/images/icons/webgl.svg',
      date: '2024/11/06',
      title: 'Scan Ripple ASCII',
      description: '視覚エフェクトを統合したもの',
      link: 'https://scan-ripple-ascii.vercel.app/',
      categories: ['WebGL'],
      newTab: true,
    },
    {
      thumbnail: '/images/icons/webgl.svg',
      date: '2024/11/06',
      title: 'Distortion Scroll',
      description: 'スクロールに連動した画像切り替えと視覚エフェクト',
      link: 'https://webgl-school-project07.vercel.app/',
      categories: ['WebGL', 'UI'],
      newTab: true,
    },
    {
      thumbnail: '/images/icons/webgl.svg',
      date: '2024/11/06',
      title: 'Distortion Scroll',
      description: '円形に動作するテクスチャ変更アニメーション',
      link: 'https://glsl-school02.vercel.app/',
      categories: ['WebGL', 'UI'],
      newTab: true,
    },
    {
      thumbnail: '/images/icons/webgl.svg',
      date: '2024/11/06',
      title: 'neuroal noise',
      description: 'ニューラル模様のノイズエフェクト',
      link: 'https://neuroal-noise.vercel.app/',
      categories: ['WebGL'],
      newTab: true,
    },
    {
      thumbnail: '/images/icons/webgl.svg',
      date: '2024/11/06',
      title: 'caustics under sea',
      description: '海底シーンとコースティックエフェクト',
      link: 'https://caustics-under-water-evanwallace.vercel.app/',
      categories: ['WebGL'],
      newTab: true,
    },
    {
      thumbnail: '/images/icons/webgl.svg',
      date: '2024/11/06',
      title: 'projection mapping and instancing',
      description: 'ジオメトリインスタンシングと投影マッピングの組み合わせ',
      link: 'https://projection-mapping-nu.vercel.app/',
      categories: ['WebGL', 'Graphic'],
      newTab: true,
    },
    {
      thumbnail: '/images/icons/webgl.svg',
      date: '2024/11/06',
      title: 'toonshading physic simulation',
      description: 'トゥーンシェーディングと物理エンジンの組み合わせ',
      link: 'https://toonshading-physic-r3f.vercel.app/',
      categories: ['WebGL', 'Graphic'],
      newTab: true,
    },
    {
      thumbnail: '/images/icons/webgl.svg',
      date: '2024/11/06',
      title: 'toonshading physic simulation',
      description: '深度テクスチャの利用',
      link: 'https://depth-texture-for-geometry-akella.vercel.app/',
      categories: ['WebGL', 'Graphic'],
      newTab: true,
    },
    {
      thumbnail: '/images/icons/webgl.svg',
      date: '2024/11/06',
      title: 'movie texture and dispersion',
      description: '動画テクスチャと屈折エフェクト',
      link: 'https://webgl-school-project08.vercel.app/',
      categories: ['WebGL', 'Graphic'],
      newTab: true,
    },
    {
      thumbnail: '/images/icons/webgl.svg',
      date: '2024/11/06',
      title: 'stacking texture',
      description: 'テクスチャを積み重ねた視覚表現',
      link: 'https://toppan-demo.vercel.app/',
      categories: ['WebGL', 'Graphic'],
      newTab: true,
    },
    {
      thumbnail: '/images/icons/webgl.svg',
      date: '2024/11/06',
      title: 'goodboy digital demo',
      description: 'グリッドとマウスインタラクション',
      link: 'https://goodboydigital-demo.vercel.app/',
      categories: ['WebGL', 'Graphic'],
      newTab: true,
    },
  ];

  return (
    <ul className={styles.list}>
      {contents.map((item, key) => {
        return (
          <li key={key} className={styles.item}>
            <Link
              href={item.link}
              target={item.newTab ? '_blank' : ''}
              className={styles.item__thumbnail}
            >
              <Image
                src={item.thumbnail == '' ? '' : item.thumbnail}
                alt={item.title}
                width={108}
                height={108}
              />
            </Link>
            <div className={styles.item__inner}>
              <div className={`${styles.item__meta} _en`}>
                <span className={styles.item__date}>{item.date}</span>
                <div className={styles.item__categories}>
                  {item.categories.map((item, categoryKey) => {
                    return (
                      <span key={categoryKey} className={styles.item__category}>
                        {item}
                      </span>
                    );
                  })}
                </div>
              </div>
              <Link href={item.link} className={styles.item__body}>
                <h3 className={`${styles.item__title} _helvetica`}>{item.title}</h3>
                <p className={styles.item__description}>{item.description}</p>
              </Link>
              <Link
                href={item.link}
                target={item.newTab ? '_blank' : ''}
                className={styles.item__linkicon}
              >
                {item.newTab ? <LinkIcon /> : null}
              </Link>
            </div>
          </li>
        );
      })}
    </ul>
  );
};

interface LinkIconProps {
  className?: string;
}
const LinkIcon = ({ className = '' }: LinkIconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      className={className}
    >
      <path
        d="M24 8.00001V1.33514e-05M24 1.33514e-05H16M24 1.33514e-05L12 12M9.33333 0H6.4C4.15979 0 3.03968 1.58946e-07 2.18404 0.435973C1.43139 0.819467 0.819467 1.43139 0.435973 2.18404C1.58946e-07 3.03968 0 4.15979 0 6.4V17.6C0 19.8403 1.58946e-07 20.9603 0.435973 21.816C0.819467 22.5687 1.43139 23.1805 2.18404 23.564C3.03968 24 4.15979 24 6.4 24H17.6C19.8403 24 20.9603 24 21.816 23.564C22.5687 23.1805 23.1805 22.5687 23.564 21.816C24 20.9603 24 19.8403 24 17.6V14.6667"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};
