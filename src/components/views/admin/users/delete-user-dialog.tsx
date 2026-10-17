"use client";

import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
  AlertDialogMedia,
  AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import { Trash, Trash2Icon } from "lucide-react";
import { userServices } from "@/services/user";
import { User } from "@/app/admin/users/columns";
import { useSession } from "next-auth/react";

interface DeleteUserDialogProps {
  user: User;
  onRefresh?: () => void;
}

export function DeleteUserDialog({ user, onRefresh }: DeleteUserDialogProps) {
  const { data: session } = useSession();

  const handleDelete = async (id: string) => {
    try {
      const result = await userServices.deleteUser(
        id,
        session?.accessToken as string,
      );
      if (result.status === 200) {
        onRefresh?.();
      }
    } catch {
      // ignore
    }
  };
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive">
          <Trash />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-destructive/10 text-destructive dark:bg-destructive/20 dark:text-destructive">
            <Trash2Icon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete User?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this user.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel variant="outline">Cancel</AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => handleDelete(user.id)}
          >
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
