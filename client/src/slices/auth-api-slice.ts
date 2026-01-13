import { apiSlice } from "./api-slice";
import { logout } from "./auth-slice";

const AUTH = "/auth";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    signup: builder.mutation({
      query: (data) => ({
        url: `${AUTH}`,
        method: "POST",
        body: data,
      }),
    }),
    login: builder.mutation({
      query: (data) => ({
        url: `${AUTH}/login`,
        method: "POST",
        body: data,
      }),
    }),
    logout: builder.mutation({
      query: () => ({
        url: `${AUTH}/logout`,
        method: "POST",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (err) {
          console.error("Logout failed:", err);
        }
      },
    }),
    fetchUserAccount: builder.mutation({
      query: (data) => ({
        url: `${AUTH}/me`,
        method: "GET",
        body: data,
      }),
    }),
    updateUserPassword: builder.mutation({
      query: (data) => ({
        url: `${AUTH}/password`,
        method: "PUT",
        body: data,
      }),
    }),
    fetchEmailAvailability: builder.mutation({
      query: (email) => ({
        url: `${AUTH}/check-email/${email}`,
        method: "GET",
      }),
    }),
    deleteAllBookmarks: builder.mutation({
      query: () => ({
        url: `${AUTH}/delete-all-bookmarks`,
        method: "DELETE",
      }),

      invalidatesTags: ["Bookmarks"],
    }),
    deleteUserAccount: builder.mutation({
      query: () => ({
        url: `${AUTH}`,
        method: "DELETE",
      }),
      invalidatesTags: ["User", "Bookmarks"],
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          dispatch(logout());
        } catch (err) {
          console.error("Account deletion/cleanup failed:", err);
        }
      },
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useLogoutMutation,
  useUpdateUserPasswordMutation,
  useFetchEmailAvailabilityMutation,
  useFetchUserAccountMutation,
  useDeleteUserAccountMutation,
  useDeleteAllBookmarksMutation,
} = userApiSlice;
