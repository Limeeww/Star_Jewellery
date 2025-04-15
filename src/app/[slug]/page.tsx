"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";

import { auth } from "../../firebase/firebaseConfig";

import { useAuthState } from "react-firebase-hooks/auth";

import Navbar from "../components/Navbar/Navbar";
import Loading from "../components/Loading/Loading";
import Footer from "../components/Footer/Footer";
import Notification from "../components/MessageHandling/Notification";
import SelectField from "../components/FormComponents/SelectField";
import SubmitButton from "../components/FormComponents/SubmitButton";

import { ProductVariant } from "../types/product";
import { useRequireAuth } from "../utils/auth";
import { useNotification } from "../utils/useNotification";
import InfoBlocks from "./components/InfoItem";
import { AiOutlineShoppingCart } from "react-icons/ai";
import MainFeaturesList from "./components/MainFeatureList";
import SimilarProducts from "../components/SimilarProducts/SimilarProducts";
import AboutCollection from "./components/AboutCollection";
import ShareButton from "../components/ShareButton/ShareButton";
import SideModal from "../components/SideModal/SideModal";
import CartItemComponent from "../components/CartItem/CartItemComponent";
import { useCartItems } from "../utils/cartUtils";
import {
  addOrIncrementCartItem,
  decrementQuantity,
  incrementQuantity,
  removeItem,
} from "../utils/cartActions";
import LinkButtonForm from "../components/FormComponents/LinkButtonForm";
import { calculateDiscountedPrice } from "../utils/priceUtils";
import ProductImageSlider from "./components/ProductImageBlock";
import { useProductDetails } from "../utils/useProductDetails";
import { formatPrice } from "../utils/priceUtils";

interface FormValues {
  size: string;
  inserts: string;
  materialColor: string;
}

export default function ProductPage() {
  const [user, loadingAuth] = useAuthState(auth);
  const { slug } = useParams() as { slug: string };
  const searchParams = useSearchParams();
  const variantID = searchParams?.get("variantID");

  const [selectedInsert, setSelectedInsert] = useState("");
  const [selectedMaterialColor, setSelectedMaterialColor] = useState("");

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm<FormValues>({
    defaultValues: {
      size: "",
      inserts: "",
      materialColor: "",
    },
  });

  const onVariantFound = (variant: ProductVariant) => {
    setSelectedInsert(variant.insert);
    setSelectedMaterialColor(variant.materialColor);
    setValue("inserts", variant.insert);
    setValue("materialColor", variant.materialColor);
  };

  const { product, collectionData, activeDiscount, loading } =
    useProductDetails(slug, variantID ?? null, onVariantFound);

  const [sideModalOpen, setSideModalOpen] = useState(false);
  const cartItems = useCartItems(user ? user.uid : null);

  useRequireAuth(user, loadingAuth);
  const { notify, notification, clearNotification } = useNotification();

  const discountedPrice = product
    ? calculateDiscountedPrice(product, activeDiscount)
    : null;

  const onSubmit = async (data: FormValues) => {
    if (!user || !product) return;
    const finalPrice = discountedPrice ?? product.price;
    const variantForCart =
      product.variants.find(
        (v) =>
          v.insert === data.inserts && v.materialColor === data.materialColor
      ) || product.variants[0];
    const cartItem = {
      productId: product.id,
      name: product.name,
      imageUrl: variantForCart.images?.[0] || "",
      price: finalPrice,
      quantity: 1,
      size: Number(data.size),
      insert: data.inserts,
      materialColor: data.materialColor,
    };
    try {
      await addOrIncrementCartItem(user.uid, cartItem);
      setSideModalOpen(true);
    } catch (error) {
      notify({
        type: "error",
        message: `Error adding product to cart: ${String(error)}`,
        duration: 3000,
      });
    }
  };

  if (loading || !product) return <Loading />;

  const sizeOptions = (product.variants || []).map((item) => ({
    value: item.size.toString(),
    label: `Size ${item.size} (${item.quantity} available)`,
  }));
  const uniqueInserts = [...new Set(product.variants.map((v) => v.insert))];
  const insertOptions = uniqueInserts.map((insert) => ({
    value: insert,
    label: insert,
  }));
  const uniqueMaterialColors = [
    ...new Set(product.variants.map((v) => v.materialColor)),
  ];
  const materialColorOptions = uniqueMaterialColors.map((color) => ({
    value: color,
    label: color,
  }));

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
          <div>
            <ProductImageSlider
              images={product.variants[0].images || []}
              altText={`${selectedInsert || product.variants[0].insert} - ${
                selectedMaterialColor || product.variants[0].materialColor
              }`}
            />
          </div>
          <div className="xl:mt-6 ">
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
                  {formatPrice(product.price)} ₴
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
                {formatPrice(product.price)} ₴
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
                    onChange: (e) => {
                      const newInsert = e.target.value;
                      setSelectedInsert(newInsert);
                      setValue("inserts", newInsert);
                    },
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
                  onChange: (e) => {
                    const newColor = e.target.value;
                    setSelectedMaterialColor(newColor);
                    setValue("materialColor", newColor);
                  },
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
            collection={collectionData[0]}
          />
        </div>

        <div className="mt-2">
          <SimilarProducts />
        </div>
      </section>

      <Footer />

      <SideModal isOpen={sideModalOpen} onClose={() => setSideModalOpen(false)}>
        <div className="p-4 h-full flex flex-col max-h-screen overflow-y-auto">
          <div className="flex-1">
            <h2
              className="text-2xl font-semibold mb-2"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Product successfully added to cart!
            </h2>
            <p className="mb-4">
              You can continue shopping or view your cart items below.
            </p>

            {cartItems && cartItems.length > 0 ? (
              cartItems.map((item) => (
                <div
                  key={`${item.productId}-${item.size}-${item.insert}-${item.materialColor}`}
                  className="mb-4"
                >
                  <CartItemComponent
                    item={item}
                    onIncrement={() => {
                      if (user?.uid) {
                        incrementQuantity(
                          user.uid,
                          item.productId,
                          item.size,
                          item.insert,
                          item.materialColor
                        );
                      }
                    }}
                    onDecrement={() => {
                      if (user?.uid) {
                        decrementQuantity(
                          user.uid,
                          item.productId,
                          item.size,
                          item.insert,
                          item.materialColor
                        );
                      }
                    }}
                    onRemove={() => {
                      if (user?.uid) {
                        removeItem(
                          user.uid,
                          item.productId,
                          item.size,
                          item.insert,
                          item.materialColor
                        );
                      }
                    }}
                  />
                </div>
              ))
            ) : (
              <p>Your cart is currently empty.</p>
            )}
          </div>

          <div className="mt-auto">
            <LinkButtonForm href="/cart" label="View Cart" showArrow />
          </div>
        </div>
      </SideModal>
    </>
  );
}
