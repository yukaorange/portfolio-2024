import { atom } from 'recoil';

export const browserState = atom({
  key: 'browserState',
  default: '',
});

export const osState = atom({
  key: 'osState',
  default: '',
});

export const deviceState = atom({
  key: 'deviceState',
  default: '',
});

export const iphoneState = atom({
  key: 'iphoneState',
  default: '',
});