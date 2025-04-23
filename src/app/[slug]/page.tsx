"use client";

import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";

import { auth } from "../../firebase/firebaseConfig";

import VariantSelector from "./components/VariantSelector";
import ProductImageSlider from "./components/ProductImageBlock";
import SideCartModal from "./components/SideCartModal";
import Footer from "../components/Footer/Footer";
import Notification from "../components/MessageHandling/Notification";

import { useProductPage } from "../../hooks/useProductPage";
import { useRequireAuth } from "../utils/auth";
import { useCartItems } from "../utils/cartUtils";
import {
  addOrIncrementCartItem,
  decrementQuantity,
  incrementQuantity,
  removeItem,
} from "../utils/cartActions";
import { calculateDiscountedPrice, formatPrice } from "../utils/priceUtils";
import { CartItem } from "../types/cartItem";
import { FormValues } from "./components/VariantSelector";
import Loading from "../components/Loading/Loading";
import Navbar from "../components/Navbar/Navbar";
import MainFeaturesList from "./components/MainFeatureList";
import InfoBlocks from "./components/InfoItem";
import ShareButton from "../components/ShareButton/ShareButton";
import AboutCollection from "./components/AboutCollection";
import SimilarProducts from "../components/SimilarProducts/SimilarProducts";

const ProductPage = () => {
  const [user, authLoading] = useAuthState(auth);
  useRequireAuth(user, authLoading);

  const {
    product,
    collection,
    activeDiscount,
    notification,
    clearNotification,
    displayedVariant,
    sizeOptions,
    insertOptions,
    materialColorOptions,
    handleColorChange,
    handleInsertChange,
  } = useProductPage();

  const cartItems = useCartItems(user ? user.uid : null);
  const [isModalOpen, setModalOpen] = useState(false);

  if (!product || !displayedVariant) return <Loading />;

  const discountedPrice = calculateDiscountedPrice(
    displayedVariant,
    activeDiscount
  );

  const handleAddToCart = async (data: FormValues) => {
    const item: CartItem = {
      productId: product.id,
      slug: product.slug!,
      name: product.name,
      description: product.description,
      variantId: displayedVariant.id,
      originalPrice: displayedVariant.price,
      discountName: activeDiscount?.name || "",
      imageUrl: displayedVariant.images?.[0] ?? "/placeholder.jpg",
      price: discountedPrice ?? displayedVariant.price,
      quantity: 1,
      size: Number(data.size),
      insert: displayedVariant.insert,
      materialColor: displayedVariant.materialColor,
    };

    try {
      console.log("Adding to cart:", item);
      await addOrIncrementCartItem(user!.uid, item);
      setModalOpen(true);
    } catch (e) {
      console.error("Error adding to cart:", e);
    }
  };

  return (
    <div style={{ fontFamily: "var(--font-poppins)" }}>
      <Navbar isScrolled isLoggedIn={!!user} />

      <section className="px-4 py-16 sm:px-6 lg:px-8" id="product-page">
        {notification && (
          <Notification {...notification} onClose={clearNotification} />
        )}

        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8 items-start">
          <ProductImageSlider
            key={`${displayedVariant.insert}-${displayedVariant.materialColor}`}
            images={displayedVariant.images || []}
            altText={`${displayedVariant.insert} - ${displayedVariant.materialColor}`}
          />

          <div className="mt-6">
            <h1
              className="text-3xl md:text-4xl font-bold mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {product.name}
            </h1>

            <p className="text-base md:text-lg text-gray-600 mb-6">
              {product.description}
            </p>

            {discountedPrice ? (
              <div className="mb-6">
                <p className="text-xl text-gray-500 line-through">
                  {formatPrice(displayedVariant.price)} ₴
                </p>
                <p className="text-2xl font-bold text-red-600">
                  {formatPrice(discountedPrice)} ₴
                </p>
                <p className="text-sm text-red-500 mt-1">
                  {activeDiscount?.name || "Discount"}
                </p>
              </div>
            ) : (
              <p className="text-2xl font-bold mb-6">
                {formatPrice(displayedVariant.price)} ₴
              </p>
            )}

            <VariantSelector
              sizeOptions={sizeOptions}
              insertOptions={insertOptions}
              materialColorOptions={materialColorOptions}
              variant={displayedVariant}
              onAddToCart={handleAddToCart}
              onInsertChange={handleInsertChange}
              onColorChange={handleColorChange}
            />

            <div className="mt-8">
              <MainFeaturesList
                displayedVariant={displayedVariant}
                collection={collection ?? undefined}
                product={product}
              />
            </div>

            <div className="mt-6">
              <InfoBlocks />
              <div className="mt-4 items-end flex">
                <ShareButton
                  title="Share this product"
                  text="Check out this amazing product!"
                  url={
                    typeof window !== "undefined" ? window.location.href : ""
                  }
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12">
          <AboutCollection
            firebaseProduct={product}
            collection={collection ?? undefined}
          />
        </div>

        <div className="mt-2">
          <SimilarProducts />
        </div>
      </section>

      <Footer />

      <SideCartModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        items={cartItems}
        onIncrement={(it) =>
          user &&
          incrementQuantity(
            user.uid,
            it.productId,
            it.size,
            it.insert,
            it.materialColor
          )
        }
        onDecrement={(it) =>
          user &&
          decrementQuantity(
            user.uid,
            it.productId,
            it.size,
            it.insert,
            it.materialColor
          )
        }
        onRemove={(it) =>
          user &&
          removeItem(
            user.uid,
            it.productId,
            it.size,
            it.insert,
            it.materialColor
          )
        }
      />
    </div>
  );
};

export default ProductPage;
