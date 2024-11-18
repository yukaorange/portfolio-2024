'use client';

import { useEffect } from 'react';

import { useTransitionProgress } from '@/app/TransitionContextProvider';
import { Content } from '@/lib/microcms';
import { useSetGalleryContents, useInitializeCurrentPage } from '@/store/textureAtom';

interface ClientWrapperProps {
  children: React.ReactNode;
  galleryContents?: Content[];
}

export const ClientWrapper = ({ children, galleryContents }: ClientWrapperProps) => {
  const { notifyMountComplete } = useTransitionProgress();
  const setGalleryContents = useSetGalleryContents();

  useInitializeCurrentPage();

  useEffect(() => {
    // console.log('Page component mounted');

    if (galleryContents) {
      //gallery系ページであったなら、storeにコンテンツをセットする（テクスチャを作成する目的）
      setGalleryContents(galleryContents);
    }

    notifyMountComplete();
  }, [notifyMountComplete, galleryContents, setGalleryContents]);

  return <>{children}</>;
};
