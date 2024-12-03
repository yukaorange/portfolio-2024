'use client';

import { useInitializedNortification } from '@/hooks/useInitializedNotification';

export const InitializeNortification = (): null => {
  useInitializedNortification();
  return null;
};
