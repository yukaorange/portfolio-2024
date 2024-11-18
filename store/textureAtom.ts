'use client';

import React, { useEffect } from 'react';
import * as THREE from 'three';
import {
  atom,
  selector,
  useRecoilState,
  useRecoilValue,
  useSetRecoilState,
  SetterOrUpdater,
} from 'recoil';
import { Content } from '@/lib/microcms';
import { useTexture } from '@react-three/drei';
import { usePathname } from 'next/navigation';

//currentPageAtomが変更→currentTexturesSelectorが変更→useLoadTexturesが変更、結果として、loadedTexturesAtomが変更となり、テクスチャセットが更新される

const currentPageAtom = atom<string>({
  key: 'currentPageAtom',
  default: '/',
});

const topPageGalleryTexturesAtom = atom<string[]>({
  key: 'topPageGalleryTexturesAtom',
  default: [
    '/images/textures/terrain-normal.jpg',
    '/images/textures/terrain-roughness.jpg',
    '/images/textures/noise.png',
  ],
});

export const galleryContentsAtom = atom<Content[]>({
  key: 'galleryContentsAtom',
  default: [],
});

const loadedTexturesAtom = atom<THREE.Texture[]>({
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

const currentTexturesSelector = selector<string[]>({
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

      return contents.map((content) => content.thumbnail.url);
    }
    return [];
  },
});

export const useCurrentPage = () => useRecoilValue(currentPageAtom);
export const useSetCurrentPage = () => useSetRecoilState(currentPageAtom);
export const useCurrentTextures = () => useRecoilValue(currentTexturesSelector);
export const useLoadedTextures = () => useRecoilValue(loadedTexturesAtom);
export const useCharacterTexture = () => useRecoilValue(characterTextureAtom);
export const useSuitcaseTexture = () => useRecoilValue(suitcaseTextureAtom);

export const useLoadTextures = () => {
  const [loadedTextures, setLoadedTextures] = useRecoilState(loadedTexturesAtom);
  const currentTextures = useCurrentTextures();

  const textures = useTexture(currentTextures);

  useEffect(() => {
    setLoadedTextures(textures);
  }, [textures, setLoadedTextures]);

  return textures;
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

export const useSetGalleryContents = () => {
  return useSetRecoilState(galleryContentsAtom);
};

export const useInitializeCurrentPage = () => {
  const setCurrentPage = useSetCurrentPage();
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
  const setGalleryContents = useSetGalleryContents() as SetterOrUpdater<Content[]>;
  const [characterTexture, suitcaseTexture] = useLoadCharacterAndSuitcaseTextures();

  useInitializeCurrentPage();

  return {
    currentPage,
    setCurrentPage, //Transition Linkでページ遷移するたびにcurrentPageAtomが更新されるようにしている
    currentTextures,
    loadedTextures,
    setGalleryContents,
    characterTexture,
    suitcaseTexture,
  };
};
