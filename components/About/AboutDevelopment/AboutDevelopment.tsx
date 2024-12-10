import React from 'react';

import styles from './development.module.scss';

export const AboutDevelopment = () => {
  const contents = [
    {
      title: 'HTML',
      content:
        '文章構造にふさわしいタグを選択し、セマンティックな構造を保つよう心がけます。class属性、data属性をスタイリングとスクリプトで使い分けるなど、可読性を意識したコーディングを行います。\n画像最適化（picture要素、srcset属性等）、WAI-ARIAを活用したアクセシビリティ対応も行います。',
    },
    {
      title: 'CSS, SCSS',
      content:
        'CSS変数を使用した共通プロパティの管理、リキッドレイアウト、グリッドレイアウトなど、保守性と効率を意識したコーディングを行います。\nCSS設計は基本的にBEM思想に則って記述します。\n多用なアイデアを実装できるようになるため、ギャラリーサイト（cssDesignAwards、S5 Style）に掲載されているWebサイトのCSSを見るようにしています。\nアニメーション・インタラクションの実装は、ブラウザのレンダリングプロセスを理解し、リフローを起こさないプロパティを使することでパフォーマンスの低下を防ぎます。ユーザーの目線に立ってタイミングやリズムを最適なものに調節します。',
    },
    {
      title: 'JavaScpit, TypeScript',
      content:
        '基本的なUIはスクラッチで実装可能です。\nTypeScriptを使用し、型安全で点検しやすいコーディングを行います。また、SOLID原則に則った読みやすく再利用可能な記述を心がけます。\n当サイトのgalleryページに、過去に挑戦したUIを掲載しています。\nまた、Webアプリケーションの個人制作を通して、非同期処理によるBaasとのデータ交換や、CRUD操作におけるJavaScriptの配列操作の実践的な使用方法を習得しました。',
    },
    {
      title: 'Canvas2D, SVG',
      content:
        'Canvas2Dにおける基本的な図形描画や、テキスト描画、簡易なアニメーションは使えるように訓練しています。SVGにあってはフィルターの作成や、After Effectsを使用した簡易なLottieアニメーションの作成を行えます。',
    },
    {
      title: 'WebGL, Three.js, r3f',
      content:
        'コーディング技術の幅を広げるために、オンライン講義（WebGLスクール、GLSLスクール）や書籍『初めてのWebGL2（出版:オライリー)』を通じて、3DCGの基本的な概念やGLSLでのグラフィック表現を学習しました。\nWebGLを用いたUI実装に面白さを感じたため、継続的にインプットとアウトプットを行い、SNSにて発信しています。\n当ポートフォリオサイトにて使用しているポストエフェクトやSDFは全てスクラッチで作成しています。また、端末ごとに解像度を調整し、フレームレートの制限をかけています。\nインスタンシング、ジオメトリの統合を行い、ドローコールの回数を減らすことでパフォーマンスを最適化しています。',
    },
    {
      title: 'React, Next.js, Astro',
      content:
        'フレームワークのスキル習得を目的に個人制作として、Next.jsを用いた『色彩感覚トレーニング』と題したWebアプリケーションを開発しました。このアプリではNextAuthを使用し、FirebaseとGoogle認証との連携を行いました。\nアプリ内でインタラクティブに変更が加わるUIにはRefオブジェクトを積極的に使い、不要な再レンダリングを抑制し、パフォーマンスを改善しました。また、ユーザーの編集履歴をフロントエンドとバックエンドで共有することで、呼び出したアーカイブにおいても編集履歴を遡れるように工夫しました。\nなお、フロントエンドテストやstorybookでのコンポーネント開発管理といった部分は未経験なので、この点は作成したアプリケーションのアップデートと共に学んでいきます。',
    },
    {
      title: 'WordPress',
      content:
        'カスタム投稿、カスタムフィールド、カスタムタクソノミーといったWordPressの基本機能ついては一通り実装することができます。また、メディアプラットフォーム『note』のRSSから記事タイトルとサムネイルを取得して表示するといった、外部サービスとの連携も行えます。静的な部分にあってもPHPの条件分岐やループを効果的に使用して作業効率と保守性を高めます。\nXSSのロジックと対策を理解し、適切な出力を行うようサニタイズを実施します。',
    },
    {
      title: 'Jamstack',
      content:
        '本ポートフォリオサイトはmicroCMSのAPIからコンテンツを取得し、Next.jsでSSGを行い、Vercelでホスティングしています。webhookを利用し、microCMSでコンテンツを変更すると、自動的に再デプロイが起こるようにしています。\nまた、WebGLで使用するテクスチャ画像をmicroCMSにアップロードし、ページ遷移の度にテクスチャを入れ替えるロジックを作成しました。\n状態管理にはrecoilを使用し、再レンダリングを起こしたくない場合はRefオブジェクトをコンテキスト化するなど、パフォーマンスチューニングを行いました。',
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
