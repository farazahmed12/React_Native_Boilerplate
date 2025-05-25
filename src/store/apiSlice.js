import {createApi, fetchBaseQuery} from '@reduxjs/toolkit/query/react';

// https://dog.ceo/api/breeds/image/random Fetch!

const now = () => new Date().toTimeString().split(' ')[0];

const color = {
  blue: '\x1b[44m%s\x1b[0m',
  green: '\x1b[42m%s\x1b[0m',
  red: '\x1b[41m%s\x1b[0m',
  yellow: '\x1b[43m%s\x1b[0m',
  magenta: '\x1b[45m%s\x1b[0m',
  cyan: '\x1b[46m%s\x1b[0m',
  white: '\x1b[47m%s\x1b[0m',
  orange: '\x1b[48m%s\x1b[0m',
};

const logSection = (label, value, colorTheme) => {
  if (value) {
    console.log(`\x1b[30m${colorTheme}`, ` ${label}:`, value, '\x1b[0m');
  }
};

export const customBaseQuery = ({baseUrl}) => {
  const rawBaseQuery = fetchBaseQuery({baseUrl});

  return async (args, api, extraOptions) => {
    const method = args.method || 'GET';
    const url = typeof args === 'string' ? args : args.url;
    const fullUrl = `${baseUrl}${url}`;
    const endpoint = api.endpoint;

    // 🌐 REQUEST
    console.log('\n' + color.magenta, `[API REQUEST] 📤 ${method} ${fullUrl}`);
    logSection('⏱️ Time', now(), color.magenta);
    logSection('🏷️ Endpoint', endpoint, color.magenta);
    logSection('🧾 Headers', args.headers, color.magenta);
    logSection('📦 Body', args.body, color.magenta);
    logSection('🔸 Params', args.params, color.magenta);

    const result = await rawBaseQuery(args, api, extraOptions);

    if (result.error) {
      // ❌ ERROR
      const status = result.error.status;
      const errData = result.error.data;

      console.log(
        '\n' + `\x1b[30m${color.yellow}`,
        `[API ERROR] ❌ ${method} ${fullUrl}`,
        '\x1b[0m',
      );
      logSection('⏱️ Time', now(), color.yellow);
      logSection('🏷️ Endpoint', endpoint, color.yellow);
      logSection('📉 Status', status, color.yellow);
      logSection('🧨 Error', errData, color.yellow);
    } else {
      // ✅ RESPONSE
      const status = result.meta?.response?.status;
      const resData = result.data;

      console.log('\n' + color.green, `[API RESPONSE] ✅ ${method} ${fullUrl}`);
      logSection('⏱️ Time', now(), color.green);
      logSection('🏷️ Endpoint', endpoint, color.green);
      logSection('📈 Status', status, color.green);
      logSection('📤 Response', resData, color.green);
    }

    return {
      ...result,
      data: result.data?.data ?? result.data,
    };
  };
};

export const apiSlice = createApi({
  reducerPath: 'apiSlice',
  baseQuery: customBaseQuery({baseUrl: 'https://jsonplaceholder.typicode.com'}),
  // baseQuery: customBaseQueryGrok,

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

    getPosts: builder.query({
      query: (q = '') => ({
        url: `/posts${q}`,
        method: 'GET',
      }),
    }),
    getInvalidRoute: builder.query({
      query: () => ({
        url: '/invalid-route',
        method: 'GET',
      }),
    }),
  }),
  refetchOnFocus: true,
  refetchOnReconnect: true,
  keepUnusedDataFor: 3600,
});

export const {useGetDogsQuery, useGetPostsQuery, useGetInvalidRouteQuery} =
  apiSlice;
