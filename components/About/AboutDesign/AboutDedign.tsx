import React from 'react';

import styles from './design.module.scss';

export const AboutDesign = () => {
  const contents = [
    {
      title: 'Illustrator',
      content:
        'Illustratorはあらゆるシーンで必要となると考えているので、コーディングのデモを作成する際には積極的に使用するようにしています。簡易なアイコンの作成、書き出しといった基本的な操作は行えます。\n本ポートフォリオサイトや、自主制作したWebアプリケーション『色彩感覚トレーニング』で使用している画像、アイコンはIllustratorで作成しています。',
    },
    {
      title: 'Photoshop',
      content:
        'グラフィックデザインのレイヤー構造、フィルター機能や色彩の知識はフロントエンド実装においても活かせるものだと考えていますので、PhotoShopの重要な機能は使えるように訓練しています。\nフィルターの適用、切り抜きといった簡易なが加工から書き出しまで行えます。',
    },
    {
      title: 'Blender',
      content:
        'WebGLの学習の一環として、3DCG制作の知識をつけるべく、学習しています。\n本ポートフォリオサイトでも使用しているアバターモデルを作る過程で、モデリング、リトポロジ、テクスチャペイント、リギング・スキニング、etcと一通りの操作を習得しました。\n簡易なモデルの作成からWebに最適化する工夫（リトポロジ、テクスチャアトラスの作成）まで行えます。',
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
