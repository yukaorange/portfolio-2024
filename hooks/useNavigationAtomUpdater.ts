import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';

import { currentPageState, isManualNavigationState } from '@/store/pageTitleAtom';

//ブラウザ機能によるページ遷移を検知し、ページタイトルを更新する。アプリケーションの機能によるページ遷移ロジックは/components/TransitionLink.tsxにて管理
export const useNavigationAtomUpdater = () => {
  const pathname = usePathname();

  // console.log('re rendered : useNavigationAtomUpdater' + `${pathname}` + performance.now());

  const setCurrentPage = useSetRecoilState(currentPageState);

  const isManualNavigation = useRecoilValue(isManualNavigationState);

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (!isManualNavigation) {
        const title = url === '/' ? 'portfolio' : url.split('/')[1];
        setCurrentPage({ title, path: url });
      }
    };

    handleRouteChange(pathname);
  }, [pathname, setCurrentPage, isManualNavigation]);
};
