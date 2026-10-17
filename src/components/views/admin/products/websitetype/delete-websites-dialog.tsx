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
import { webtypeServices } from "@/services/product/webtype";
import { Webtype } from "@/app/admin/products/websitetype/columns";
import { useSession } from "next-auth/react";

export function DeleteWebtypesDialog({
  data,
  onRefresh,
}: {
  data: Webtype;
  onRefresh?: () => void;
}) {
  const { data: session } = useSession();
  const handleDelete = async () => {
    try {
      const result = await webtypeServices.deleteWebtype(
        data.id,
        session?.accessToken as string,
      );

      if (result.status === 200) {
        onRefresh?.();
      }
    } catch (error) {
      console.log(error);
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
          <AlertDialogTitle>Delete Website Type?</AlertDialogTitle>
          <AlertDialogDescription>
            This will permanently delete this website type.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive" onClick={handleDelete}>
            Delete
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
