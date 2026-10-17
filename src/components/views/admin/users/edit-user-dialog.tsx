"use client";

import { useState, FormEvent } from "react";
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
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Edit } from "lucide-react";
import { User } from "@/app/admin/users/columns";
import { userServices } from "@/services/user";
import { useSession } from "next-auth/react";

interface EditUserDialogProps {
  user: User;
  onRefresh?: () => void;
}

export function EditUserDialog({ user, onRefresh }: EditUserDialogProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [role, setRole] = useState<string>(user.role);
  const [error, setError] = useState("");
  const { data: session } = useSession();

  const handleUpdate = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const data = { role };

    const result = await userServices.updateUser(
      user.id,
      data,
      session?.accessToken as string,
    );

    if (result.status === 200) {
      setIsLoading(false);
      setOpen(false);
      onRefresh?.();
    } else {
      setIsLoading(false);
    }
  };
  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        <Button variant="outline">
          <Edit />
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Edit Paket</AlertDialogTitle>
        </AlertDialogHeader>
        <form id="edit-user-form" onSubmit={handleUpdate}>
          <FieldGroup>
            <Field>
              <Label>Nama</Label>
              <Input defaultValue={user.name} readOnly />
            </Field>
            <Field>
              <Label>Email</Label>
              <Input defaultValue={user.email} readOnly />
            </Field>
            <Field>
              <Label>Nomor Hp</Label>
              <Input defaultValue={user.phone} readOnly />
            </Field>
            <Field>
              <Label>Role</Label>
              <Select value={role} onValueChange={setRole}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectGroup>
                    <SelectItem value="superadmin">Super Admin</SelectItem>
                    <SelectItem value="admin">Admin</SelectItem>
                    <SelectItem value="member">Member</SelectItem>
                    <SelectItem value="client">Client</SelectItem>
                  </SelectGroup>
                </SelectContent>
              </Select>
            </Field>
          </FieldGroup>
          {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
        </form>

        <AlertDialogFooter>
          <AlertDialogCancel disabled={isLoading}>Cancel</AlertDialogCancel>
          <AlertDialogAction
            type="submit"
            form="edit-user-form"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
