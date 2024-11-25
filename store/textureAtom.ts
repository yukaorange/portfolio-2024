'use client';

import { useTexture } from '@react-three/drei';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { atom, selector, useRecoilValue, useSetRecoilState, SetterOrUpdater } from 'recoil';
import * as THREE from 'three';

interface TextureInfo {
  url: string;
  aspectRatio: number;
}

interface LoadedTextureInfo {
  texture: THREE.Texture;
  aspectRatio: number;
}

import { Content } from '@/lib/microcms';

//currentPageAtomが変更→currentTexturesSelectorが変更→useLoadTexturesが変更、結果として、loadedTexturesAtomが変更となり、テクスチャセットが更新される
//App.tsxでuseSceneを使っているので、WebGLマウント時にテクスチャがロードされる

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

const currentTexturesSelector = selector<TextureInfo[]>({
  key: 'currentTexturesSelector',
  get: ({ get }) => {
    const currentPage = get(currentPageAtom);
    const contents = get(galleryContentsAtom);

    if (currentPage === '/' || currentPage === '/about') {
      return get(topPageGalleryTexturesAtom);
    } else if (currentPage.startsWith('/gallery')) {
      if (contents.length === 0) {
        return [];
      }

      if (Array.isArray(contents)) {
        return contents.map((content) => ({
          url: content.images[0].url,
          aspectRatio: content.images[0].width / content.images[0].height,
        }));
      } else {
        const item = contents as Content;
        return [
          {
            url: item.images[0].url,
            aspectRatio: item.images[0].width / item.images[0].height,
          },
        ];
      }
    }
    return [];
  },
});

export const useCurrentPage = () => useRecoilValue(currentPageAtom);
export const useCurrentTextures = () => useRecoilValue(currentTexturesSelector);
export const useLoadedTextures = () => useRecoilValue(loadedTexturesAtom);
export const useCharacterTexture = () => useRecoilValue(characterTextureAtom);
export const useSuitcaseTexture = () => useRecoilValue(suitcaseTextureAtom);
export const useFloorNormalTexture = () => useRecoilValue(floorNormalTextureAtom);
export const useNoiseTexture = () => useRecoilValue(noiseTextureAtom);
export const useTelopTexture = () => useRecoilValue(telopTextureAtom);
export const useFloorRoughnessTexture = () => useRecoilValue(floorRoughnessTextureAtom);

export const useSetCurrentPage = () => useSetRecoilState(currentPageAtom); //現在のページをセット

export const useLoadTextures = () => {
  const setLoadedTextures = useSetRecoilState(loadedTexturesAtom);
  const currentTextures = useCurrentTextures();

  const textures = useTexture(currentTextures.map((t) => t.url));

  useEffect(() => {
    const texturesWithAspectRatio = textures.map((texture, index) => ({
      texture,
      aspectRatio: currentTextures[index].aspectRatio,
    }));
    setLoadedTextures(texturesWithAspectRatio);
  }, [textures, currentTextures, setLoadedTextures]);

  return textures.map((texture, index) => ({
    texture,
    aspectRatio: currentTextures[index].aspectRatio,
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
  const setCurrentPage = useSetCurrentPage(); //currentPageAtomを更新する
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
  const currentPage = useCurrentPage();
  const setCurrentPage = useSetCurrentPage();
  const currentTextures = useCurrentTextures();
  const loadedTextures = useLoadTextures();
  const [characterTexture, suitcaseTexture] = useLoadCharacterAndSuitcaseTextures();
  const [floorNormalTexture, floorRoughnessTexture] = useLoadFloorTextures();
  const noiseTexture = useLoadNoiseTexture();
  const telopTexture = useLoadTelopTexture();

  //ギャラリーのコンテンツをセットする
  const setGalleryContents = useSetGalleryContents() as SetterOrUpdater<Content[]>;

  useInitializeCurrentPage(); //初回アクセス時currentPageを更新しする。いかなるページであっても、そのページにふさわしいテクスチャをセットする

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
