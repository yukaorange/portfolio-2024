// atoms.ts
import { atom } from 'recoil';

export const currentPageState = atom({
  key: 'currentPageState',
  default: {
    title: '',
    path: '',
  },
});

export const arrivalPageState = atom({
  key: 'arrivalPageState',
  default: {
    title: '',
    path: '',
  },
});

export const isManualNavigationState = atom({
  key: 'isManualNavigationState',
  default: false,
});
