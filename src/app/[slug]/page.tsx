"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useMemo, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { auth } from "../../firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

import Navbar from "../components/Navbar/Navbar";
import Loading from "../components/Loading/Loading";
import Footer from "../components/Footer/Footer";
import Notification from "../components/MessageHandling/Notification";
import SelectField from "../components/FormComponents/SelectField";
import SubmitButton from "../components/FormComponents/SubmitButton";
import MainFeaturesList from "./components/MainFeatureList";
import SimilarProducts from "../components/SimilarProducts/SimilarProducts";
import AboutCollection from "./components/AboutCollection";
import ProductImageSlider from "./components/ProductImageBlock";
import ShareButton from "../components/ShareButton/ShareButton";
import CartSideModal from "../components/SideModal/CartSideModal";
import { AiOutlineShoppingCart } from "react-icons/ai";

import { ProductVariant } from "../types/product";
import { useRequireAuth } from "../utils/auth";
import { useNotification } from "../utils/useNotification";
import { useCartItems } from "../utils/cartUtils";
import { addOrIncrementCartItem } from "../utils/cartActions";
import { calculateDiscountedPrice, formatPrice } from "../utils/priceUtils";
import { useProductDetails } from "../utils/useProductDetails";

interface FormValues {
  size: string;
  inserts: string;
  materialColor: string;
}

export default function ProductPage() {
  /* ───────────────────────────── state & params ─────────────────────────── */
  const [user, loadingAuth] = useAuthState(auth);
  const { slug } = useParams() as { slug: string };
  const searchParams = useSearchParams();
  const variantID = searchParams?.get("variantID");

  const [sideModalOpen, setSideModalOpen] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  /* ───────────────────────────── notifications ──────────────────────────── */
  const { notify, notification, clearNotification } = useNotification();

  const onVariantFound = (variant: ProductVariant) => {
    setValue("inserts", variant.insert, { shouldValidate: true });
    setValue("materialColor", variant.materialColor, { shouldValidate: true });
  };

  const { product, collectionData, activeDiscount, loading } =
    useProductDetails(slug, variantID ?? null, onVariantFound);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { size: "", inserts: "", materialColor: "" },
  });

  useEffect(() => {
    if (!product) return;
    const firstVariant = product.variants[0];
    setValue("inserts", firstVariant.insert);
    setValue("materialColor", firstVariant.materialColor);
  }, [product, setValue]);

  const selectedInsert = watch("inserts");
  const selectedMaterialColor = watch("materialColor");

  const displayedVariant = useMemo(() => {
    if (!product) return undefined;
    return (
      product.variants.find(
        (v) =>
          v.insert === selectedInsert &&
          v.materialColor === selectedMaterialColor
      ) || product.variants[0]
    );
  }, [product, selectedInsert, selectedMaterialColor]);

  const discountedPrice = useMemo(() => {
    if (!displayedVariant) return null;
    return calculateDiscountedPrice(displayedVariant, activeDiscount);
  }, [displayedVariant, activeDiscount]);

  useRequireAuth(user, loadingAuth);
  const cartItems = useCartItems(user ? user.uid : null);

  const onSubmit = async (data: FormValues) => {
    if (!user || !product || !displayedVariant) return;

    const priceForCart = discountedPrice ?? displayedVariant.price;

    const cartItem = {
      productId: product.id,
      name: product.name,
      imageUrl: displayedVariant.images?.[0] || "",
      price: priceForCart,
      quantity: 1,
      size: Number(data.size),
      insert: data.inserts,
      materialColor: data.materialColor,
    };

    try {
      await addOrIncrementCartItem(user.uid, cartItem);
      setSideModalOpen(true);
      setAddedToCart(true);
    } catch (error) {
      notify({
        type: "error",
        message: `Error adding product to cart: ${String(error)}`,
        duration: 3000,
      });
    }
  };

  if (loading || !product || !displayedVariant) return <Loading />;

  const allQuantitySizes = product.variants.flatMap(
    (variant) => variant.quantitySize
  );

  const uniqueSizeMap = new Map<number, { size: number; quantity: number }>();
  allQuantitySizes.forEach((qs) => {
    if (!uniqueSizeMap.has(qs.size)) uniqueSizeMap.set(qs.size, qs);
  });

  const sizeOptions = Array.from(uniqueSizeMap.values()).map((qs) => ({
    value: qs.size.toString(),
    label: `Size ${qs.size} (${qs.quantity} available)`,
  }));

  const insertOptions = Array.from(
    new Set(product.variants.map((v) => v.insert))
  ).map((insert) => ({ value: insert, label: insert }));

  const materialColorOptions = Array.from(
    new Set(product.variants.map((v) => v.materialColor))
  ).map((color) => ({ value: color, label: color }));

  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={!!user} />

      <section
        className="px-4 py-16 sm:px-6 lg:px-8"
        style={{ fontFamily: "var(--font-poppins)" }}
        id="product-page"
      >
        {notification && (
          <Notification
            message={notification.message}
            type={notification.type}
            duration={notification.duration}
            onClose={clearNotification}
          />
        )}

        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8 items-start">
          <ProductImageSlider
            key={`${displayedVariant.insert}-${displayedVariant.materialColor}`}
            images={displayedVariant.images || []}
            altText={`${selectedInsert} - ${selectedMaterialColor}`}
          />

          <div className="xl:mt-6">
            <h1
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {product.name}
            </h1>

            <p className="text-base md:text-lg text-gray-600 leading-relaxed mb-6">
              {product.description}
            </p>

            {product.additionalDescription && (
              <p className="text-sm md:text-base text-gray-700 leading-relaxed mb-6">
                {product.additionalDescription}
              </p>
            )}

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
              <p className="text-2xl font-bold text-gray-800 mb-6">
                {formatPrice(displayedVariant.price)} ₴
              </p>
            )}

            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-6 flex space-x-4">
                <SelectField
                  label="Available Sizes"
                  id="size"
                  register={register("size", { required: "Size is required" })}
                  error={errors.size}
                  options={sizeOptions}
                  placeholder="Select size"
                  className="w-1/2"
                />

                <SelectField
                  label="Inserts"
                  id="inserts"
                  register={register("inserts", {
                    required: "Insert is required",
                  })}
                  error={errors.inserts}
                  options={insertOptions}
                  placeholder="Select insert"
                  className="w-1/2"
                />
              </div>

              <SelectField
                label="Material Color"
                id="materialColor"
                register={register("materialColor", {
                  required: "Material color is required",
                })}
                error={errors.materialColor}
                options={materialColorOptions}
                placeholder="Select Material Color"
                className="w-full mb-6"
              />

              <SubmitButton
                label={
                  <>
                    <AiOutlineShoppingCart className="inline mr-2 text-lg" />
                    Add to the basket
                  </>
                }
                isLoading={false}
                className="w-full"
              />
            </form>

            <div className="mt-8">
              <MainFeaturesList product={product} />
            </div>

            <div className="mt-6">
              <div className="mt-4 flex items-end">
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
            collection={collectionData[0]}
          />
        </div>

        {/* <div className="mt-2">
          <SimilarProducts />
        </div> */}
      </section>

      <Footer />

      <CartSideModal
        isOpen={sideModalOpen}
        onClose={() => setSideModalOpen(false)}
        cartItems={cartItems}
        user={user ?? null}
        added={addedToCart}
      />
    </>
  );
}
