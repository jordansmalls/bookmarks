import React, { useEffect, useRef, useState } from "react";
import { Input } from "@/components/ui/input";

import { Link, CornerRightDown } from "lucide-react";
import { toast } from "sonner";
import { SpinnerButton } from "../buttons/spinner-button";
import { useCreateBookmarkMutation } from "../../slices/bookmark-api-slice";

export function BookmarkForm() {
  const [url, setUrl] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  const [createBookmark, { isLoading }] = useCreateBookmarkMutation();

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;

    let processedUrl = url.trim();

    // If it doesn't start with http:// or https://, prepend https://
    if (!/^https?:\/\//i.test(processedUrl)) {
      processedUrl = `https://${processedUrl}`;
    }

    try {
      await createBookmark(processedUrl).unwrap();
      toast.success("Success!", {
        description: "You have successfully created a new bookmark.",
      });
      setUrl("");
    } catch (err: any) {
      toast.error("Oops! Something went wrong.", {
        description: `${err?.data?.message}`,
      });
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="relative flex items-center w-full max-w-md gap-2 group"
    >
      <div className="relative flex-1">
        <Link className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />

        <Input
          ref={inputRef}
          type="text"
          placeholder="Paste URL..."
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="pl-9 pr-12 focus-visible:ring-2 h-10 rounded-lg focus-visible:ring-[dodgerblue] transition ease-in-out duration-300"
          disabled={isLoading}
          required
        />

        <kbd className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
          <span className="text-xs">⌘</span>K
        </kbd>
      </div>

      <SpinnerButton
        loadingText=""
        isLoading={isLoading}
        type="submit"
        className="px-3 h-10 w-10 shrink-0 transition ease-in-out duration-300 hover:cursor-pointer"
      >
        <CornerRightDown className="h-4 w-4" />
      </SpinnerButton>
    </form>
  );
}
