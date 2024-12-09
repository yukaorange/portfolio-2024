'use client';

import { useTexture } from '@react-three/drei';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { atom, selector, useRecoilValue, useSetRecoilState, SetterOrUpdater } from 'recoil';
import * as THREE from 'three';

import { Content } from '@/lib/microcms';

import { loadProgressAtom } from './loadProgressAtom';

interface TextureInfo {
  url: string;
  aspectRatio: number;
}

interface LoadedTextureInfo {
  texture: THREE.Texture;
  aspectRatio: number;
}

//2024/11/29
//blenderモデルのロード完了を管理するatomを追加

//currentPageAtomが変更→currentTexturesSelectorが変更→useLoadTexturesが変更、結果として、loadedTexturesAtomが変更となり、テクスチャセットが更新される
//App.tsxでuseSceneを使っているので、WebGLマウント時にテクスチャがロードされる

const TOTAL_TEXTURES = 10;
const ADDITIONAL_TEXTURES = 6;
const TOTAL_TEXTURES_WITH_ADDITIONAL = TOTAL_TEXTURES + ADDITIONAL_TEXTURES;

const NO_ITEM_TEXTURE: TextureInfo = {
  url: '/images/textures/no-item.jpg',
  aspectRatio: 4 / 3,
};

const currentPageAtom = atom<string>({
  key: 'currentPageAtom',
  default: '/',
}); //WebGL/App.tsxにおけるcurrentPageであり、DOMのそれとは別の世界線で管理（変更のタイミングが違うため）。

const topPageGalleryTexturesAtom = atom<TextureInfo[]>({
  key: 'topPageGalleryTexturesAtom',
  default: [
    {
      url: '/images/textures/scroll-down.jpg',
      aspectRatio: 4 / 3,
    },
    {
      url: '/images/textures/thc.jpg',
      aspectRatio: 4 / 3,
    },
    {
      url: '/images/textures/airport-board.jpg',
      aspectRatio: 4 / 3,
    },
    {
      url: '/images/textures/no-item.jpg',
      aspectRatio: 4 / 3,
    },
    {
      url: '/images/textures/no-item.jpg',
      aspectRatio: 4 / 3,
    },
    {
      url: '/images/textures/no-item.jpg',
      aspectRatio: 4 / 3,
    },
    {
      url: '/images/textures/no-item.jpg',
      aspectRatio: 4 / 3,
    },
    {
      url: '/images/textures/no-item.jpg',
      aspectRatio: 4 / 3,
    },
    {
      url: '/images/textures/no-item.jpg',
      aspectRatio: 4 / 3,
    },
    {
      url: '/images/textures/no-item.jpg',
      aspectRatio: 4 / 3,
    },
  ],
});

export const galleryContentsAtom = atom<Content[]>({
  key: 'galleryContentsAtom',
  default: [],
});

const loadedTexturesAtom = atom<LoadedTextureInfo[]>({
  key: 'loadedTexturesAtom',
  default: [],
});

const characterTextureAtom = atom<THREE.Texture | null>({
  key: 'characterTextureAtom',
  default: null,
});

const suitcaseTextureAtom = atom<THREE.Texture | null>({
  key: 'suitcaseTextureAtom',
  default: null,
});

const floorNormalTextureAtom = atom<THREE.Texture | null>({
  key: 'floorNormalTextureAtom',
  default: null,
});

const floorRoughnessTextureAtom = atom<THREE.Texture | null>({
  key: 'floorRoughnessTextureAtom',
  default: null,
});

const noiseTextureAtom = atom<THREE.Texture | null>({
  key: 'noiseTextureAtom',
  default: null,
});

const telopTextureAtom = atom<THREE.Texture | null>({
  key: 'telopTextureAtom',
  default: null,
});

export const modelLoadedAtom = atom<boolean>({
  key: 'modelLoadedAtom',
  default: false,
});

export const initialLoadingAtom = atom<boolean>({
  key: 'initialLoadingAtom',
  default: false,
});

const currentTexturesSelector = selector<TextureInfo[]>({
  key: 'currentTexturesSelector',
  get: ({ get }) => {
    const currentPage = get(currentPageAtom);
    const contents = get(galleryContentsAtom);

    // console.log(`currentPage :`, contents, currentPage);
    // console.log(`contents  :`, currentPage);

    if (currentPage === '/' || currentPage === '/about') {
      // console.log('top or about');
      return get(topPageGalleryTexturesAtom);
    } else if (currentPage.startsWith('/gallery')) {
      // console.log('gallery --');

      let galleryTextures: TextureInfo[] = [];

      if (contents.length === 0) {
        // console.log('no contents');
        galleryTextures = [];
      } else if (Array.isArray(contents)) {
        // console.log(`contents lenght:`, contents.length);

        galleryTextures = contents.map((content) => {
          return {
            url: content.images[0].url,
            aspectRatio: content.images[0].width / content.images[0].height,
          };
        });
      } else {
        const item = contents as Content;
        // console.log(`item :`, item);
        galleryTextures = [
          {
            url: item.images[0].url,
            aspectRatio: item.images[0].width / item.images[0].height,
          },
        ];
      }

      while (galleryTextures.length < TOTAL_TEXTURES) {
        galleryTextures.push(NO_ITEM_TEXTURE);
      }

      return galleryTextures;
    }

    return Array(TOTAL_TEXTURES).fill(NO_ITEM_TEXTURE);
  },
});
// const currentTexturesSelector = selector<TextureInfo[]>({
//   key: 'currentTexturesSelector',
//   get: ({ get }) => {
//     const currentPage = get(currentPageAtom);
//     const contents = get(galleryContentsAtom);

//     // console.log(`currentPage :`, contents, currentPage);
//     // console.log(`contents  :`, currentPage);

//     if (currentPage === '/' || currentPage === '/about') {
//       // console.log('top or about');

//       return get(topPageGalleryTexturesAtom);
//     } else if (currentPage.startsWith('/gallery')) {
//       // console.log('gallery --');

//       if (contents.length === 0) {
//         // console.log('no contents');
//         return [];
//       }

//       if (Array.isArray(contents)) {
//         // console.log(`contents lenght:`, contents.length);

//         return contents.map((content) => ({
//           url: content.images[0].url,
//           aspectRatio: content.images[0].width / content.images[0].height,
//         }));
//       } else {
//         const item = contents as Content;

//         // console.log(`item :`, item);

//         return [
//           {
//             url: item.images[0].url,
//             aspectRatio: item.images[0].width / item.images[0].height,
//           },
//         ];
//       }
//     }
//     return [];
//   },
// });

export const useCurrentPage = () => useRecoilValue(currentPageAtom);
export const useCurrentTextures = () => useRecoilValue(currentTexturesSelector);
export const useLoadedTextures = () => useRecoilValue(loadedTexturesAtom);
export const useCharacterTexture = () => useRecoilValue(characterTextureAtom);
export const useSuitcaseTexture = () => useRecoilValue(suitcaseTextureAtom);
export const useFloorNormalTexture = () => useRecoilValue(floorNormalTextureAtom);
export const useNoiseTexture = () => useRecoilValue(noiseTextureAtom);
export const useTelopTexture = () => useRecoilValue(telopTextureAtom);
export const useFloorRoughnessTexture = () => useRecoilValue(floorRoughnessTextureAtom);
export const useSetCurrentPage = () => useSetRecoilState(currentPageAtom); //WebGLにおける現在のページをセット
export const useInitialLoading = () => useRecoilValue(initialLoadingAtom);
export const useSetInitialLoading = () => useSetRecoilState(initialLoadingAtom);
export const useSetModelLoaded = () => useSetRecoilState(modelLoadedAtom);
const useSetProgress = () => useSetRecoilState(loadProgressAtom);

export const useLoadTextures = () => {
  const setLoadedTextures = useSetRecoilState(loadedTexturesAtom);

  const currentTextures = useCurrentTextures();

  // console.log(`currentTextures :`, currentTextures);

  const textures = useTexture(currentTextures.map((t) => t.url));

  useEffect(() => {
    const texturesWithAspectRatio = currentTextures.map((textureInfo, index) => ({
      texture: textures[index],
      aspectRatio: textureInfo.aspectRatio,
    }));

    setLoadedTextures(texturesWithAspectRatio);
  }, [textures, currentTextures, setLoadedTextures]);

  return currentTextures.map((textureinfo, index) => ({
    texture: textures[index],
    aspectRatio: textureinfo.aspectRatio,
  }));
};

export const useLoadCharacterAndSuitcaseTextures = () => {
  const setCharacterTexture = useSetRecoilState(characterTextureAtom);
  const setSuitcaseTexture = useSetRecoilState(suitcaseTextureAtom);

  const [characterTexture, suitcaseTexture] = useTexture([
    '/images/textures/baked_highquality_for_portfolio.jpg',
    '/images/textures/baked_suitcase.jpg',
  ]);

  useEffect(() => {
    setCharacterTexture(characterTexture);
    setSuitcaseTexture(suitcaseTexture);
  }, [characterTexture, suitcaseTexture, setCharacterTexture, setSuitcaseTexture]);

  return [characterTexture, suitcaseTexture];
};

export const useLoadNoiseTexture = () => {
  const setNoiseTexture = useSetRecoilState(noiseTextureAtom);
  const [noiseTexture] = useTexture(['/images/textures/noise.png']);

  useEffect(() => {
    setNoiseTexture(noiseTexture);
  }, [noiseTexture, setNoiseTexture]);

  return noiseTexture;
};

export const useLoadTelopTexture = () => {
  const setTelopTexture = useSetRecoilState(telopTextureAtom);
  const [telopTexture] = useTexture(['/images/textures/message-on-board-mid.jpg']);

  useEffect(() => {
    setTelopTexture(telopTexture);
  }, [telopTexture, setTelopTexture]);

  return telopTexture;
};

export const useLoadFloorTextures = () => {
  const setFloorNormalTexture = useSetRecoilState(floorNormalTextureAtom);
  const setFloorRoughnessTexture = useSetRecoilState(floorRoughnessTextureAtom);

  const [floorNormalTexture, floorRoughnessTexture] = useTexture([
    '/images/textures/terrain-normal.jpg',
    '/images/textures/terrain-roughness.jpg',
  ]);

  useEffect(() => {
    setFloorNormalTexture(floorNormalTexture);
    setFloorRoughnessTexture(floorRoughnessTexture);
  }, [floorNormalTexture, floorRoughnessTexture, setFloorNormalTexture, setFloorRoughnessTexture]);

  return [floorNormalTexture, floorRoughnessTexture];
};

export const useSetGalleryContents = () => {
  return useSetRecoilState(galleryContentsAtom);
};

export const useInitializeCurrentPage = () => {
  const setCurrentPage = useSetCurrentPage(); //currentPageAtomを更新するメソッド
  const pathname = usePathname();

  //初回アクセス時に、そのページにふさわしいテクスチャをセットする。また、余計な再発火は防ぐ。
  useEffect(() => {
    setCurrentPage((prevPage) => {
      if (prevPage !== pathname) {
        return pathname;
      }
      return prevPage;
    });
  }, [pathname, setCurrentPage]);
};

export const useScene = () => {
  //----------初回アクセス時に発火する処理 ----------
  useInitializeCurrentPage(); //初回アクセス時currentPageを更新しする。いかなるページであっても、そのページにふさわしいテクスチャをセットする

  //----------ページの変更を検知 ----------
  const currentPage = useCurrentPage();
  const setCurrentPage = useSetCurrentPage();

  //----------テクスチャの用意 ----------
  //基本的にはcurrentPageの変更を契機に後続処理が発火する
  const currentTextures = useCurrentTextures();
  const loadedTextures = useLoadTextures();

  //----------ローディングアニメーションの契機と進捗 ----------
  const setInitialLoading = useSetInitialLoading();
  const setProgress = useSetProgress();

  //----------固定で使用するテクスチャの用意(6枚) ----------
  const [characterTexture, suitcaseTexture] = useLoadCharacterAndSuitcaseTextures();
  const [floorNormalTexture, floorRoughnessTexture] = useLoadFloorTextures();
  const noiseTexture = useLoadNoiseTexture();
  const telopTexture = useLoadTelopTexture();

  //----------ページ毎に変化テクスチャの用意 ----------
  //ギャラリーのコンテンツをセットする
  const setGalleryContents = useSetGalleryContents() as SetterOrUpdater<Content[]>;

  //----------ローディングアニメーションの契機 ----------
  useEffect(() => {
    //全てのテクスチャがロードされたら、initialLoadingAtomがtrueとなる。ローディングアニメーションのコンポーネントはこのatomを監視している。
    const loadedTexturesCount =
      loadedTextures.length +
      (characterTexture ? 1 : 0) +
      (suitcaseTexture ? 1 : 0) +
      (floorNormalTexture ? 1 : 0) +
      (floorRoughnessTexture ? 1 : 0) +
      (noiseTexture ? 1 : 0) +
      (telopTexture ? 1 : 0);

    const totalTextures = TOTAL_TEXTURES_WITH_ADDITIONAL;

    // console.log('loadedTexturesCount :', loadedTexturesCount);

    setProgress((prev) => {
      return {
        ...prev,
        texturesProgress: loadedTexturesCount,
        texturesTotal: totalTextures,
      };
    });

    // const allTextureLoaded =
    //   loadedTextures.length === TOTAL_TEXTURES &&
    //   characterTexture !== null &&
    //   suitcaseTexture !== null &&
    //   floorNormalTexture !== null &&
    //   floorRoughnessTexture !== null &&
    //   noiseTexture !== null &&
    //   telopTexture !== null;

    const allTextureLoaded = loadedTexturesCount === totalTextures;

    if (allTextureLoaded) {
      // console.log('All Texture Loaded , initialize is going to be standby');
      setInitialLoading(true);
    }
  }, [
    loadedTextures,
    characterTexture,
    suitcaseTexture,
    floorNormalTexture,
    floorRoughnessTexture,
    noiseTexture,
    telopTexture,
    setInitialLoading,
    setProgress,
  ]);

  // console.log('currentPage : ', currentPage, '\n', 'current Texture', currentTextures);

  return {
    currentPage,
    setCurrentPage, //Transition Linkでページ遷移するたびにcurrentPageAtomが更新されるようにしている
    setGalleryContents,
    currentTextures,
    loadedTextures,
    characterTexture,
    suitcaseTexture,
    floorNormalTexture,
    floorRoughnessTexture,
    noiseTexture,
    telopTexture,
  };
};
