import { useState, useEffect, useMemo } from "react";
import {
  useParams,
  useSearchParams,
  useRouter,
  usePathname,
} from "next/navigation";
import { Timestamp } from "firebase/firestore";

import { Product, ProductVariant, Discount } from "@/app/types/product";
import { Collection } from "@/app/types/collection";

import { useNotification } from "@/hooks/useNotification";
import {
  fetchProductBySlug,
  fetchCollectionById,
  fetchActiveDiscounts,
  findByVariantAttributes,
} from "@/app/utils/product";
import { pushRecent, RecentEntry } from "@/app/utils/recentlyViewed";

export function useProductPage() {
  const { slug } = useParams<{ slug: string }>() ?? {};
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  function replaceVariantInUrl(id: number) {
    const params = new URLSearchParams(searchParams?.toString() || "");
    params.set("variantID", String(id));
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const { notify, notification, clearNotification } = useNotification();

  const [product, setProduct] = useState<Product | null>(null);
  const [collection, setCollection] = useState<Collection | null>(null);
  const [activeDiscount, setActiveDiscount] = useState<Discount | null>(null);

  const initialIdFromUrl = searchParams?.get("variantID");
  const [currentVariantId, setCurrentVariantId] = useState<number | null>(
    initialIdFromUrl ? Number(initialIdFromUrl) : null
  );

  useEffect(() => {
    if (!slug) return;
    (async () => {
      const p = await fetchProductBySlug(slug);
      if (!p) {
        notify({ type: "warning", message: "Product not found" });
        return;
      }
      setProduct(p);

      if (p.categoryId != null) {
        const col = await fetchCollectionById(p.categoryId);
        if (col) {
          setCollection(col);
        }
      }

      const d = await fetchActiveDiscounts(p.id);
      setActiveDiscount(d[0] ?? null);

      if (!initialIdFromUrl) setCurrentVariantId(p.variants[0].id);
    })();
  }, [slug]); // eslint-disable-line react-hooks/exhaustive-deps

  const displayedVariant = useMemo<ProductVariant | undefined>(() => {
    if (!product || currentVariantId == null) return undefined;
    return product.variants.find((v) => v.id === currentVariantId);
  }, [product, currentVariantId]);

  useEffect(() => {
    if (!product) return;
    const urlId = searchParams?.get("variantID");
    if (!urlId) return;
    const num = Number(urlId);
    if (num !== currentVariantId) setCurrentVariantId(num);
  }, [searchParams, product, currentVariantId]);

  useEffect(() => {
    if (!product || !displayedVariant) return;
    const entry: RecentEntry = {
      id: product.id,
      slug: product.slug ?? "",
      name: product.name,
      image: displayedVariant.images?.[0] ?? "/placeholder.jpg",
      variantId: displayedVariant.id,
      newDate: Timestamp.now(),
    };
    pushRecent(entry);
  }, [product, displayedVariant]);

  const sizeOptions = useMemo(() => {
    if (!product) return [];
    const map = new Map<number, { size: number; quantity: number }>();
    product.variants.forEach((v) =>
      v.quantitySize?.forEach((q) => {
        if (!map.has(q.size)) map.set(q.size, q);
      })
    );
    return Array.from(map.values()).map((q) => ({
      value: String(q.size),
      label: `Size ${q.size} (${q.quantity} available)`,
    }));
  }, [product]);

  const insertOptions = useMemo(() => {
    if (!product) return [];
    return Array.from(new Set(product.variants.map((v) => v.insert))).map(
      (i) => ({ value: i, label: i })
    );
  }, [product]);

  const materialColorOptions = useMemo(() => {
    if (!product) return [];
    return Array.from(
      new Set(product.variants.map((v) => v.materialColor.trim()))
    ).map((c) => ({ value: c, label: c }));
  }, [product]);

  const handleInsertChange = (val: string) => {
    if (!product) return;
    const v = findByVariantAttributes(
      product.variants,
      val,
      displayedVariant?.materialColor ?? ""
    );
    if (v && v.id !== currentVariantId) {
      setCurrentVariantId(v.id);
      replaceVariantInUrl(v.id);
    }
  };

  const handleColorChange = (val: string) => {
    if (!product) return;
    const v = findByVariantAttributes(
      product.variants,
      displayedVariant?.insert ?? "",
      val
    );
    if (v && v.id !== currentVariantId) {
      setCurrentVariantId(v.id);
      replaceVariantInUrl(v.id);
    }
  };

  return {
    product,
    collection,
    activeDiscount,
    displayedVariant,

    notification,
    clearNotification,

    sizeOptions,
    insertOptions,
    materialColorOptions,

    handleInsertChange,
    handleColorChange,
  };
}
