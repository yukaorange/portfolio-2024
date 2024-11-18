'use client';

import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';

import { useTransitionProgress } from '@/app/TransitionContextProvider';
import { currentPageState, arrivalPageState } from '@/store/pageTitleAtom';
import { useSetCurrentPage } from '@/store/textureAtom';

interface TransitionLinkProps extends LinkProps {
  className?: string;
  children: React.ReactNode;
  href: string;
  target?: string;
  onClose?: (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => void;
}

export const TransitionLink = ({
  target,
  className,
  children,
  href,
  onClose = () => {},
  ...props
}: TransitionLinkProps) => {
  const router = useRouter();
  const {
    increaseTransition,
    decreaseTransition,
    isMounting,
    isUnmounting,
    isTransitioning,
    notifyMountComplete,
    startTransition,
    mountCompletePromise,
  } = useTransitionProgress();
  const setCurrentPage = useSetRecoilState(currentPageState);
  const setArrivalPage = useSetRecoilState(arrivalPageState);
  const setWebGLCurrentPage = useSetCurrentPage();

  const updateCurrentPage = useCallback(
    (path: string) => {
      const title = path === '/' ? 'portfolio' : path.split('/')[1];

      setCurrentPage({ title, path });

      setWebGLCurrentPage(path); //textureのリロードは
    },
    [setCurrentPage, setWebGLCurrentPage]
  );

  const updateArrivalPage = useCallback(
    (path: string) => {
      const title = path === '/' ? 'portfolio' : path.split('/')[1];
      setArrivalPage({ title, path });
    },
    [setArrivalPage]
  );

  // useEffect(() => {
  //   console.log('currentPage :', currentPage, '\n', 'arrivalPage :', arrivalPage);
  // }, [currentPage, arrivalPage]);

  const handleTransition = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      // console.log('transitionLink clicked');

      if (isTransitioning.current) {
        // console.log('Now in transition progress, skipping this click event');
        return;
      }

      e.preventDefault();

      onClose(e);

      const currentPath = window.location.pathname;
      const isSamePage = currentPath === href;

      // console.log(
      //   'isSamePage : ',
      //   isSamePage,
      //   '\n',
      //   'currentPath : ',
      //   currentPath,
      //   '\n',
      //   'href',
      //   href
      // );

      updateArrivalPage(href); //set next page

      startTransition();

      //action when unmount
      document.body.classList.add('is-transitioning');
      isTransitioning.current = true;
      isUnmounting.current = true;

      // console.log('//////page unmounting////// : ', href);

      await Promise.all([decreaseTransition(), increaseTransition()]);

      document.body.classList.add('is-transition-unmounting');

      //--------chage route-------//
      if (isSamePage) {
        // console.log('Same page, skipping route change');
        notifyMountComplete();
      } else {
        // console.log('routing to : ', href);
        router.push(href);
        if (mountCompletePromise.current) {
          // console.log('Waiting for page mount to complete');
          await mountCompletePromise.current; //同じページの場合は、router.push()でページ遷移が発生しないため、mountCompletePromise.currentが解決されない。そのため、ここで強制的に解決させる。
        }
        // window.scrollTo(0, 0);
      }
      //--------chage route-------//

      isUnmounting.current = false;
      isMounting.current = true;

      document.body.classList.remove('is-transition-unmounting');
      document.body.classList.add('is-transition-mounting');

      if (mountCompletePromise.current) {
        // console.log('Waiting for page mount to complete');
        await mountCompletePromise.current;
      }

      // console.log('//////page mounted////// : ', href);

      //action when mount
      await Promise.all([decreaseTransition(), increaseTransition()]);

      document.body.classList.remove('is-transition-mounting');
      document.body.classList.remove('is-transitioning');
      isMounting.current = false;
      isTransitioning.current = false;

      updateCurrentPage(href);

      // console.log('transition complete current page is :', href, performance.now());
    },
    [
      decreaseTransition,
      increaseTransition,
      href,
      router,
      startTransition,
      mountCompletePromise,
      notifyMountComplete,
      onClose,
      isMounting,
      isUnmounting,
      isTransitioning,
      updateCurrentPage,
      updateArrivalPage,
    ]
  );

  return (
    <Link target={target} className={className} onClick={handleTransition} href={href} {...props}>
      {children}
    </Link>
  );
};
