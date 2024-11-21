import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { useSetRecoilState, useRecoilValue } from 'recoil';

import { currentPageState, isManualNavigationState } from '@/store/pageTitleAtom';

export const useNavigationAtomUpdater = () => {
  const pathname = usePathname();

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
