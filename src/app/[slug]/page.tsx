"use client";

import { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";

import VariantSelector from "./components/VariantSelector";
import ProductImageSlider from "./components/ProductImageBlock";
import Footer from "@/app/components/Footer/Footer";
import Notification from "@/app/components/MessageHandling/Notification";

import { useProductPage } from "@/hooks/useProductPage";
import { useRequireAuth } from "@/hooks/index";

import { useCart } from "@/hooks/useCart";
import { CartItem } from "@/types/cartItem";
import { FormValues } from "./components/VariantSelector";
import Loading from "@/app/components/Loading/Loading";
import Navbar from "@/app/components/Navbar/Navbar";
import MainFeaturesList from "./components/MainFeatureList";
import InfoBlocks from "./components/InfoItem";
import ShareButton from "@/app/components/ShareButton/ShareButton";
import AboutCollection from "./components/AboutCollection";
import SimilarProducts from "@/app/components/SimilarProducts/SimilarProducts";
import { calculateDiscountedPrice, formatPrice } from "@/utils";
import type { WishlistItem } from "@/types/userTypes";
import CartSideModal from "../components/SideModal/CartSideModal";

const ProductPage = () => {
  const [user, authLoading] = useAuthState(auth);
  useRequireAuth(user ?? null, authLoading);

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

  const userId = user?.uid ?? null;
  const {
    items: cartItems,
    addOrIncrement,
    incrementItem,
    decrementItem,
    removeItem,
  } = useCart(userId);

  const [isModalOpen, setModalOpen] = useState(false);

  if (!product || !displayedVariant) return <Loading />;

  const discountedPrice = calculateDiscountedPrice(
    displayedVariant,
    activeDiscount
  );
  const wishlistItem: WishlistItem = {
    productId: product.id,
    variantId: displayedVariant.id,
    slug: product.slug!,
    materialColor: displayedVariant.materialColor,
    insert: displayedVariant.insert,
    size: (displayedVariant as any).size ?? 0,
    price: discountedPrice ?? displayedVariant.price,
    image: displayedVariant.images?.[0] ?? "/placeholder.jpg",
  };

  const handleAddToCart = async (data: FormValues) => {
    if (!userId) return;
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
      await addOrIncrement(item);
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
            altText={`${displayedVariant.insert} – ${displayedVariant.materialColor}`}
            wishlistItem={wishlistItem}
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

      <CartSideModal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        items={cartItems}
        onIncrement={(it) =>
          incrementItem({
            productId: it.productId,
            size: it.size,
            insert: it.insert,
            materialColor: it.materialColor,
          })
        }
        onDecrement={(it) =>
          decrementItem({
            productId: it.productId,
            size: it.size,
            insert: it.insert,
            materialColor: it.materialColor,
          })
        }
        onRemove={(it) =>
          removeItem({
            productId: it.productId,
            size: it.size,
            insert: it.insert,
            materialColor: it.materialColor,
          })
        }
      />
    </div>
  );
};

export default ProductPage;
