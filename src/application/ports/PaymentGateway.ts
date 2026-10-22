export type CheckoutRequest = {
  productName: string;
  productImages: string[];
  unitAmount: number;
  currency: string;
  locale: string;
  successUrl: string;
  metadata: Record<string, string>;
};

export type CheckoutSession = {
  id: string;
  url: string | null;
};

export type CheckoutCompleted = {
  metadata: Record<string, string>;
};

export interface PaymentGateway {
  createCheckoutSession(request: CheckoutRequest): Promise<CheckoutSession>;
  readCompletedCheckout(
    payload: string,
    signature: string | null
  ): Promise<CheckoutCompleted | null>;
}
