'use client';

import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useCallback } from 'react';
import { useSetRecoilState } from 'recoil';

import { useTransitionProgress } from '@/app/TransitionContextProvider';
import { currentPageState, arrivalPageState, isManualNavigationState } from '@/store/pageTitleAtom';
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
    singleTransitionOut,
    singleTransitionIn,
    isMounting,
    isUnmounting,
    isTransitioning,
    notifyMountComplete,
    startTransition,
    mountCompletePromise,
  } = useTransitionProgress();

  const setCurrentPage = useSetRecoilState(currentPageState);
  const setArrivalPage = useSetRecoilState(arrivalPageState);
  const setIsManualNavigation = useSetRecoilState(isManualNavigationState);
  const setWebGLCurrentPage = useSetCurrentPage(); //textureAtom.tsにおいて、WebGlのコンテキストに現在のページを伝達するために使用

  const updateCurrentPage = useCallback(
    (path: string) => {
      const title = path === '/' ? 'portfolio' : path.split('/')[1];

      setCurrentPage({ title, path }); //DOMのページ現在のページを管理する
      setWebGLCurrentPage(path); //これがtextureのリロードを行うための契機となる
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

  const handlePageExit = useCallback(async () => {
    // console.log('//////page unmounting////// : ', href);
    document.body.classList.add('is-transitioning');
    document.body.classList.add('is-transition-unmounting');
    isUnmounting.current = true;
    await Promise.all([decreaseTransition(), increaseTransition(), singleTransitionOut()]);
  }, [decreaseTransition, increaseTransition, isUnmounting, singleTransitionOut]);

  const executePageTransition = useCallback(
    async (isSamePage: boolean) => {
      if (isSamePage) {
        // console.log('Same page, skipping route change');
        notifyMountComplete(); //同じページの場合は、router.push()でページ遷移が発生しないため、mountCompletePromise.currentが解決されない。そのため、ここで強制的に解決させる。
      } else {
        router.push(href);
        if (mountCompletePromise.current) {
          await mountCompletePromise.current;
        }
      }
    },
    [router, mountCompletePromise, notifyMountComplete, href]
  );

  const handlePageEnter = useCallback(async () => {
    isUnmounting.current = false;
    isMounting.current = true;
    document.body.classList.remove('is-transition-unmounting');
    document.body.classList.add('is-transition-mounting');

    if (mountCompletePromise.current) {
      // console.log('Waiting for page mount to complete');
      await mountCompletePromise.current;
    }
    // console.log('//////page mounted////// : ', href);
    await Promise.all([decreaseTransition(), increaseTransition(), singleTransitionIn()]);

    document.body.classList.remove('is-transition-mounting');
    document.body.classList.remove('is-transitioning');
    isMounting.current = false;
    isTransitioning.current = false;
  }, [
    decreaseTransition,
    increaseTransition,
    singleTransitionIn,
    isMounting,
    isTransitioning,
    mountCompletePromise,
    isUnmounting,
  ]);

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
      isTransitioning.current = true;
      setIsManualNavigation(true);

      updateArrivalPage(href); //set next page

      startTransition();
      await handlePageExit();
      //--------chage route-------//
      await executePageTransition(isSamePage);
      //--------chage route-------//
      await handlePageEnter();

      updateCurrentPage(href);
      setIsManualNavigation(false);
      // console.log('transition complete current page is :', href, performance.now());
    },
    [
      href,
      startTransition,
      onClose,
      isTransitioning,
      updateCurrentPage,
      updateArrivalPage,
      handlePageEnter,
      handlePageExit,
      executePageTransition,
      setIsManualNavigation,
    ]
  );

  return (
    <Link target={target} className={className} onClick={handleTransition} href={href} {...props}>
      {children}
    </Link>
  );
};
