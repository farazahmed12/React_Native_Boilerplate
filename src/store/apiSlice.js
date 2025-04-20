import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

// https://dog.ceo/api/breeds/image/random Fetch!

export const baseQuery = fetchBaseQuery({
  baseUrl: 'https://dog.ceo/api',
  prepareHeaders: async headers => {
    // Optional: Attach token if needed
    const token = ''; // Fetch from storage if needed
    if (token) {
      headers.set('Authorization', `Bearer ${token}`);
    }
    return headers;
  },
});

export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery,
  endpoints: builder => ({
    getDogs: builder.query({
      query: credentials => ({
        url: '/breeds/image/random',
        method: 'GET',
        body: credentials,
      }),
      serializeQueryArgs: ({endpointName, queryArgs}) => {
        return `${endpointName}-${queryArgs}`;
      },
      transformResponse: response => {
        return response;
      },
      refetchOnMountOrArgChange: true,
      refetchOnFocus: true,
      refetchOnReconnect: true,
      keepUnusedDataFor: 3600,
    }),
  }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  keepUnusedDataFor: 3600,
});

export const {useGetDogsQuery} = apiSlice;
