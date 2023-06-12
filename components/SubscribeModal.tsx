"use client";

import useSubscribeModal from "@/hooks/useSubscribeModal";
import { useUser } from "@/hooks/useUser";
import { postData } from "@/libs/helpers";
import { getStripe } from "@/libs/stripeClient";
import { Price, ProductWithPrice } from "@/types";
import { useState } from "react";
import { toast } from "react-hot-toast";
import Button from "./Button";
import Modal from "./Modal";

interface SubscribeModalProps {
  products: ProductWithPrice[];
}

const SubscribeModal: React.FC<SubscribeModalProps> = ({ products }) => {
  const subscribeModal = useSubscribeModal();
  const { user, isLoading, subscription } = useUser();
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  const onChange = (open: boolean) => {
    if (!open) {
      subscribeModal.onClose();
    }
  };
  const handleCheckoutPrice = async (price: Price) => {
    setPriceIdLoading(price.id);
    if (!user) {
      setPriceIdLoading(undefined);
      return toast.error("Must be logged in");
    }
    if (subscription) {
      setPriceIdLoading(undefined);
      return toast("Already Subscribed");
    }

    try {
      const { sessionId } = await postData({
        url: "/api/create-checkout-session",
        data: { price },
      });
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    } catch (error) {
      toast.error((error as Error)?.message);
    } finally {
      setPriceIdLoading(undefined);
    }
  };
  const formatPrice = (price: Price) => {
    const priceString = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: price.currency,
      maximumFractionDigits: 0,
    }).format((price?.unit_amount || 0) / 100);

    return priceString;
  };
  let content = <div className="text-center">No Products available</div>;

  if (products.length) {
    content = (
      <div>
        {products.map((product) => {
          if (!product.prices?.length) {
            return <div key={product.id}>No Prices Available</div>;
          }
          return product.prices.map((price) => (
            <Button
              key={price.id}
              onClick={() => handleCheckoutPrice(price)}
              disabled={isLoading || price.id === priceIdLoading}
            >{`Subscribe for ${formatPrice(price)} a ${
              price.interval
            }`}</Button>
          ));
        })}
      </div>
    );
  }

  if (subscription) {
    content = <div className="text-center">Already Subscribed</div>;
  }

  return (
    <Modal
      title="Only for premium users"
      description="Listen to music with Spotify Premium"
      isOpen={subscribeModal.isOpen}
      onChange={onChange}
    >
      {content}
    </Modal>
  );
};

export default SubscribeModal;
