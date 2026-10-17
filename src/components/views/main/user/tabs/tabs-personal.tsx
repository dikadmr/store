import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";

export function TabsPersonal() {
  return (
    <Card>
      <CardContent>
        <CardTitle>Personal Information</CardTitle>
        <CardDescription className="mt-1">
          Update your personal details and profile information.
        </CardDescription>
        <FieldSet className="w-full max-w-full my-4">
          <FieldGroup className="w-full">
            <Field>
              <FieldLabel htmlFor="name">Name</FieldLabel>
              <Input id="name" type="text" placeholder="John Doe" />
            </Field>
            <div className="grid grid-cols-2 gap-4">
              <Field>
                <FieldLabel htmlFor="email">Email</FieldLabel>
                <Input
                  id="email"
                  type="email"
                  placeholder="john.doe@example.com"
                />
              </Field>
              <Field>
                <FieldLabel htmlFor="phone">Phone</FieldLabel>
                <Input id="phone" type="text" placeholder="123-456-7890" />
              </Field>
            </div>
          </FieldGroup>
        </FieldSet>
        <div>
          <Button>Save</Button>
        </div>
      </CardContent>
    </Card>
  );
}
