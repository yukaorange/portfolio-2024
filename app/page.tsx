import { ClientWrapper } from '@/app/ClientWrapper';
import { TopFv } from '@/components/Top/TopFv/TopFv';
import { Topgallery } from '@/components/Top/TopGallery/TopGallery';
import { TopProfile } from '@/components/Top/TopProfile/TopPlofile';
import { TopWorks } from '@/components/Top/TopWorks/TopWorks';


export default function Top() {
  return (
    <>
      <ClientWrapper>
        <TopFv />
        <TopProfile />
        <TopWorks />
        <Topgallery />
      </ClientWrapper>
    </>
  );
}
