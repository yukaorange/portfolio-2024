import { TopFv } from '@/components/Top/TopFV/TopFv';
import { Topgallery } from '@/components/Top/TopGallery/TopGallery';
import { TopProfile } from '@/components/Top/TopProfile/TopPlofile';

export default function Top() {
  return (
    <>
      <TopFv />
      <TopProfile />
      <Topgallery />
    </>
  );
}
