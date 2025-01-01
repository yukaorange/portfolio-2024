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

// 現在のページを管理するatom
// これはWebGLコンテキストでのページ状態を管理し、DOMのページ状態とは独立して動作
//WebGL/App.tsxにおけるcurrentPageであり、DOMのそれとは別の世界線で管理（変更のタイミングが違うため）。
const currentPageAtom = atom<string>({
  key: 'currentPageAtom',
  default: '/',
});

// トップページのギャラリーテクスチャを管理するatom
// デフォルトで10枚のテクスチャ情報を保持
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

// ギャラリーのコンテンツを管理するatom
// microCMSから取得したコンテンツを保持
export const galleryContentsAtom = atom<Content[]>({
  key: 'galleryContentsAtom',
  default: [],
});

// ロード済みテクスチャを管理するatom
// Three.jsのテクスチャオブジェクトとアスペクト比の配列を保持
const loadedTexturesAtom = atom<LoadedTextureInfo[]>({
  key: 'loadedTexturesAtom',
  default: [],
});

// 以下、特殊な用途のテクスチャを管理するatom群
// キャラクター用テクスチャ
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

// 3Dモデルのロード状態を管理するatom
export const modelLoadedAtom = atom<boolean>({
  key: 'modelLoadedAtom',
  default: false,
});

// 初期ローディング状態を管理するatom
export const initialLoadingAtom = atom<boolean>({
  key: 'initialLoadingAtom',
  default: false,
});

// 現在のページに応じて表示すべきテクスチャを選択するセレクター
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
          let imageUrl = content.images[0].url || '';

          if (imageUrl == '') {
            imageUrl = '/images/textures/no-item.jpg';
          }

          return {
            url: imageUrl,
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

      // 不足分をNO_ITEM_TEXTUREで埋める
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

// 以下、各種フックのエクスポート
// これらのフックは、コンポーネントでRecoilの状態を簡単に利用するためのもの
//Recoilの状態管理ロジックをカプセル化することで、コンポーネントは単純にuseCharacterTexture()のようなフックを呼び出すだけで済む
//状態管理の実装詳細をコンポーネントから隠蔽でき、関心の分離ができる。=>テクスチャの管理をこのファイルに集約できる
// これにより、コンポーネントは状態管理の実装詳細を気にせず、状態を利用するだけに専念できる

// 現在のページを取得するフック
export const useCurrentPage = () => useRecoilValue(currentPageAtom);
// 現在のテクスチャ情報を取得するフック
export const useCurrentTextures = () => useRecoilValue(currentTexturesSelector);
// ロード済みテクスチャを取得するフック
export const useLoadedTextures = () => useRecoilValue(loadedTexturesAtom);
// キャラクターテクスチャを取得するフック
export const useCharacterTexture = () => useRecoilValue(characterTextureAtom);
// スーツケーステクスチャを取得するフック
export const useSuitcaseTexture = () => useRecoilValue(suitcaseTextureAtom);
// 床のノーマルマップテクスチャを取得するフック
export const useFloorNormalTexture = () => useRecoilValue(floorNormalTextureAtom);
// ノイズテクスチャを取得するフック
export const useNoiseTexture = () => useRecoilValue(noiseTextureAtom);
// テロップテクスチャを取得するフック
export const useTelopTexture = () => useRecoilValue(telopTextureAtom);
// 床のラフネステクスチャを取得するフック
export const useFloorRoughnessTexture = () => useRecoilValue(floorRoughnessTextureAtom);
// 現在のページを設定するフック
export const useSetCurrentPage = () => useSetRecoilState(currentPageAtom); //WebGLにおける現在のページをセット
// 初期ローディング状態を取得するフック
export const useInitialLoading = () => useRecoilValue(initialLoadingAtom);
// 初期ローディング状態を設定するフック
export const useSetInitialLoading = () => useSetRecoilState(initialLoadingAtom);
// モデルロード状態を設定するフック
export const useSetModelLoaded = () => useSetRecoilState(modelLoadedAtom);
// ローディング進捗を設定するフック
const useSetProgress = () => useSetRecoilState(loadProgressAtom);
// テクスチャをロードするためのカスタムフック
export const useLoadTextures = () => {
  const setLoadedTextures = useSetRecoilState(loadedTexturesAtom);

  const currentTextures = useCurrentTextures();

  // console.log(`currentTextures :`, currentTextures);

  const textures = useTexture(currentTextures.map((t) => t.url));

  useEffect(() => {
    // テクスチャがロードされたら、アスペクト比と共にatomに保存
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

// キャラクターとスーツケースのテクスチャをロードするカスタムフック
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

// ノイズテクスチャをロードするカスタムフック
export const useLoadNoiseTexture = () => {
  const setNoiseTexture = useSetRecoilState(noiseTextureAtom);
  const [noiseTexture] = useTexture(['/images/textures/noise.png']);

  useEffect(() => {
    setNoiseTexture(noiseTexture);
  }, [noiseTexture, setNoiseTexture]);

  return noiseTexture;
};

// テロップテクスチャをロードするカスタムフック
export const useLoadTelopTexture = () => {
  const setTelopTexture = useSetRecoilState(telopTextureAtom);
  const [telopTexture] = useTexture(['/images/textures/message-on-board-mid.jpg']);

  useEffect(() => {
    setTelopTexture(telopTexture);
  }, [telopTexture, setTelopTexture]);

  return telopTexture;
};

// 床のテクスチャをロードするカスタムフック
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

// ギャラリーコンテンツを更新するためのフック
// microCMSから取得したコンテンツをRecoilステートに反映するために使用
export const useSetGalleryContents = () => {
  return useSetRecoilState(galleryContentsAtom);
};

// 初期ページ状態を設定するためのカスタムフック
// WebGLシーンのページ状態とNext.jsのルーティング状態を同期させる
export const useInitializeCurrentPage = () => {
  const setCurrentPage = useSetCurrentPage(); //currentPageAtomを更新するメソッド
  const pathname = usePathname();

  //初回アクセス時に、そのページにふさわしいテクスチャをセットする。また、余計な再発火は防ぐ。
  // この処理により、URLに応じた適切なテクスチャがWebGLシーンに反映される
  useEffect(() => {
    setCurrentPage((prevPage) => {
      if (prevPage !== pathname) {
        return pathname;
      }
      return prevPage;
    });
  }, [pathname, setCurrentPage]);
};

// WebGLシーン全体の状態を管理する中核となるカスタムフック
// テクスチャのロード、ページ遷移、ローディング状態など、
// 3Dシーンに必要な全ての状態とその更新ロジックを提供
export const useScene = () => {
  //----------初回アクセス時に発火する処理 ----------
  useInitializeCurrentPage(); //初回アクセス時currentPageを更新しする。いかなるページであっても、そのページにふさわしいテクスチャをセットする

  //----------ページの変更を検知 ----------
  // WebGLシーンのページ状態を管理し、
  // ページ遷移時にテクスチャの更新をトリガーする
  const currentPage = useCurrentPage();
  const setCurrentPage = useSetCurrentPage();

  //----------テクスチャの用意 ----------
  // currentPageの変更を検知して、必要なテクスチャを動的にロード
  // 現在のページに応じて適切なテクスチャセットを準備する
  const currentTextures = useCurrentTextures();
  const loadedTextures = useLoadTextures();

  //----------ローディングアニメーションの契機と進捗 ----------
  const setInitialLoading = useSetInitialLoading();
  const setProgress = useSetProgress();

  //----------固定で使用するテクスチャの用意(6枚) ----------
  // ページに依存しない、アプリケーション共通のテクスチャをロード
  // これらは3Dシーンの基本的な見た目を構成する要素
  const [characterTexture, suitcaseTexture] = useLoadCharacterAndSuitcaseTextures();
  const [floorNormalTexture, floorRoughnessTexture] = useLoadFloorTextures();
  const noiseTexture = useLoadNoiseTexture();
  const telopTexture = useLoadTelopTexture();

  //----------ページ毎に変化テクスチャの用意 ----------
  //ギャラリーのコンテンツをセットする
  const setGalleryContents = useSetGalleryContents() as SetterOrUpdater<Content[]>;

  //----------ローディングアニメーションの契機 ----------
  // すべてのテクスチャのロード状態を監視し、
  // ローディング画面の表示/非表示を制御する
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

    // ローディング進捗状態を更新
    // ユーザーに現在のロード状況をフィードバック
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

    // すべてのテクスチャがロードされたかチェック
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
