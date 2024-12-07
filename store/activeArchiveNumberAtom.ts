import { atom } from 'recoil';

interface TextureTransitionState {
  currentIndex: number;
  targetIndex: number;
}

export const archiveTextureTransitionAtom = atom<TextureTransitionState>({
  key: 'archiveTextureTransition',
  default: {
    currentIndex: -1,
    targetIndex: -1,
  },
});
