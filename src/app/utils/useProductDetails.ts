import { useEffect, useState, useCallback } from "react";
import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
} from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { useNotification } from "./useNotification";
import { Discount, Product, ProductVariant } from "../types/product";
import { Collection } from "../types/collection";

interface UseProductDetailsReturn {
  product: Product | null;
  collectionData: Collection[];
  activeDiscount: Discount | null;
  loading: boolean;
}

export const useProductDetails = (
  slug: string,
  variantID: string | null,
  onVariantFound?: (variant: ProductVariant) => void
): UseProductDetailsReturn => {
  const { notify } = useNotification();
  const [product, setProduct] = useState<Product | null>(null);
  const [collectionData, setCollectionData] = useState<Collection[]>([]);
  const [activeDiscount, setActiveDiscount] = useState<Discount | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const fetchData = useCallback(async () => {
    if (!slug) return;
    try {
      const productsRef = collection(db, "products");
      const productQuery = query(productsRef, where("slug", "==", slug));
      const productSnap = await getDocs(productQuery);

      if (productSnap.empty) {
        notify({
          type: "warning",
          message: `Product with slug ${slug} not found`,
        });
        setLoading(false);
        return;
      }

      const productDoc = productSnap.docs[0];
      const fetchedProduct = productDoc.data() as Product;

      if (variantID && fetchedProduct.variants) {
        const variantFromQuery = fetchedProduct.variants.find(
          (variant) => variant.id === Number(variantID)
        );
        if (variantFromQuery && onVariantFound) {
          onVariantFound(variantFromQuery);
        }
      }

      setProduct(fetchedProduct);

      if (!fetchedProduct.categoryId) {
        setCollectionData([]);
        notify({
          type: "error",
          message: `Product with ID ${fetchedProduct.id} has no collectionId`,
        });
        setLoading(false);
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
        setLoading(false);
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
        const allDiscounts = discountsSnap.docs.map((docSnap) => ({
          ...docSnap.data(),
          id: Number(docSnap.id),
        })) as Discount[];

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
          validDiscounts.sort((a, b) => (b.priority ?? 0) - (a.priority ?? 0));
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
    } finally {
      setLoading(false);
    }
  }, [slug, variantID, notify, onVariantFound]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return { product, collectionData, activeDiscount, loading };
};
