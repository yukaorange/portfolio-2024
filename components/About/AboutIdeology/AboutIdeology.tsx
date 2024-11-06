import styles from './ideology.module.scss';

export const AboutIdeology = () => {
  return (
    <div className={styles.ideology}>
      <div className={styles.ideology__textbox}>
        <p className={styles.ideology__text}>
          Webサイトの創造的な表現に魅力を感じ、興味を持ったことをきっかけに2022年よりフロントエンドエンジニアリングの学習を始め、日々技術の向上に励んでいます。
        </p>
        <p className={styles.ideology__text}>
          インプット、アウトプットの質を高めるために「なぜ」「何のため」を常に意識し、取り組むようにしています。
        </p>
        <p className={styles.ideology__text}>
          センスを磨くためには知識を幅広く持っておく方が良いと考えるため、開発に必要な言語を学ぶだけでなく、各種デザインツールの操作や配色、レイアウトなどデザイン技術に関する学習にも力を入れています。
        </p>
        <p className={styles.ideology__text}>
          多様な専門性を持つクリエイティブチームの一員として、技術的な側面からプロジェクトに貢献したいと考えています。
        </p>
        <p className={styles.ideology__text}>
          将来的には、高い技術力とデザインの感性を兼ね備えたクリエイティブデベロッパーとして、制作物のユーザー体験と商業的価値を最適化できる存在になりたいです。
        </p>
      </div>
    </div>
  );
};
