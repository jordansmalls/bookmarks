"use client";

import { useState } from "react";
import Navbar from "../components/navbar/navbar";
import {
  useUpdateUserPasswordMutation,
  useDeleteAllBookmarksMutation,
  useDeleteUserAccountMutation,
} from "../slices/auth-api-slice";
import { toast } from "sonner";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Separator } from "@/components/ui/separator";
import { Link } from "react-router-dom";

const Settings = () => {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [updatePassword, { isLoading: isUpdatingPassword }] =
    useUpdateUserPasswordMutation();
  const [deleteAllBookmarks, { isLoading: isDeletingBookmarks }] =
    useDeleteAllBookmarksMutation();
  const [deleteAccount, { isLoading: isDeletingAccount }] =
    useDeleteUserAccountMutation();

  const handleDeleteAll = async () => {
    try {
      await deleteAllBookmarks().unwrap();
      toast.success("Success!", {
        description: "You have successfully deleted all of your bookmarks.",
      });
    } catch (err) {
      console.error("Error:", err);
      toast.error("Oops! Something went wrong.", {
        description: "We're having trouble, please try again.",
      });
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await deleteAccount().unwrap();
      toast.success("Account deleted", {
        description: "Your account and data have been permanently removed.",
      });
    } catch (err) {
      toast.error("Failed to delete account");
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      return toast.error("New passwords do not match");
    }

    try {
      await updatePassword({
        currentPassword,
        newPassword: newPassword,
      }).unwrap();

      toast.success("Password updated successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update password");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="max-w-2xl mx-auto px-6 py-12">
        <section className="mb-10">
          <h1 className="text-2xl font-semibold tracking-tight text-center">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground text-center">
            Manage your account and security preferences.
          </p>
        </section>

        <div className="space-y-12">
          {/* Security Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
                Security
              </h2>
              <Separator className="mt-2" />
            </div>

            <form onSubmit={handlePasswordUpdate} className="space-y-4">
              <div className="grid gap-2">
                <Label htmlFor="current">Current Password</Label>
                <Input
                  id="current"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="max-w-md"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="new">New Password</Label>
                <Input
                  id="new"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="max-w-md"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="confirm">Confirm New Password</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="max-w-md"
                  required
                />
              </div>
              <Button
                disabled={isUpdatingPassword || !newPassword}
                className="mt-2 transition ease-in-out duration-300"
              >
                {isUpdatingPassword ? "Updating..." : "Update Password"}
              </Button>
            </form>
          </section>

          {/* Danger Zone Section */}
          <section className="space-y-6">
            <div>
              <h2 className="text-sm font-medium uppercase tracking-wider text-destructive">
                Danger Zone
              </h2>
              <Separator className="mt-2 bg-destructive/20" />
            </div>

            <div className="flex flex-col gap-6">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Delete all bookmarks</p>
                  <p className="text-xs text-muted-foreground">
                    This will permanently clear your library.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="text-destructive! border-destructive/20 hover:bg-destructive/5 transition ease-in-out duration-300"
                    >
                      Clear Library
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete all bookmarks?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action is permanent and cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="transition ease-in-out duration-300">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAll}
                        className="bg-destructive hover:bg-destructive/90 transition ease-in-out duration-300"
                      >
                        {isDeletingBookmarks ? "Deleting..." : "Delete All"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <p className="text-sm font-medium">Delete account</p>
                  <p className="text-xs text-muted-foreground">
                    Permanently remove your account and data.
                  </p>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="transition ease-in-out duration-300"
                    >
                      Delete Account
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete your account?</AlertDialogTitle>
                      <AlertDialogDescription>
                        You will lose all your bookmarks and data immediately.
                        This cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="transition ease-in-out duration-300">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={handleDeleteAccount}
                        className="bg-destructive hover:bg-destructive/90 transition ease-in-out duration-300"
                      >
                        {isDeletingAccount
                          ? "Processing..."
                          : "Confirm Deletion"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </section>
        </div>
        <div className="mt-16 flex justify-center">
          <Link
            to="/dashboard"
            className="text-sm text-muted-foreground hover:text-[dodgerblue]! transition-colors duration-200"
          >
            Back to Dashboard
          </Link>
        </div>
      </main>
    </div>
  );
};

export default Settings;
