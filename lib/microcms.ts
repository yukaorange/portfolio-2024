import { createClient } from 'microcms-js-sdk';

export type Content = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  title: string;
  description: string;
  href: string;
  newTab: boolean;
  content: string;
  category: [
    {
      id: string;
      createdAt: string;
      updatedAt: string;
      publishedAt: string;
      revisedAt: string;
      name: string;
    },
  ];
  thumbnail: {
    url: string;
    height: number;
    width: number;
  };
  images: {
    url: string;
    height: number;
    width: number;
  }[];
};

export type Category = {
  id: string;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
  revisedAt: string;
  name: string;
};

export const GALLERY_LIST_LIMIT = 10;

const throwError = (msg: string) => {
  throw new Error(msg);
};

export const client = createClient({
  serviceDomain: process.env.SERVICE_DOMAIN ?? throwError('SERVICE_DOMAIN is required'),
  apiKey: process.env.API_KEY ?? throwError('API_KEY is required'),
});

interface GetWorksContentsParams {
  offset?: number;
  limit?: number;
}
export const getWorksContents = async (
  { offset, limit }: GetWorksContentsParams = { offset: 10, limit: 10 }
) => {
  const data = await client.get({
    endpoint: 'works',
    queries: {
      offset: offset,
      limit: limit,
    },
  });

  return data;
};

interface getWorksContentsByCategoryParams {
  offset?: number;
  limit?: number;
  categoryId?: string;
}
export const getWorksContentsByCategory = async ({
  offset,
  limit,
  categoryId,
}: getWorksContentsByCategoryParams) => {
  const data = await client.get({
    endpoint: 'works',
    queries: {
      filters: `category[contains]${categoryId}`,
      offset: offset,
      limit: limit,
    },
  });

  return data;
};

export const getWorksDetail = async (slug: string) => {
  const data = await client.get({
    endpoint: 'works',
    contentId: slug,
  });

  return data;
};

export const getWorksCategories = async () => {
  const data = await client.get({
    endpoint: 'categories',
  });

  return data.contents;
};
