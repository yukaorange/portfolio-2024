import { forwardRef } from 'react';

import stylesLoading from '@/components/Layout/Loading/loading.module.scss';
import stylesOverlay from '@/components/Layout/Loading/overlay.module.scss';

export const Loading = forwardRef<HTMLDivElement>((props, ref) => {
  return (
    <div ref={ref} className={stylesLoading.loading}>
      <div className={stylesOverlay.overlay}></div>
    </div>
  );
});

Loading.displayName = 'Loading';
