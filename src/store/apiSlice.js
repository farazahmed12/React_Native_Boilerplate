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
  if (typeof endpoint !== 'string') {
    throw new Error('Endpoint must be a string');
  }

  return {
    infiniteQueryOptions: {
      initialPageParam: startPage,

      getNextPageParam: (lastPage, allPages, lastPageParam) => {
        try {
          const totalItemsLoaded = Array.isArray(allPages)
            ? allPages.reduce(
                (total, page) =>
                  total +
                  (Array.isArray(page?.[dataKey]) ? page[dataKey].length : 0),
                0,
              )
            : 0;

          const totalCount = Number(lastPage?.totalCount) || 0;

          if (totalItemsLoaded >= totalCount) {
            return undefined; // All items loaded
          }

          return (
            (typeof lastPageParam === 'number' ? lastPageParam : startPage) + 1
          );
        } catch (error) {
          console.warn('Error in getNextPageParam:', error);
          return undefined;
        }
      },

      getPreviousPageParam: (firstPage, allPages, firstPageParam) => {
        if (!enableBidirectional) {
          return undefined;
        }

        try {
          return firstPageParam > startPage ? firstPageParam - 1 : undefined;
        } catch (error) {
          console.warn('Error in getPreviousPageParam:', error);
          return undefined;
        }
      },

      maxPages,
    },

    query: ({queryArg = {}, pageParam}) => {
      try {
        const {limit = defaultLimit, ...filters} = queryArg || {};

        const params = new URLSearchParams();

        // Ensure page and limit are numbers
        const safePage = typeof pageParam === 'number' ? pageParam : startPage;
        params.append('page', safePage?.toString());
        params.append('limit', Number(limit).toString());

        // Append filters safely
        for (const key in filters) {
          if (
            filters[key] !== undefined &&
            filters[key] !== null &&
            filters[key] !== ''
          ) {
            params.append(key, filters[key].toString());
          }
        }

        return `${endpoint}?${params.toString()}`;
      } catch (error) {
        console.warn('Error in query building:', error);
        return endpoint; // fallback to just the endpoint
      }
    },

    transformResponse: response => {
      try {
        if (typeof customTransform === 'function') {
          return customTransform(response);
        }

        const data = Array.isArray(response?.[dataKey])
          ? response[dataKey]
          : [];

        const totalCount = Number(response?.totalCount) || data.length;

        return {
          [dataKey]: data,
          totalCount,
        };
      } catch (error) {
        console.warn('Error in transformResponse:', error);
        return {
          [dataKey]: [],
          totalCount: 0,
        };
      }
    },
  };
};

// Enhanced base query with automatic data unwrapping
const unwrappingBaseQuery = async (args, api, extraOptions) => {
  const result = await customBaseQuery(args, api, extraOptions);

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
