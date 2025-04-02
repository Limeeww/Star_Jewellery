"use client";

import { useParams, useSearchParams } from "next/navigation";
import Image from "next/image";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";

import { auth, db } from "../../firebase/firebaseConfig";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
  doc,
} from "firebase/firestore";
import { useAuthState } from "react-firebase-hooks/auth";

import Navbar from "../components/Navbar/Navbar";
import Loading from "../components/Loading/Loading";
import Footer from "../components/Footer/Footer";
import Notification from "../components/MessageHandling/Notification";
import SelectField from "../components/FormComponents/SelectField";
import SubmitButton from "../components/FormComponents/SubmitButton";

import { Product } from "../types/product";
import { useRequireAuth } from "../utils/auth";
import { useNotification } from "../utils/useNotification";
import InfoBlocks from "./components/InfoItem";
import { AiOutlineSearch } from "react-icons/ai";
import ProductImageBlock from "./components/ProductImageBlock";
import SideModal from "../components/SideModal/SideModal";

export default function ProductPage() {
  const [user, loading] = useAuthState(auth);
  const { slug } = useParams();
  const searchParams = useSearchParams();
  const variantID = searchParams.get("variantID");
  const [product, setProduct] = useState<Product | null>(null);
  const isLoggedIn = !loading && !!user;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const sizeOptions = (product?.quantitySize || []).map((item) => ({
    value: item.size.toString(),
    label: `Size ${item.size} (${item.quantity} available)`,
  }));

  const insertOptions = (product?.variants || []).map((variant) => ({
    value: `${variant.insert}-${variant.insertColor}`,
    label: `${variant.insert} (${variant.insertColor})`,
  }));

  const specOptions = (product?.variants || []).map((obj) => ({
    value: obj.materialColor,
    label: obj.materialColor,
  }));

  useRequireAuth(user, loading);
  const {
    notify,
    notification = {
      type: "success",
      message: "Product added to cart!",
      duration: 3000,
    },
    clearNotification,
  } = useNotification();

  useEffect(() => {
    if (!slug) return;

    async function fetchProduct() {
      try {
        const productsRef = collection(db, "products");
        const q = query(productsRef, where("slug", "==", slug));
        const querySnap = await getDocs(q);

        if (!querySnap.empty) {
          const docSnap = querySnap.docs[0];
          const fetchedProduct = docSnap.data() as Product;

          if (variantID && fetchedProduct.variants) {
            fetchedProduct.variants = fetchedProduct.variants.map((v) => ({
              ...v,
              id: Number(variantID),
            }));
          }
          setProduct(fetchedProduct);
        } else {
          notify({
            type: "warning",
            message: `No product found for slug: ${slug}`,
          });
        }
      } catch (error) {
        notify({
          type: "error",
          message: `Error fetching product: ${String(error)}`,
        });
      }
    }

    fetchProduct();
  }, [slug, variantID, notify]);

  if (!product) return <Loading />;

  const onSubmit = async (data: any) => {
    if (!user) return;
    const cartItem = {
      productId: product.id,
      name: product.name,
      imageUrl: product.imageUrl,
      price: product.price,
      quantity: 1,
      size: Number(data.size),
      insert: data.inserts,
      materialColor: data.materialColor,
    };

    try {
      const userRef = doc(db, "users", user.uid);
      await updateDoc(userRef, {
        cartItems: arrayUnion(cartItem),
      });
      notify({
        type: "success",
        message: "Product added to cart!",
        duration: 3000,
      });
    } catch (error) {
      notify({
        type: "error",
        message: `Error adding product to cart: ${String(error)}`,
        duration: 3000,
      });
    }
  };


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

        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-8 items-center">
          <ProductImageBlock product={product} />

          <div>
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
                  label="Inserts, Carat"
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

              <p className="text-2xl font-bold text-gray-800 mb-6">
                {product.price ?? "unknown"} ₴
              </p>

              <SelectField
                label="Material Color"
                id="materialColor"
                register={register("materialColor", {
                  required: "Material color is required",
                })}
                error={errors.materialColor}
                options={specOptions}
                placeholder="Select Material Color"
                className="w-full mb-6"
              />

              <SubmitButton
                label="Record for a personal order"
                isLoading={false}
                className="w-full"
              />
            </form>
            <div className="mt-8">
              <InfoBlocks />
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </>
  );
}
