import React from 'react';

import styles from './design.module.scss';

export const AboutDesign = () => {
  const contents = [
    {
      title: 'Illustrator',
      content:
        '簡易なアイコンの作成、書き出しといった基本的な操作は行えます。\n本ポートフォリオサイトや、自主制作したWebアプリケーション『色彩感覚トレーニング』で使用している画像はIllustratorで自作しています。',
    },
    {
      title: 'Photoshop',
      content:
        'グラフィックデザインのレイヤー構造、フィルター機能や色彩の知識はフロントエンド実装においても活かせるものだと考えており、PhotoShopの基本的な機能は使えるように訓練しています。\nフィルターの適用、切り抜き等といった簡易な加工から書き出しまで行えます。',
    },
    {
      title: 'Blender',
      content:
        'WebGLに関する技術習得の一環として、3DCG制作の知識をつけるべく、学習しています。本ポートフォリオサイトで使用しているアバターモデルを作る過程で、モデリング、スカルプト、テクスチャペイント、リギング・スキニングなどの操作を習得しました。\n作成したモデルをWeb用に最適化する工夫（リトポロジー、テクスチャアトラスの作成）も行えます。',
    },
    {
      title: 'After Effects',
      content:
        'アニメーションやインタラクションにおける動きのリズムや強弱を見極めるバランス感覚を磨きたいと考えており、モーショングラフィックスの技術習得にも取り組みはじめています。\nアニメーション作成の基本的な操作、Lottie書き出しは行えます。',
    },
  ];

  return (
    <div className={styles.design}>
      <ul className={styles.list}>
        {contents.map((item, key) => {
          return (
            <li key={key} className={`${styles.item}`}>
              <h3 className={`${styles.item__title} _helvetica`}>{item.title}</h3>
              <p className={styles.item__text}>
                {item.content.split('\n').map((line, index) => {
                  return (
                    <React.Fragment key={index}>
                      {line}
                      {/* 最後の行でないのなら、brをレンダリング */}
                      {index < item.content.split('\n').length - 1 && <br />}
                    </React.Fragment>
                  );
                })}
              </p>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
