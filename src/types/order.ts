export type OrderStatus =
  | "PENDING_CONFIRMATION"
  | "APPROVED"
  | "WAITING_PAYMENT"
  | "PAID"
  | "IN_PROGRESS"
  | "REVISION"
  | "COMPLETED"
  | "CANCELLED";

export type PaymentStatus = "UNPAID" | "WAITING_VERIFICATION" | "PAID";

export type OrderPayment = {
  status: PaymentStatus;
  totalPrice: number;
};

export type Order = {
  id: string;

  order_number: string;

  client_id: string;

  project_id: string;

  package: {
    id: string;
    name: string;
  };

  website_type: {
    id: string;
    name: string;
    slug: string;
  };

  status: OrderStatus;

  payment: OrderPayment;

  created_at: Date | string;

  updated_at: Date | string;
};

export interface CreateOrderPayload {
  user_id?: string | null;
  client_id: string;
  project_id: string;

  client: {
    id: string;
    name: string;
    email: string;
    phone: string;
    city?: string;
  };

  project: {
    name: string;
    ownerType: string;
    description: string;
    goal: string;
    informationContact: string;
    serviceLocation: string;
  };

  package: { id: string; name: string; slug: string };
  website_type: { id: string; name: string; slug: string };

  additionalNote?: string;
}
