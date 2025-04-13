"use client";

import { useParams, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { auth, db } from "../../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import Navbar from "../components/Navbar/Navbar";
import Loading from "../components/Loading/Loading";
import Footer from "../components/Footer/Footer";
import Notification from "../components/MessageHandling/Notification";
import SelectField from "../components/FormComponents/SelectField";
import SubmitButton from "../components/FormComponents/SubmitButton";

import { Discount, Product, ProductVariant } from "../types/product";
import { useRequireAuth } from "../utils/auth";
import { useNotification } from "../utils/useNotification";
import InfoBlocks from "./components/InfoItem";
import { AiOutlineShoppingCart } from "react-icons/ai";
import ProductImageBlock from "./components/ProductImageBlock";
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
import { Collection } from "../types/collection";

interface FormValues {
  size: string;
  inserts: string;
  materialColor: string;
}

export default function ProductPage() {
  const [user, loading] = useAuthState(auth);
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const variantID = searchParams.get("variantID");
  const [product, setProduct] = useState<Product | null>(null);
  const [collectionData, setCollectionData] = useState<Collection[]>([]);
  const isLoggedIn = !loading && !!user;

  const [sideModalOpen, setSideModalOpen] = useState(false);

  const cartItems = useCartItems(user ? user.uid : null);
  const [selectedInsert, setSelectedInsert] = useState<string>("");
  const [selectedMaterialColor, setSelectedMaterialColor] =
    useState<string>("");
  const [activeDiscount, setActiveDiscount] = useState<Discount | null>(null);

  const activeVariant: ProductVariant | undefined = product?.variants.find(
    (variant) =>
      variant.insert === selectedInsert &&
      variant.materialColor === selectedMaterialColor
  );
  const displayedVariant = activeVariant || product?.variants[0];

  let discountedPrice: number | null = null;
  if (product && activeDiscount) {
    if (activeDiscount.type === "percentage") {
      discountedPrice = product.price * (1 - activeDiscount.value / 100);
    } else if (activeDiscount.type === "fixed") {
      discountedPrice = product.price - activeDiscount.value;
    }
  }

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

  useRequireAuth(user, loading);
  const { notify, notification, clearNotification } = useNotification();

  useEffect(() => {
    if (!slug) return;

    const fetchData = async () => {
      try {
        const productsRef = collection(db, "products");
        const productQuery = query(productsRef, where("slug", "==", slug));
        const productSnap = await getDocs(productQuery);

        if (productSnap.empty) {
          notify({
            type: "warning",
            message: `Product with slug ${slug} not found`,
          });
          return;
        }

        const productDoc = productSnap.docs[0];
        const fetchedProduct = productDoc.data() as Product;

        if (variantID && fetchedProduct.variants) {
          const variantFromQuery = fetchedProduct.variants.find(
            (variant) => variant.id === Number(variantID)
          );
          if (variantFromQuery) {
            setSelectedInsert(variantFromQuery.insert);
            setSelectedMaterialColor(variantFromQuery.materialColor);
            setValue("inserts", variantFromQuery.insert);
            setValue("materialColor", variantFromQuery.materialColor);
          }
        }

        setProduct(fetchedProduct);

        if (!fetchedProduct.categoryId) {
          setCollectionData([]);
          notify({
            type: "error",
            message: `Product with ID ${fetchedProduct.id} has no collectionId`,
          });
          return;
        }

        const collectionDocRef = doc(
          db,
          "collections",
          fetchedProduct.categoryId.toString()
        );
        const collectionDocSnap = await getDoc(collectionDocRef);

        if (!collectionDocSnap.exists()) {
          setCollectionData([]);
          notify({
            type: "error",
            message: `Collection with ID ${fetchedProduct.categoryId} not found`,
          });
          return;
        }

        const data = collectionDocSnap.data();
        const singleCollection = {
          id: Number(collectionDocSnap.id),
          name: data.name || "",
          description: data.description || "",
          images: data.images || [],
          parentCategory: Number(data.parentCategory) || 0,
          isActive: data.isActive ?? true,
          createdAt: data.createdAt,
        };

        setCollectionData([singleCollection]);

        const discountsRef = collection(db, "discounts");
        const discountsQuery = query(
          discountsRef,
          where("applicableTo", "array-contains", fetchedProduct.id)
        );
        const discountsSnap = await getDocs(discountsQuery);

        if (!discountsSnap.empty) {
          const now = new Date();
          const allDiscounts: Discount[] = discountsSnap.docs.map((docSnap) => {
            return {
              ...docSnap.data(),
              id: Number(docSnap.id),
            } as Discount;
          });

          const validDiscounts = allDiscounts.filter((discount) => {
            const start = discount.validFrom?.toDate
              ? discount.validFrom.toDate()
              : discount.validFrom.toDate();
            const end = discount.validUntil?.toDate
              ? discount.validUntil.toDate()
              : discount.validUntil.toDate();
            return now >= start && now <= end;
          });

          if (validDiscounts.length > 0) {
            validDiscounts.sort(
              (a, b) => (b.priority ?? 0) - (a.priority ?? 0)
            );
            setActiveDiscount(validDiscounts[0]);
          } else {
            setActiveDiscount(null);
          }
        } else {
          setActiveDiscount(null);
        }
      } catch (error) {
        notify({
          type: "error",
          message: `Error fetching data: ${String(error)}`,
        });
      }
    };

    fetchData();
  }, [slug, variantID, notify, setValue]);

  if (!product) return <Loading />;

  const onSubmit = async (data: FormValues) => {
    if (!user) return;

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

  const formatPrice = (price: number) => price.toFixed(2);

  const sizeOptions = (product.quantitySize || []).map((item) => ({
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
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />

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
          <ProductImageBlock variant={displayedVariant!} />

          <div className="mt-6">
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
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-2">
            Product successfully added to cart!
          </h2>
          <p className="mb-4">
            You can continue shopping or view your cart items below.
          </p>

          {cartItems && cartItems.length > 0 ? (
            cartItems.map((item) => (
              <div
                key={`${item.productId}-${item.size}-${item.insert}-${item.materialColor}`}
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

          <div className="mt-4">
            <LinkButtonForm href="/cart" label="View Cart" showArrow />
          </div>
        </div>
      </SideModal>
    </>
  );
}
