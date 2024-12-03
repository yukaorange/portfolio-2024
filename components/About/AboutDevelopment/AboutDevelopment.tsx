import React from 'react';

import styles from './development.module.scss';

export const AboutDevelopment = () => {
  const contents = [
    {
      title: 'HTML',
      content:
        '文章構造にふさわしいタグを選択し、セマンティックな構造を保つよう心がけます。class属性、data属性をスタイリングとスクリプトで使い分けるなど、可読性を意識したコーディングを行います。',
    },
    {
      title: 'CSS, SCSS',
      content:
        'CSS変数を使用した共通プロパティの管理、リキッドレイアウト、グリッドレイアウトなど、保守性と効率を意識したコーディングを行います。\nCSS設計は基本的にBEM思想に則って記述します。プロジェクトに応じて柔軟に対応できるように、様々なWebサイトのCSS設計を見るようにしています。',
    },
    {
      title: 'JavaScpit, TypeScript',
      content:
        '各種基本的なUIはスクラッチで実装可能です。\nTypeScriptを使用し、型安全で点検しやすいコーディングを行います。また、SOLID原則などの設計理論を意識し、読みやすく再利用可能な記述を心がけます。',
    },
    {
      title: 'Canvas2D, SVG',
      content:
        'Canvas2Dにおける基本的な画像描画や、テキスト描画、矩形アニメーションは使えるように訓練しています。SVGにあってはフィルターの作成や、簡易なLottieアニメーションの作成から実装など行えます。',
    },
    {
      title: 'WebGL, Three.js, r3f',
      content:
        'コーディング技術の幅を広げるために、オンライン講義（WebGLスクール、GLSLスクール）や書籍『初めてのWebGL2（出版:オライリー)』を通じて、3DCGの基本的な概念やGLSLでのグラフィック表現を学習しました。\nWebGLを用いたUI実装に面白さを感じたため、継続的にインプットとアウトプットを行い、SNSにて発信しています。',
    },
    {
      title: 'React, Next.js, Astro',
      content:
        '個人制作として、Next.jsを用いた『色彩感覚トレーニング』と題したWebアプリケーションを開発しました。NextAuthを使用したFirebaseとGoogle認証との連携、色彩選択ライブラリを導入したインタラクティブなUIの実装を行いました。その過程で、Reactのライフサイクルやパフォーマンスチューニングについて学ぶことができました。また、本ポートフォリオサイトにあってもNext.jsで作成しています。\nしかしながら、フロントエンドテストやstorybookでのコンポーネント開発管理といった部分は未経験なので、この点は作成したアプリケーションのアップデートと共に学習していきたいです。',
    },
    {
      title: 'WordPress',
      content:
        'カスタム投稿、カスタムフィールド、カスタムタクソノミーについては一通り実装することができます。また、メディアプラットフォーム『note』のRSSから記事タイトルとサムネイルを取得して表示するといった、外部サービスとの連携も行えます。静的な部分にあってもPHPの条件分岐やループを効果的に使用して作業効率と保守性を高めます。\nローカルでの開発環境はVITEとMAMPで作成しています。GitHub Actionsを利用し、公開用サーバーにコードの変更結果が転送されるようにしています。',
    },
    {
      title: 'Jamstack',
      content:
        '本ポートフォリオサイトはmicroCMSのAPIからコンテンツを取得し、Next.jsでSSGを行い、Vercelでホスティングしています。また、SEO対策として、metaタグやrobots.txt、sitemap.xmlを設定し、Google Search Consoleでインデックスされるようにしています。',
    },
    {
      title: 'DevEnv CI/CD',
      content:
        'WordPress開発に関連して、ローカルでの開発環境はVITEとMAMPで作成しています。また、GitHub Actionsを利用し、公開用サーバーにコードの変更結果が自動で転送されるようにしています。',
    },
  ];

  return (
    <div className={styles.development}>
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
