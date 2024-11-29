import { atom } from 'recoil';

//Loadingコンポーネントにて、ローディング完了時にtrueに変更。これの変更をもって、さらに発火する処理を実行する。(Experienceにおけるエフェクトの開始)
export const intializedCompletedAtom = atom({
  key: 'intializedCompletedAtom',
  default: false,
});
