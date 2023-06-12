"use client";

import AuthModal from "@/components/AuthModal";
import SubscribeModal from "@/components/SubscribeModal";
import UploadModal from "@/components/UploadModal";
import { Product, ProductWithPrice } from "@/types";
import { Fragment, useEffect, useState } from "react";

interface ModelProviderProps {
  products: ProductWithPrice[];
}

const ModalProvider: React.FC<ModelProviderProps> = ({ products }) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Fragment>
      <AuthModal />
      <UploadModal />
      <SubscribeModal products={products} />
    </Fragment>
  );
};

export default ModalProvider;
