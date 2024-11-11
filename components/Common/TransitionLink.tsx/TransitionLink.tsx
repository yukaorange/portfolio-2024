'use client';

import React, { useCallback } from 'react';

import Link, { LinkProps } from 'next/link';
import { useRouter } from 'next/navigation';
import { useTransitionProgress } from '@/app/TransitionContextProvider';

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
  const { increaseTransition, decreaseTransition, isMounting, isUnmounting, isTransitioning } =
    useTransitionProgress();

  const handleTransition = useCallback(
    async (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
      e.preventDefault();
      onClose(e);

      //action when unmount
      isTransitioning.current = true;
      isUnmounting.current = true;
      document.body.classList.add('is-transitioning');

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
    [decreaseTransition, increaseTransition, href, router]
  );

  return (
    <Link target={target} className={className} onClick={handleTransition} href={href} {...props}>
      {children}
    </Link>
  );
};
