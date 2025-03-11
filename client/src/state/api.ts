import { createNewUserInDatabase } from '@/lib/utils';
import { Manager, Tenant } from '@/types/prismaTypes';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { fetchAuthSession, getCurrentUser } from 'aws-amplify/auth';

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
  tagTypes: ['Managers', 'Tenants'],
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
  }),
});

export const {
  useGetAuthUserQuery,
  useUpdateTenantSettingsMutation,
  useUpdateManagerSettingsMutation,
} = api;
