// firebaseUpload.ts

import * as admin from "firebase-admin";
import { getFirestore, Timestamp } from "firebase-admin/firestore";
import serviceAccount from "../serviceAccountKey.json";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
});

const db = getFirestore();

const now = Timestamp.now();
const oneWeekLater = Timestamp.fromDate(
  new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
);

// ==================== DISCOUNTS ====================
const discounts = [
  {
    id: 1,
    name: "10% on Product 1",
    value: 10,
    type: "percentage" as const,
    targetType: "product" as const,
    applicableTo: [1],
    validFrom: now,
    validUntil: oneWeekLater,
    priority: 1,
  },
  {
    id: 2,
    name: "20% on Category 1",
    value: 20,
    type: "percentage" as const,
    targetType: "category" as const,
    applicableTo: [1],
    validFrom: now,
    validUntil: oneWeekLater,
    priority: 3, // более высокий приоритет – должен перекрыть скидку id:1
  },
  {
    id: 3,
    name: "15€ off on Collection 1",
    value: 15,
    type: "fixed" as const,
    targetType: "collection" as const,
    applicableTo: [1],
    validFrom: now,
    validUntil: oneWeekLater,
    priority: 2,
  },
  {
    id: 4,
    name: "30% on Product 2",
    value: 30,
    type: "percentage" as const,
    targetType: "product" as const,
    applicableTo: [2],
    validFrom: now,
    validUntil: oneWeekLater,
    priority: 1,
  },
  {
    id: 5,
    name: "25€ off on Collection 3",
    value: 25,
    type: "fixed" as const,
    targetType: "collection" as const,
    applicableTo: [3],
    validFrom: now,
    validUntil: oneWeekLater,
    priority: 5, // самое высокое значение для продукта 3 (также можно протестировать)
  },
];

// ==================== PRODUCTS ====================
const products = [
  {
    id: 1,
    name: "Gold Ring",
    description: "Elegant gold ring with a timeless design.",
    slug: "gold-ring",
    categoryId: 1,
    variants: [
      {
        id: 101,
        price: 100,
        material: "gold",
        materialColor: "yellow",
        insert: "diamond",
        insertColor: "clear",
        weight: 5,
        quantitySize: [
          { size: 16, quantity: 5 },
          { size: 17, quantity: 5 },
        ],
        images: [
          "/images/products/gold-ring-diamond-yellow/front.jpg",
          "/images/products/gold-ring-diamond-yellow/side.jpg",
          "/images/products/gold-ring-diamond-yellow/back.jpg",
        ],
      },
      {
        id: 102,
        price: 120,
        material: "gold",
        materialColor: "white",
        insert: "diamond",
        insertColor: "blue",
        weight: 6,
        quantitySize: [
          { size: 16, quantity: 2 },
          { size: 17, quantity: 3 },
        ],
        images: [
          "/images/products/gold-ring-diamond-white/front.jpg",
          "/images/products/gold-ring-diamond-white/side.jpg",
          "/images/products/gold-ring-diamond-white/back.jpg",
        ],
      },
    ],
    createdAt: now,
    updatedAt: now,
    price: 100,
    isHidden: false,
    additionalDescription:
      "High-quality gold ring available in two elegant variants, perfect for special occasions.",
  },
  {
    id: 2,
    name: "Silver Earrings",
    description: "Shiny silver earrings with crystal accents.",
    slug: "silver-earrings",
    categoryId: 2,
    variants: [
      {
        id: 201,
        price: 80,
        material: "silver",
        materialColor: "white",
        insert: "crystal",
        insertColor: "blue",
        weight: 3,
        quantitySize: [{ size: 1, quantity: 12 }],
        images: [
          "/images/products/silver-earrings-crystal-white/front.jpg",
          "/images/products/silver-earrings-crystal-white/side.jpg",
        ],
      },
      {
        id: 202,
        price: 85,
        material: "silver",
        materialColor: "rose",
        insert: "crystal",
        insertColor: "green",
        weight: 3.5,
        quantitySize: [{ size: 1, quantity: 6 }],
        images: [
          "/images/products/silver-earrings-crystal-rose/front.jpg",
          "/images/products/silver-earrings-crystal-rose/side.jpg",
        ],
      },
    ],
    createdAt: now,
    updatedAt: now,
    price: 80,
    isHidden: false,
    additionalDescription:
      "Shiny silver earrings crafted with attention to detail, ideal for both casual and formal styles.",
  },
  {
    id: 3,
    name: "Minimalist Pendant",
    description: "Simple and elegant pendant design.",
    slug: "minimalist-pendant",
    categoryId: 3,
    variants: [
      {
        id: 301,
        price: 60,
        material: "gold",
        materialColor: "rose",
        insert: "none",
        insertColor: "",
        weight: 2,
        quantitySize: [{ size: 1, quantity: 8 }],
        images: [
          "/images/products/pendant-minimalist-rose/front.jpg",
          "/images/products/pendant-minimalist-rose/side.jpg",
        ],
      },
      {
        id: 302,
        price: 65,
        material: "gold",
        materialColor: "yellow",
        insert: "none",
        insertColor: "",
        weight: 2.2,
        quantitySize: [{ size: 1, quantity: 4 }],
        images: [
          "/images/products/pendant-minimalist-yellow/front.jpg",
          "/images/products/pendant-minimalist-yellow/side.jpg",
        ],
      },
    ],
    createdAt: now,
    updatedAt: now,
    price: 60,
    isHidden: false,
    additionalDescription:
      "A minimalist pendant available in two finishes, emphasizing simplicity and elegance.",
  },
  {
    id: 4,
    name: "Men’s Ring",
    description: "Bold and strong ring designed for men.",
    slug: "mens-ring",
    categoryId: 4,
    variants: [
      {
        id: 401,
        price: 120,
        material: "steel",
        materialColor: "black",
        insert: "onyx",
        insertColor: "black",
        weight: 6,
        quantitySize: [
          { size: 19, quantity: 3 },
          { size: 20, quantity: 4 },
        ],
        images: [
          "/images/products/mens-ring-steel-black/front.jpg",
          "/images/products/mens-ring-steel-black/side.jpg",
        ],
      },
      {
        id: 402,
        price: 130,
        material: "steel",
        materialColor: "gunmetal",
        insert: "onyx",
        insertColor: "grey",
        weight: 7,
        quantitySize: [
          { size: 19, quantity: 2 },
          { size: 20, quantity: 2 },
        ],
        images: [
          "/images/products/mens-ring-steel-gunmetal/front.jpg",
          "/images/products/mens-ring-steel-gunmetal/side.jpg",
        ],
      },
    ],
    createdAt: now,
    updatedAt: now,
    price: 120,
    isHidden: false,
    additionalDescription:
      "A powerful design in two variants – choose between a matte black finish or a sleek gunmetal look.",
  },
  {
    id: 5,
    name: "Pearl Bracelet",
    description: "Delicate bracelet featuring pearls.",
    slug: "pearl-bracelet",
    categoryId: 5,
    variants: [
      {
        id: 501,
        price: 95,
        material: "silver",
        materialColor: "white",
        insert: "pearl",
        insertColor: "white",
        weight: 4,
        quantitySize: [
          { size: 16, quantity: 10 },
          { size: 18, quantity: 5 },
        ],
        images: [
          "/images/products/pearl-bracelet-silver-white/front.jpg",
          "/images/products/pearl-bracelet-silver-white/side.jpg",
        ],
      },
      {
        id: 502,
        price: 105,
        material: "silver",
        materialColor: "pink",
        insert: "pearl",
        insertColor: "cream",
        weight: 4.2,
        quantitySize: [
          { size: 16, quantity: 2 },
          { size: 18, quantity: 4 },
        ],
        images: [
          "/images/products/pearl-bracelet-silver-pink/front.jpg",
          "/images/products/pearl-bracelet-silver-pink/side.jpg",
        ],
      },
    ],
    createdAt: now,
    updatedAt: now,
    price: 95,
    isHidden: false,
    additionalDescription:
      "An elegant pearl bracelet available in two variants, offering a refined touch for any ensemble.",
  },
];

// ==================== COLLECTIONS ====================
// Помимо стандартных коллекций, добавляем базовую коллекцию "Rings Collection" и подколлекцию "Wedding Rings"
// для теста связи через parentCategory.
const collections = [
  {
    id: 1,
    name: "Golden Classics",
    description: "Timeless gold designs",
    images: ["/collections/gold.jpg"],
    parentCategory: 1, // Предполагается, что эта коллекция привязана к категории 1
    isActive: true,
    createdAt: now,
    productIds: [1],
  },
  {
    id: 2,
    name: "Silver Dreams",
    description: "Modern silver jewelry",
    images: ["/collections/silver.jpg"],
    parentCategory: 2,
    isActive: true,
    createdAt: now,
    productIds: [2],
  },
  {
    id: 3,
    name: "Elegant Simplicity",
    description: "Minimalist beauty",
    images: ["/collections/minimal.jpg"],
    parentCategory: 3,
    isActive: true,
    createdAt: now,
    productIds: [3],
  },
  {
    id: 4,
    name: "Men’s Collection",
    description: "Rings and bracelets for men",
    images: ["/collections/men.jpg"],
    parentCategory: 4,
    isActive: true,
    createdAt: now,
    productIds: [4],
  },
  {
    id: 5,
    name: "Pearl Elegance",
    description: "Bracelets with pearls",
    images: ["/collections/pearl.jpg"],
    parentCategory: 5,
    isActive: true,
    createdAt: now,
    productIds: [5],
  },
  // Новые коллекции для теста связи через parentCategory
  {
    id: 10,
    name: "Rings Collection",
    description: "Base collection for rings",
    images: ["/collections/rings.jpg"],
    parentCategory: 0, // 0 или null можно использовать для обозначения базовой категории
    isActive: true,
    createdAt: now,
    productIds: [], // здесь могут не быть продуктов напрямую
  },
  {
    id: 11,
    name: "Wedding Rings",
    description: "A curated subcollection of wedding rings.",
    images: ["/collections/wedding-rings.jpg"],
    // Здесь parentCategory ссылается на базовую коллекцию "Rings Collection" (id: 10)
    parentCategory: 10,
    isActive: true,
    createdAt: now,
    productIds: [1], // назначаем для теста, что товар 1 (Gold Ring) является обручальным кольцом
  },
];

// ==================== UPLOAD ====================
async function uploadAll() {
  const productBatch = db.batch();
  const collectionBatch = db.batch();
  const discountBatch = db.batch();

  // Загрузка товаров
  products.forEach((product) => {
    const ref = db.collection("products").doc(product.id.toString());
    productBatch.set(ref, product);
  });

  collections.forEach((collection) => {
    const ref = db.collection("collections").doc(collection.id.toString());
    collectionBatch.set(ref, collection);
  });

  discounts.forEach((discount) => {
    const ref = db.collection("discounts").doc(discount.id.toString());
    discountBatch.set(ref, discount);
  });

  await productBatch.commit();
  await collectionBatch.commit();
  await discountBatch.commit();
  console.log("✅ Products, Collections, and Discounts uploaded successfully.");
}

uploadAll().catch((error) => {
  console.error("Error uploading data:", error);
  process.exit(1);
});
