import { useState, useMemo } from "react";
import {
  useFetchUserBookmarksQuery,
  useFavoriteBookmarkMutation,
} from "../../slices/bookmark-api-slice";
import { format } from "date-fns";
import { BookmarkDropdown } from "./bookmark-dropdown";
import { Spinner } from "../ui/spinner";
import { Star } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

const loadingMessage = (
  <div className="flex gap-4 items-center py-10 self-center text-muted-foreground">
    <Spinner />
    <h2>Loading bookmarks...</h2>
  </div>
);

const BookmarksTable = () => {
  const { data: bookmarks, isLoading, isError } = useFetchUserBookmarksQuery();
  const [favoriteBookmark] = useFavoriteBookmarkMutation();

  const [filterFavorites, setFilterFavorites] = useState(false);

  const displayedBookmarks = useMemo(() => {
    if (!bookmarks) return [];
    if (!filterFavorites) return bookmarks;
    return bookmarks.filter((bm: any) => bm.favorite);
  }, [bookmarks, filterFavorites]);

  const handleFavoriteToggle = async (bm: any) => {
    const action = bm.favorite ? "unfavorite" : "favorite";
    try {
      await favoriteBookmark({ bookmarkId: bm._id, action }).unwrap();
      if (action === "favorite") {
        toast.success("Success!", {
          description: `${bm.url} has been added to your favorites.`,
        });
      }
    } catch (err) {
      toast.error("Failed to update favorite");
    }
  };

  if (isLoading) return loadingMessage;
  if (isError)
    return (
      <div className="py-10 text-center text-red-500">
        Error loading bookmarks! Please refresh the page.
      </div>
    );

  return (
    <div className="w-full max-w-4xl mx-auto mt-8">
      {/* Table Header */}
      <div className="flex justify-between px-6 py-2 mb-2 text-sm font-medium text-muted-foreground border-b border-border/40">
        <div className="flex items-center gap-4">
          {/* Header Star Toggle */}
          <button
            onClick={() => setFilterFavorites(!filterFavorites)}
            className={cn(
              "transition-all duration-200 focus:outline-none p rounded-md hover:bg-muted",
              filterFavorites
                ? "text-yellow-500"
                : "text-muted-foreground/60 hover:text-foreground",
            )}
            title={
              filterFavorites ? "Show all bookmarks" : "Filter by favorites"
            }
          >
            <Star
              className={cn("h-4 w-4", filterFavorites && "fill-yellow-500")}
            />
          </button>

          <span>Title</span>
        </div>
        <span className="pr-10 hidden sm:block">Created At</span>
      </div>

      {/* Bookmark List */}
      <div className="flex flex-col">
        {displayedBookmarks.map((bm) => {
          const domain = new URL(bm.url).hostname.replace("www.", "");

          return (
            <div
              key={bm._id}
              className="group flex items-center justify-between px-4 py-2 transition-colors hover:bg-muted/50 rounded-lg ease-in-out duration-200"
            >
              <div className="flex items-center gap-4 overflow-hidden">
                {/* Row Star Toggle */}
                <button
                  onClick={() => handleFavoriteToggle(bm)}
                  className={cn(
                    "transition-all duration-200 focus:outline-none flex-shrink-0 ml-2",
                    bm.favorite
                      ? "opacity-100"
                      : "md:opacity-0 md:group-hover:opacity-100",
                  )}
                >
                  <Star
                    className={cn(
                      "h-4 w-4 transition-colors",
                      bm.favorite
                        ? "text-yellow-500 fill-yellow-500"
                        : "text-muted-foreground/40 hover:text-yellow-500/80",
                    )}
                    fill={bm.favorite ? "currentColor" : "none"}
                  />
                </button>

                {/* Favicon Container */}
                <div className="flex-shrink-0 w-6 h-6 flex items-center justify-center">
                  <img
                    src={bm.favicon}
                    alt=""
                    className="w-full h-full rounded-sm object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        `https://www.google.com/s2/favicons?sz=64&domain=${domain}`;
                    }}
                  />
                </div>

                {/* Title and URL */}
                <div className="flex items-baseline gap-2 overflow-hidden">
                  <a
                    href={bm.url}
                    target="_blank"
                    rel="noreferrer"
                    className={cn(
                      "text-[15px] font-medium text-foreground truncate hover:underline",
                      // Responsive width limits
                      "max-w-[140px]", // Very small mobile
                      "xs:max-w-[180px]", // Small mobile
                      "sm:max-w-[300px]", // Tablets
                      "md:max-w-[400px]", // Small desktops
                      "lg:max-w-[500px]", // Large screens
                    )}
                    title={bm.title}
                  >
                    {bm.title}
                  </a>
                  <span className="text-sm text-muted-foreground/70 truncate hidden sm:inline">
                    {domain}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="text-sm text-muted-foreground whitespace-nowrap hidden sm:block">
                  {format(new Date(bm.createdAt), "MM/dd/yy")}
                </div>

                <div className="w-8 flex justify-end transition-opacity duration-200 opacity-100 md:opacity-0 md:group-hover:opacity-100">
                  <BookmarkDropdown bookmark={bm} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Empty States */}
      {displayedBookmarks.length === 0 && (
        <div className="py-20 text-center text-muted-foreground border-2 border-dashed rounded-xl mt-2">
          {filterFavorites
            ? "You haven't starred any bookmarks yet."
            : "No bookmarks found. Add your first one above!"}
        </div>
      )}
    </div>
  );
};

export default BookmarksTable;
