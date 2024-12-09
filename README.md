# Portfolio2024

- Next.js, R3F, microCMSを使用したポートフォリオサイトです

## 【作成目的】

- 転職活動で自身の技術レベルをアピールする目的で作成しました。

## 【取り組んだ内容】

### 実装

- microCMSのAPIからコンテンツを取得し、Next.jsでSSGを行い、Vercelでホスティングしています。
- WebGLで使用するテクスチャ画像をmicroCMSにアップロードし、ページ遷移の度にテクスチャを入れ替えるロジックを作成しました。
- メイン背景は電光掲示板をイメージしています。ジオメトリインスタンシングで出力し、glslを使ってテクスチャをアニメーションさせたり、エフェクトを適用するなど、どんどん変化させることで常に違う出力を楽しむことができます。また、ページのロード完了時やページ遷移時にインタラクティブに変化するようにしています。
- ロード完了時に起こるファーストビューの演出はGUIでタイミングを調節し、テンポ感や余韻が出るように試行錯誤しました。
- 状態管理は基本的にrecoilを使いつつ、インタラクティブに動作するUIで再レンダリングを防ぐためにRefオブジェクトをcontext providerで渡すといった使い分けをしています。
- WebGLについて、モバイル端末ではフレームレートと解像度を下げることで負荷を軽減しています。

### デザイン

- デザインは主にIllustratorとFigmaで作成し、使用しているモデルはblenderで作成しました。
- UIはゲームの画面を意識しています。また、デザインのコンセプトとして、国際線をイメージし、スクロールに合わせて出国から入国までの動線が完了するようになっています（なっているつもりです）。

## 【技術スタック】

- フロントエンド: Next.js, React, TypeScript
- 3Dグラフィックス: Three.js, R3F
- 状態管理: recoil
- CMS: microCMS
- 開発ツール: ESLint, Prettier, styleLint
- デプロイ: vercel
- gltfのコンポーネント化: [https://github.com/pmndrs/gltfjsx]

```
npx gltfjsx public/models/scene_for_portfolio_2024_3.glb -o ./components/Layout/WebGL/Model.tsx -r public --types --draco
```

## 【デザインツール】

- Figma
- Illustrator
- Photoshop
- After Effects

## 参考資料

- インスタンシング(1): [https://qiita.com/nemutas/items/5b72de3ab7870cf2f414]
- インスタンシング(2): [https://note.com/unshift/n/neecb555c849f]
- ポストプロセス: [https://neuliliilli.hatenablog.com/entry/2018/12/07/224326]
- SDFなど: [https://www.shadertoy.com/]
- chromatic dispersion: [https://blog.maximeheckel.com/posts/refraction-dispersion-and-other-shader-light-effects/]
- transition animation: [https://www.youtube.com/watch?v=fx6KMItwJAw]
