import { cleanParams, createNewUserInDatabase } from '@/lib/utils';
import { Manager, Property, Tenant } from '@/types/prismaTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';
import { FilterState } from '.';

export const api = createApi({
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.NEXT_PUBLIC_API_BASE_URL,
    prepareHeaders: async (headers) => {
      const session = await fetchAuthSession();
      const { idToken } = session.tokens ?? {};
      if (idToken) {
        headers.set('Authorization', `Bearer ${idToken}`);
      }
      return headers;
    },
  }),
  reducerPath: 'api',
  tagTypes: ['Managers', 'Tenants', 'Properties'],
  endpoints: (build) => ({
    addUserToDB: build.query<User, void>({
      queryFn: async (_arg, _api, _extraOptions, baseQuery) => {
        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload['custom:role'] as string;

          const userDetailedResponse = await createNewUserInDatabase(
            user,
            idToken,
            userRole,
            baseQuery
          );

          return {
            data: {
              cognitoInfo: { ...user },
              userInfo: userDetailedResponse.data as Tenant | Manager,
              userRole,
            },
          };
        } catch (error) {
          return {
            error: (error as Error)?.message || 'Could not add user to db',
          };
        }
      },
    }),

    getAuthUser: build.query<User, void>({
      queryFn: async (_arg, _api, _extraOptions, baseQuery) => {
        try {
          const session = await fetchAuthSession();
          const { idToken } = session.tokens ?? {};
          const user = await getCurrentUser();
          const userRole = idToken?.payload['custom:role'] as string;

          const endpoint =
            userRole === 'manager'
              ? `/managers/${user.userId}`
              : `/tenants/${user.userId}`;

          let userDetailedResponse = await baseQuery(endpoint);

          // if user does not exist create new user
          if (
            userDetailedResponse.error &&
            userDetailedResponse.error.status === 404
          ) {
            userDetailedResponse = await createNewUserInDatabase(
              user,
              idToken,
              userRole,
              baseQuery
            );
          }

          return {
            data: {
              cognitoInfo: { ...user },
              userInfo: userDetailedResponse.data as Tenant | Manager,
              userRole,
            },
          };
        } catch (error: unknown) {
          return {
            error: (error as Error)?.message || 'Could not fetch user data',
          };
        }
      },
    }),

    updateManagerSettings: build.mutation<
      Manager,
      { cognitoId: string } & Partial<Manager>
    >({
      query: ({ cognitoId, ...updatedManager }) => ({
        url: `/managers/${cognitoId}`,
        method: 'PUT',
        body: updatedManager,
      }),
      invalidatesTags: (result) => [{ type: 'Managers', id: result?.id }],
    }),

    //property related endpoints
    getProperties: build.query<
      Property[],
      Partial<FilterState & { favoriteIds?: number[] }>
    >({
      query: (filters) => {
        try {
          const params = cleanParams({
            location: filters.location,
            priceMin: filters.priceRange?.[0],
            priceMax: filters.priceRange?.[1],
            beds: filters.beds,
            baths: filters.baths,
            propertyType: filters.propertyType,
            squareFeetMin: filters.squareFeet?.[0],
            squareFeetMax: filters.squareFeet?.[1],
            amenities: filters?.amenities?.join(','),
            availableFrom: filters.availableFrom,
            favoriteIds: filters.favoriteIds?.join(','),
            latitude: filters.coordinates?.[1],
            longitude: filters.coordinates?.[0],
          });

          return { url: 'properties', params };
        } catch (error) {
          console.log('getProperties error - ', error);
        }
      },
      providesTags: (result) =>
        result
          ? [
              ...result.map(({ id }) => ({ type: 'Properties' as const, id })),
              { type: 'Properties', id: 'LIST' },
            ]
          : [{ type: 'Properties', id: 'LIST' }],
    }),

    //tenant related properties
    getTenant: build.query<Tenant, string>({
      query: (cognitoId) => `tenants/${cognitoId}`,
      providesTags: (result) => [{ type: 'Tenants', id: result?.id }],
    }),

    updateTenantSettings: build.mutation<
      Tenant,
      { cognitoId: string } & Partial<Tenant>
    >({
      query: ({ cognitoId, ...updatedTenant }) => ({
        url: `/tenants/${cognitoId}`,
        method: 'PUT',
        body: updatedTenant,
      }),
      invalidatesTags: (result) => [{ type: 'Tenants', id: result?.id }],
    }),

    addFavoriteProperty: build.mutation<
      Tenant,
      { cognitoId: string; propertyId: number }
    >({
      query: ({ cognitoId, propertyId }) => ({
        url: `tenants/${cognitoId}/favorites/${propertyId}`,
        method: 'POST',
      }),
      invalidatesTags: (result) => [
        {
          type: 'Tenants',
          id: result?.id,
        },
        {
          type: 'Properties',
          id: 'LIST',
        },
      ],
    }),

    removeFavoriteProperty: build.mutation<
      Tenant,
      { cognitoId: string; propertyId: number }
    >({
      query: ({ cognitoId, propertyId }) => ({
        url: `tenants/${cognitoId}/favorites/${propertyId}`,
        method: 'DELETE',
      }),
      invalidatesTags: (result) => [
        {
          type: 'Tenants',
          id: result?.id,
        },
        {
          type: 'Properties',
          id: 'LIST',
        },
      ],
    }),
  }),
});

export const {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
  useUpdateManagerSettingsMutation,
  useGetPropertiesQuery,
  useAddFavoritePropertyMutation,
  useRemoveFavoritePropertyMutation,
  useGetTenantQuery,
} = api;
