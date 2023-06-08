import { loadStripe, Stripe } from "@stripe/stripe-js";

let stripPromise: Promise<Stripe | null>;

export const getStripe = () => {
  if (!stripPromise) {
    stripPromise = loadStripe(
      process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ?? ""
    );
  }
  return stripPromise;
};
