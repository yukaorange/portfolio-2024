import { atom } from 'recoil';

export const isScrollStartAtom = atom({
  key: 'isScrollStartAtom',
  default: false,
});

export const isGallerySectionAtom = atom({
  key: 'isGallerySectionAtom',
  default: false,
});

export const isScrollEndAtom = atom({
  key: 'isScrollEndAtom',
  default: false,
});
