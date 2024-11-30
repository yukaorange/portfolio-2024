import { atom } from 'recoil';

interface LoadProgress {
  modelProgress: number;
  modelTotal: number;
  texturesProgress: number;
  texturesTotal: number;
}

export const loadProgressAtom = atom<LoadProgress>({
  key: 'loadProgressAtom',
  default: {
    modelProgress: 0,
    modelTotal: 66, // GLTFのノード数
    texturesProgress: 0,
    texturesTotal: 16, // テクスチャ数は動的に設定
  },
});
