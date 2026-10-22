import Stripe from "stripe";

import type {
  CheckoutCompleted,
  CheckoutRequest,
  CheckoutSession,
  PaymentGateway,
} from "@/application/ports/PaymentGateway";
import { ValidationError } from "@/domain/errors";

type Config = {
  secretKey: () => string | undefined;
  webhookSecret: () => string | undefined;
};

export class StripePaymentGateway implements PaymentGateway {
  private stripe?: Stripe;

  constructor(private readonly config: Config) {}

  private client() {
    if (!this.stripe) {
      const secretKey = this.config.secretKey();
      if (!secretKey) throw new Error("STRIPE_SECRET_KEY is not configured");
      this.stripe = new Stripe(secretKey, { apiVersion: "2023-10-16" });
    }
    return this.stripe;
  }

  async createCheckoutSession(request: CheckoutRequest): Promise<CheckoutSession> {
    const session = await this.client().checkout.sessions.create({
      mode: "payment",
      payment_method_types: ["card"],
      line_items: [
        {
          quantity: 1,
          price_data: {
            currency: request.currency,
            product_data: {
              name: request.productName,
              images: request.productImages,
            },
            unit_amount: request.unitAmount,
          },
        },
      ],
      success_url: request.successUrl,
      metadata: request.metadata,
    });

    return { id: session.id };
  }

  async readCompletedCheckout(
    payload: string,
    signature: string | null
  ): Promise<CheckoutCompleted | null> {
    const webhookSecret = this.config.webhookSecret();
    if (!signature || !webhookSecret) {
      throw new ValidationError("The Stripe signature is missing.");
    }

    let event: Stripe.Event;
    try {
      event = this.client().webhooks.constructEvent(payload, signature, webhookSecret);
    } catch {
      throw new ValidationError("The Stripe signature is not valid.");
    }

    if (event.type !== "checkout.session.completed") return null;

    return { metadata: (event.data.object.metadata ?? {}) as Record<string, string> };
  }
}
