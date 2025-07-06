import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

const customBaseQuery = fetchBaseQuery({
  baseUrl: 'https://testing.backend.safqaauction.com/api/v1',
});

const createInfiniteQuery = ({
  endpoint,
  dataKey = 'products',
  defaultLimit = 10,
  maxPages = 10,
  startPage = 1,
  customTransform = null,
  enableBidirectional = false,
}) => {
  return {
    infiniteQueryOptions: {
      initialPageParam: startPage,

      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        const totalItemsLoaded = allPages.reduce(
          (total, page) => total + (page?.[dataKey]?.length || 0),
          0,
        );

        // If we've loaded all items, no next page
        if (totalItemsLoaded >= lastPage?.totalCount) {
          return undefined;
        }

        // Otherwise, increment page number
        return lastPageParam + 1;
      },

      getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
        // Always return a function, but only enable bidirectional if requested
        if (!enableBidirectional) {
          return undefined;
        }
        return firstPageParam > startPage ? firstPageParam - 1 : undefined;
      },

      maxPages,
    },

    query: ({queryArg = {}, pageParam}) => {
      const {limit = defaultLimit, ...filters} = queryArg;

      // Build query parameters
      const params = new URLSearchParams({
        page: pageParam?.toString(),
        limit: limit?.toString(),
        ...filters,
      });

      return `${endpoint}?${params.toString()}`;
    },

    transformResponse: response => {
      // Use custom transform if provided
      if (customTransform) {
        return customTransform(response);
      }

      // Default transform
      return {
        [dataKey]: response?.[dataKey] || [],
        totalCount: response?.totalCount || 0,
      };
    },
  };
};

// Enhanced base query with automatic data unwrapping
const unwrappingBaseQuery = async (args, api, extraOptions) => {
  const result = await customBaseQuery(args, api, extraOptions);

  console.log('Base Query Result: **------>', args);

  if (result.error) {
    return result;
  }

  // Unwrap nested data structure - drill down until no more .data keys
  let data = result.data;
  while (data?.data) {
    data = data.data;
  }

  return {...result, data};
};

export const apiSlice = createApi({
  reducerPath: 'api',
  baseQuery: unwrappingBaseQuery,
  endpoints: build => ({
    getProducts: build.infiniteQuery(
      createInfiniteQuery({
        endpoint: '/products',
        dataKey: 'products',
        defaultLimit: 10,
        maxPages: 10,
        startPage: 1,
        customTransform: response => ({
          products: response?.products || [],
          totalCount: response?.totalCount || 0,
        }),
      }),
    ),

    getCart: build.query({
      query: () => '/cart',
    }),
  }),
});

export const {useGetProductsInfiniteQuery} = apiSlice;
