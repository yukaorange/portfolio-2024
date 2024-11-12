'use client';

import React, { useCallback, useEffect } from 'react';

import Link, { LinkProps } from 'next/link';
import { useRouter, usePathname } from 'next/navigation';
import { useTransitionProgress } from '@/app/TransitionContextProvider';
import { useRecoilState } from 'recoil';
import { currentPageState, arrivalPageState } from '@/store/pageTitleAtom';

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
  const pathName = usePathname();
  const { increaseTransition, decreaseTransition, isMounting, isUnmounting, isTransitioning } =
    useTransitionProgress();
  const [currentPage, setCurrentPage] = useRecoilState(currentPageState);
  const [arrivalPage, setArrivalPage] = useRecoilState(arrivalPageState);

  const updateCurrentPage = (path: string) => {
    const title = path === '/' ? 'portfolio' : path.split('/')[1];
    setCurrentPage({ title, path });
  };

  const updateArrivalPage = (path: string) => {
    const title = path === '/' ? 'portfolio' : path.split('/')[1];
    setArrivalPage({ title, path });
  };

  // useEffect(() => {
  //   console.log('currentPage :', currentPage, '\n', 'arrivalPage :', arrivalPage);
  // }, [currentPage, arrivalPage]);

  const handleTransition = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      onClose(e);

      updateCurrentPage(pathName);
      updateArrivalPage(href);

      //action when unmount
      document.body.classList.add('is-transitioning');
      isTransitioning.current = true;
      isUnmounting.current = true;

      console.log('//////page unmounting////// : ', href);

      await Promise.all([decreaseTransition(), increaseTransition()]);
      document.body.classList.add('is-transition-unmounting');

      //change page
      router.push(href);
      window.scrollTo(0, 0);
      console.log('//////page mounting////// : ', href);

      isUnmounting.current = false;
      isMounting.current = true;
      document.body.classList.remove('is-transition-unmounting');
      document.body.classList.add('is-transition-mounting');

      //action when mount
      await Promise.all([decreaseTransition(), increaseTransition()]);

      document.body.classList.remove('is-transition-mounting');
      document.body.classList.remove('is-transitioning');
      isMounting.current = false;
      isTransitioning.current = false;
    },
    [decreaseTransition, increaseTransition, href, router, currentPage, arrivalPage]
  );

  return (
    <Link target={target} className={className} onClick={handleTransition} href={href} {...props}>
      {children}
    </Link>
  );
};
