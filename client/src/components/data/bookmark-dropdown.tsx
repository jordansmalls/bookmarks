"use client";

import { useState } from "react";
import { MoreHorizontalIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

import {
  useDeleteBookmarkMutation,
  useUpdateBookmarkMutation,
} from "../../slices/bookmark-api-slice";

interface Bookmark {
  _id: string;
  title: string;
  url: string;
}

export function BookmarkDropdown({ bookmark }: { bookmark: Bookmark }) {
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  const [editTitle, setEditTitle] = useState(bookmark.title);
  const [editUrl, setEditUrl] = useState(bookmark.url);

  const [deleteBookmark, { isLoading: isDeleting }] =
    useDeleteBookmarkMutation();
  const [updateBookmark, { isLoading: isUpdating }] =
    useUpdateBookmarkMutation();

  // Copy Link handler
  const handleCopyLink = () => {
    navigator.clipboard.writeText(bookmark.url);
    toast.success("Link copied!", {
      description: "The URL has been copied to your clipboard.",
    });
  };

  const handleUpdate = async () => {
    try {
      await updateBookmark({
        id: bookmark._id,
        title: editTitle,
        url: editUrl,
      }).unwrap();
      toast.success("Success!", {
        description: "Your bookmark has been successfully updated.",
      });
      setShowEditDialog(false);
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update bookmark");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteBookmark(bookmark._id).unwrap();
      toast.success("Bookmark has been deleted.", {
        description: "You have successfully deleted the bookmark.",
      });
      setShowDeleteDialog(false);
    } catch (err: any) {
      toast.error("Failed to delete bookmark");
    }
  };

  return (
    <>
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="h-8 w-8 p-0 focus-visible:ring-1 focus-visible:ring-ring"
          >
            <span className="sr-only">Open menu</span>
            <MoreHorizontalIcon className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-40" align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuItem
            onSelect={handleCopyLink}
            className="transition ease-in-out duration-200 cursor-pointer"
          >
            Copy Link
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setShowEditDialog(true)}
            className="transition ease-in-out duration-200 cursor-pointer"
          >
            Edit
          </DropdownMenuItem>
          <DropdownMenuItem
            onSelect={() => setShowDeleteDialog(true)}
            className="text-destructive focus:text-destructive transition ease-in-out duration-200 cursor-pointer"
          >
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Modal */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Update Bookmark</DialogTitle>
            <DialogDescription>
              Make changes to your bookmark title or destination URL here.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={editTitle}
                onChange={(e) => setEditTitle(e.target.value)}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="url">URL</Label>
              <Input
                id="url"
                value={editUrl}
                onChange={(e) => setEditUrl(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowEditDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleUpdate} disabled={isUpdating}>
              {isUpdating ? "Updating..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{bookmark.title}</strong>?
              This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2 sm:gap-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button
              variant="destructive"
              onClick={handleDelete}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete Bookmark"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
