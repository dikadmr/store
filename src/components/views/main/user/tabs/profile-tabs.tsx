import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TabsProject } from "./tabs-project";
import { TabsPersonal } from "./tabs-personal";
import { TabsSecurity } from "./tabs-security";
import { TabsOrder } from "./tabs-order";
import type { Project } from "@/services/project";
import type { Order } from "@/services/order";

export function ProfileTabs({
  projects,
  orders,
  isLoading,
}: {
  projects: Project[];
  orders: Order[];
  isLoading: boolean;
}) {
  return (
    <Tabs defaultValue="project" className="max-w-full">
      <TabsList className="w-full">
        <TabsTrigger value="orders">Orders</TabsTrigger>
        <TabsTrigger value="project">Project</TabsTrigger>
        <TabsTrigger value="personal">Personal</TabsTrigger>
        <TabsTrigger value="security">Security</TabsTrigger>
      </TabsList>
      <TabsContent value="orders">
        <TabsOrder orders={orders} isLoading={isLoading} />
      </TabsContent>
      <TabsContent value="project">
        <TabsProject projects={projects} isLoading={isLoading} />
      </TabsContent>
      <TabsContent value="personal">
        <TabsPersonal />
      </TabsContent>
      <TabsContent value="security">
        <TabsSecurity />
      </TabsContent>
    </Tabs>
  );
}
