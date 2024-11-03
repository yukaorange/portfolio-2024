import { atom } from 'recoil';

export interface NavLink {
  title: string;
  link: string;
}

export const navLinksAtom = atom<NavLink[]>({
  key: 'navLinks',
  default: [
    {
      title: 'TOP',
      link: '/',
    },
    {
      title: 'ABOUT',
      link: '/about',
    },
    {
      title: 'GALLERY',
      link: '/gallery',
    },
    {
      title: 'X',
      link: 'https://x.com/webcreaterfrm30',
    },
    {
      title: 'GitHub',
      link: 'https://github.com/yukaorange',
    },
  ],
});
