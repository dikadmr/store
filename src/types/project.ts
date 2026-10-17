import { PageSection } from "@/components/views/main/order/form/section/order-detail-form";

export interface ProjectAsset {
  name: string;
  path: string;
  url: string;
  type: string;
  size: number;
}

export interface ProjectData {
  orderId: string;

  package: {
    id: string;
    name: string;
    slug: string;
  };

  websiteType: {
    id: string;
    name: string;
    slug: string;
  };

  project: {
    name: string;
    ownerType: string;
    description: string;
    targetAudience: string;
    goal: string;
    informationContact: string;
    serviceLocation: string;
  };

  design: {
    reference: string;
  };

  timeline: {
    targetStart: string;
    targetFinish: string;
  };

  additionalNote: string;

  requirements: {
    sections: PageSection[];
    footerElements: string[];
    whatsappButton: boolean | null;
    googleMaps: boolean | null;
  };

  professional?: {
    adminPanel?: boolean;
    authentication?: boolean;
    database?: boolean;
    paymentGateway?: boolean;
  };

  enterprise?: {
    systemDescription?: string;
    businessProblem?: string;
    modules?: string;
    roles?: string;
    integrations?: string;
  };

  assets: ProjectAsset[];

  status: "draft" | "pending" | "in_progress" | "completed";

  createdAt?: unknown;
  updatedAt?: unknown;
}
