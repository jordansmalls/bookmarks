import { apiSlice } from "./api-slice";
const BOOKMARKS_URL = "/bookmarks";

export const userApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    // GET all bookmarks for the user
    fetchUserBookmarks: builder.query({
      query: () => ({
        url: BOOKMARKS_URL,
        method: "GET",
      }),
      providesTags: ["Bookmarks"],
    }),

    // GET only favorite bookmarks
    fetchFavoriteBookmarks: builder.query({
      query: () => ({
        url: `${BOOKMARKS_URL}/favorites`,
        method: "GET",
      }),
      providesTags: ["Bookmarks"],
    }),

    // GET single bookmark by ID
    fetchBookmarkById: builder.query({
      query: (id) => ({
        url: `${BOOKMARKS_URL}/${id}`,
        method: "GET",
      }),
      providesTags: (result, error, id) => [{ type: "Bookmarks", id }],
    }),

    // POST create new bookmark
    createBookmark: builder.mutation({
      query: (url) => ({
        url: BOOKMARKS_URL,
        method: "POST",
        body: { url },
      }),
      invalidatesTags: ["Bookmarks"],
    }),

    // POST toggle favorite status
    favoriteBookmark: builder.mutation({
      query: ({ bookmarkId, action }) => ({
        url: `${BOOKMARKS_URL}/favorites`,
        method: "POST",
        body: { bookmarkId, action },
      }),
      invalidatesTags: ["Bookmarks"],
    }),

    // PUT update bookmark details
    updateBookmark: builder.mutation({
      query: ({ id, ...data }) => ({
        url: `${BOOKMARKS_URL}/${id}`,
        method: "PUT",
        body: data,
      }),
      invalidatesTags: (result, error, { id }) => [
        { type: "Bookmarks", id },
        "Bookmarks",
      ],
    }),

    // DELETE bookmark
    deleteBookmark: builder.mutation({
      query: (id) => ({
        url: `${BOOKMARKS_URL}/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: ["Bookmarks"],
    }),
  }),
});

export const {
  useFetchUserBookmarksQuery,
  useFetchFavoriteBookmarksQuery,
  useFetchBookmarkByIdQuery,
  useCreateBookmarkMutation,
  useFavoriteBookmarkMutation,
  useUpdateBookmarkMutation,
  useDeleteBookmarkMutation,
} = userApiSlice;
