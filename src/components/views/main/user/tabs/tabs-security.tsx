import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BadgeCheckIcon, ChevronRightIcon } from "lucide-react";
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from "@/components/ui/item";
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
import { Field, FieldGroup } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function TabsSecurity() {
  return (
    <Card>
      <CardContent>
        <CardTitle>Account Security</CardTitle>
        <CardDescription className="mt-4    ">
          <div className="flex w-full max-w-full flex-col gap-6">
            <Item variant="outline" className="w-full">
              <ItemContent>
                <ItemTitle>Password</ItemTitle>
                <ItemDescription>Last changed 3 months ago</ItemDescription>
              </ItemContent>
              <ItemActions>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="outline" size="sm">
                      Change Password
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Change Password</AlertDialogTitle>
                    </AlertDialogHeader>
                    <FieldGroup>
                      <Field>
                        <Label>Old Password</Label>
                        <Input name="oldpassword" type="password" />
                      </Field>
                      <Field>
                        <Label>New Password</Label>
                        <Input name="newpassword" type="password" />
                      </Field>
                      <Field>
                        <Label>Confirm New Password</Label>
                        <Input name="confirmpassword" type="password" />
                      </Field>
                    </FieldGroup>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction>Continue</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </ItemActions>
            </Item>
          </div>
        </CardDescription>
      </CardContent>
    </Card>
  );
}
