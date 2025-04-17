"use client";

import { useEffect, useMemo, useState } from "react";
import {
  useParams,
  useSearchParams,
  useRouter,
  usePathname,
} from "next/navigation";
import { useForm } from "react-hook-form";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { auth, db } from "../../firebase/firebaseConfig";
import { useAuthState } from "react-firebase-hooks/auth";

import Navbar from "../components/Navbar/Navbar";
import Loading from "../components/Loading/Loading";
import Footer from "../components/Footer/Footer";
import Notification from "../components/MessageHandling/Notification";
import SelectField from "../components/FormComponents/SelectField";
import SubmitButton from "../components/FormComponents/SubmitButton";
import MainFeaturesList from "./components/MainFeatureList";
import AboutCollection from "./components/AboutCollection";
import SimilarProducts from "../components/SimilarProducts/SimilarProducts";
import ProductImageSlider from "./components/ProductImageBlock";
import ShareButton from "../components/ShareButton/ShareButton";
import SideModal from "../components/SideModal/SideModal";
import CartItemComponent from "../components/CartItem/CartItemComponent";
import LinkButtonForm from "../components/FormComponents/LinkButtonForm";

import { AiOutlineShoppingCart } from "react-icons/ai";

import {
  addOrIncrementCartItem,
  decrementQuantity,
  incrementQuantity,
  removeItem,
} from "../utils/cartActions";
import { useCartItems } from "../utils/cartUtils";
import { useRequireAuth } from "../utils/auth";
import { useNotification } from "../utils/useNotification";
import { calculateDiscountedPrice, formatPrice } from "../utils/priceUtils";

import { Collection } from "../types/collection";
import { Discount, Product, ProductVariant } from "../types/product";
import InfoBlocks from "./components/InfoItem";

interface FormValues {
  size: string;
  inserts: string;
  materialColor: string;
}

const norm = (s: string) => s.trim().toLowerCase();

export default function ProductPage() {
  const [user, loadingAuth] = useAuthState(auth);
  const { slug } = useParams() as { slug: string };
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const variantID = searchParams?.get("variantID");

  const [product, setProduct] = useState<Product | null>(null);
  const [collectionData, setCollectionData] = useState<Collection[]>([]);
  const [activeDiscount, setActiveDiscount] = useState<Discount | null>(null);

  const [selectedInsert, setSelectedInsert] = useState("");
  const [selectedMaterialColor, setSelectedMaterialColor] = useState("");

  const [sideModalOpen, setSideModalOpen] = useState(true);

  const { notify, notification, clearNotification } = useNotification();

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: { size: "", inserts: "", materialColor: "" },
  });

  const watchInsert = watch("inserts");
  const watchColor = watch("materialColor");

  useEffect(() => {
    if (!slug) return;

    (async () => {
      try {
        const productSnap = await getDocs(
          query(collection(db, "products"), where("slug", "==", slug))
        );
        if (productSnap.empty) {
          notify({
            type: "warning",
            message: `Product with slug ${slug} not found`,
          });
          return;
        }
        const fetchedProduct = productSnap.docs[0].data() as Product;
        setProduct(fetchedProduct);

        let initialVariant: ProductVariant | null = null;
        if (variantID) {
          initialVariant =
            fetchedProduct.variants.find((v) => v.id === Number(variantID)) ||
            null;
        }
        if (!initialVariant) initialVariant = fetchedProduct.variants[0];

        setSelectedInsert(initialVariant.insert);
        setSelectedMaterialColor(initialVariant.materialColor);
        setValue("inserts", initialVariant.insert);
        setValue("materialColor", initialVariant.materialColor);

        if (fetchedProduct.categoryId) {
          const colSnap = await getDoc(
            doc(db, "collections", fetchedProduct.categoryId.toString())
          );
          if (colSnap.exists()) {
            const d = colSnap.data();
            setCollectionData([
              {
                id: Number(colSnap.id),
                name: d.name || "",
                description: d.description || "",
                images: d.images || [],
                parentCategory: Number(d.parentCategory) || 0,
                isActive: d.isActive ?? true,
                createdAt: d.createdAt,
              },
            ]);
          }
        }

        const discSnap = await getDocs(
          query(
            collection(db, "discounts"),
            where("applicableTo", "array-contains", fetchedProduct.id)
          )
        );
        if (!discSnap.empty) {
          const now = new Date();
          const valid = discSnap.docs
            .map((d) => ({ ...d.data(), id: Number(d.id) } as Discount))
            .filter((dis) => {
              const from = dis.validFrom.toDate();
              const to = dis.validUntil.toDate();
              return now >= from && now <= to;
            })
            .sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
          setActiveDiscount(valid[0] ?? null);
        } else setActiveDiscount(null);
      } catch (e) {
        notify({ type: "error", message: `${e}` });
      }
    })();
  }, [slug, variantID, notify, setValue]);

  const displayedVariant: ProductVariant | undefined = useMemo(() => {
    if (!product) return undefined;
    return (
      product.variants.find(
        (v) =>
          norm(v.insert) === norm(selectedInsert) &&
          norm(v.materialColor) === norm(selectedMaterialColor)
      ) || product.variants[0]
    );
  }, [product, selectedInsert, selectedMaterialColor]);

  const discountedPrice = useMemo(() => {
    if (!displayedVariant) return null;
    return calculateDiscountedPrice(displayedVariant, activeDiscount);
  }, [displayedVariant, activeDiscount]);

  useEffect(() => {
    if (!product) return;
    if (!watchInsert || !watchColor) return;

    const matched = product.variants.find(
      (v) =>
        norm(v.insert) === norm(watchInsert) &&
        norm(v.materialColor) === norm(watchColor)
    );
    if (!matched) return;

    if (matched.id === Number(variantID)) return;

    const params = new URLSearchParams(searchParams.toString());
    params.set("variantID", matched.id.toString());
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }, [
    watchInsert,
    watchColor,
    product,
    variantID,
    router,
    pathname,
    searchParams,
  ]);

  useRequireAuth(user, loadingAuth);
  const cartItems = useCartItems(user ? user.uid : null);

  const onSubmit = async (data: FormValues) => {
    if (!user || !product || !displayedVariant) return;

    const cartItem = {
      productId: product.id,
      name: product.name,
      imageUrl: displayedVariant.images?.[0] || "",
      price: discountedPrice ?? displayedVariant.price,
      quantity: 1,
      size: Number(data.size),
      insert: displayedVariant.insert,
      materialColor: displayedVariant.materialColor,
    };

    try {
      await addOrIncrementCartItem(user.uid, cartItem);
      setSideModalOpen(true);
    } catch (e) {
      notify({ type: "error", message: `Error adding to cart: ${e}` });
    }
  };

  if (!product || !displayedVariant) return <Loading />;

  const allQuantitySizes = product.variants.flatMap(
    (variant) => variant.quantitySize
  );
  const uniqueSizeMap = new Map<number, { size: number; quantity: number }>();
  allQuantitySizes.forEach((qs) => {
    if (!uniqueSizeMap.has(qs.size)) {
      uniqueSizeMap.set(qs.size, qs);
    }
  });
  const sizeOptions = Array.from(uniqueSizeMap.values()).map((qs) => ({
    value: qs.size.toString(),
    label: `Size ${qs.size} (${qs.quantity} available)`,
  }));
  const insertOptions = Array.from(
    new Set(product.variants.map((v) => v.insert))
  ).map((i) => ({ value: i, label: i }));
  const materialColorOptions = Array.from(
    new Set(product.variants.map((v) => v.materialColor.trim()))
  ).map((c) => ({ value: c, label: c }));

  return (
    <div  style={{ fontFamily: "var(--font-poppins)" }}>
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
                  register={register("inserts", { required: true })}
                  error={errors.inserts}
                  options={insertOptions}
                  placeholder="Select insert"
                  className="w-1/2"
                />
              </div>

              <SelectField
                label="Material Color"
                id="materialColor"
                register={register("materialColor", { required: true })}
                error={errors.materialColor}
                options={materialColorOptions}
                placeholder="Select Material Color"
                className="w-full mb-6"
              />

              <SubmitButton
                label={
                  <>
                    <AiOutlineShoppingCart className="inline mr-2 text-lg" />
                    Add to basket
                  </>
                }
                isLoading={false}
                className="w-full"
              />
            </form>

            <div className="mt-8">
              <MainFeaturesList displayedVariant={displayedVariant} collection={collectionData[0]} product={product} />
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
          <h2 className="text-2xl font-semibold mb-4">
            Product successfully added to cart!
          </h2>
          {cartItems?.length ? (
            cartItems.map((it) => (
              <CartItemComponent
                key={`${it.productId}-${it.size}-${it.insert}-${it.materialColor}`}
                item={it}
                onIncrement={() =>
                  user &&
                  incrementQuantity(
                    user.uid,
                    it.productId,
                    it.size,
                    it.insert,
                    it.materialColor
                  )
                }
                onDecrement={() =>
                  user &&
                  decrementQuantity(
                    user.uid,
                    it.productId,
                    it.size,
                    it.insert,
                    it.materialColor
                  )
                }
                onRemove={() =>
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
            ))
          ) : (
            <p>Your cart is empty.</p>
          )}

          <div className="mt-auto">
            <LinkButtonForm href="/cart" label="View cart" showArrow />
          </div>
        </div>
      </SideModal>
    </div>
  );
}
