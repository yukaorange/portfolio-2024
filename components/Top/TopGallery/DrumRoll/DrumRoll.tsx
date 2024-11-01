import styles from '@/components/Top/TopGallery/DrumRoll/drumroll.module.scss';

interface DrumRollProps {
  currentProgressRef: React.MutableRefObject<number>;
  targetProgressRef: React.MutableRefObject<number>;
}

export const DrumRoll = ({ currentProgressRef, targetProgressRef }: DrumRollProps) => {
  console.log(currentProgressRef.current, targetProgressRef.current);

  const archive = [
    {
      title: 'Globe and Phenomenon',
      url: '/',
      description: 'NASAのAPIを使用した自然現象マップ',
    },
    {
      title: 'Infinite Scroll Gallery',
      url: '/',
      description: '円形を描く無限スクロールギャラリー',
    },
    {
      title: 'Glitch Theater',
      url: '/',
      description: '3Dモデルでグリッチ演出を一覧化したもの',
    },
    {
      title: 'Scan Ripple ASCII',
      url: '/',
      description: '視覚エフェクトを統合したもの',
    },
    {
      title: 'Distortion Scroll',
      url: '/',
      description: 'スクロールに連動した歪みエフェクト',
    },
  ];

  return (
    <ul className={styles.drumroll}>
      {archive.map((item, id) => {
        return (
          <li key={id} className="">
            {item.title}
            {item.description}
          </li>
        );
      })}
    </ul>
  );
};
