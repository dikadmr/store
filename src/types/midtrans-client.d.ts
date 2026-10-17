// src/types/midtrans-client.d.ts
declare module "midtrans-client" {
  export interface CustomerDetails {
    first_name?: string;
    last_name?: string;
    email?: string;
    phone?: string;
    billing_address?: Record<string, unknown>;
    shipping_address?: Record<string, unknown>;
  }

  export interface ItemDetail {
    id: string;
    price: number;
    quantity: number;
    name: string;
    category?: string;
  }

  export interface SnapTransactionParameters {
    transaction_details: {
      order_id: string;
      gross_amount: number;
    };
    customer_details?: CustomerDetails;
    item_details?: ItemDetail[];
    credit_card?: Record<string, unknown>;
    callbacks?: { finish?: string };
  }

  export interface SnapConfig {
    isProduction: boolean;
    serverKey: string;
    clientKey?: string;
  }

  export interface SnapTransactionResult {
    token: string;
    redirect_url: string;
  }

  export class Snap {
    constructor(config: SnapConfig);
    createTransaction(
      parameter: SnapTransactionParameters,
    ): Promise<SnapTransactionResult>;
  }

  const midtransClient: {
    Snap: typeof Snap;
  };

  export default midtransClient;
}
