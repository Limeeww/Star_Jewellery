// firebaseUpload.ts

import * as admin from "firebase-admin";
import { getFirestore } from "firebase-admin/firestore";
import { ServiceAccount } from "firebase-admin";
import serviceAccountKey from "../serviceAccountKey.json"; 
import { Product } from "../src/app/types/product"; 

admin.initializeApp({
  credential: admin.credential.cert(serviceAccountKey as ServiceAccount),
});

const db = getFirestore();

const products: Product[] = [
  {
    id: 1,
    name: "Ariana Grande Bracelet",
    description:
      "Elegant bracelet with crystals, handcrafted and inspired by Ariana Grande's style.",
    slug: "ariana-grande-bracelet",
    imageUrl: "/images/products/ariana-bracelet/main.jpg",
    categoryId: 1, 
    variants: [
      {
        id: 101,
        price: 99.99,
        materialColor: "silver",
        insert: "crystal",
        insertColor: "clear",
        weight: 10,
        quantity: 50,
      },
      {
        id: 102,
        price: 89.99,
        materialColor: "rose gold",
        insert: "crystal",
        insertColor: "pink",
        weight: 9,
        quantity: 30,
      },
    ],
    discounts: [
      {
        id: 1,
        name: "New Year Discount",
        value: 10,
        type: "percentage",
        applicableTo: [1, 2],
        validFrom: new Date("2023-12-25"),
        validUntil: new Date("2024-01-05"),
      },
    ],
    createdAt: new Date("2023-01-01T12:00:00Z"),
    updatedAt: new Date("2023-01-15T12:00:00Z"),
    price: 99.99,
    isHideen: false,
    additionalDescription:
      "This bracelet features a stunning design with premium materials and exceptional craftsmanship.",
    quantitySize: [
      { size: 6, quantity: 10 },
      { size: 7, quantity: 15 },
    ],
  },
  {
    id: 2,
    name: "One Bracelet",
    description: "A bracelet with timeless elegance and refined design.",
    slug: "one-bracelet",
    imageUrl: "/images/products/one-bracelet/main.jpg",
    categoryId: 1,
    variants: [
      {
        id: 201,
        price: 79.99,
        materialColor: "gold",
        insert: "gemstone",
        insertColor: "blue",
        weight: 8,
        quantity: 40,
      },
    ],
    createdAt: new Date("2023-02-10T09:00:00Z"),
    updatedAt: new Date("2023-02-15T09:00:00Z"),
    price: 79.99,
    isHideen: false,
    additionalDescription:
      "One Bracelet is crafted with a focus on timeless style and enduring quality.",
    quantitySize: [
      { size: 5, quantity: 5 },
      { size: 6, quantity: 8 },
    ],
  },
  {
    id: 3,
    name: "Swarovski Remix",
    description: "Modern design with handcrafted Swarovski crystals.",
    slug: "swarovski-remix",
    imageUrl: "/images/products/swarovski-remix/main.jpg",
    categoryId: 1,
    variants: [
      {
        id: 301,
        price: 120.0,
        materialColor: "silver",
        insert: "swarovski crystal",
        insertColor: "multicolor",
        weight: 12,
        quantity: 25,
      },
    ],
    discounts: [
      {
        id: 2,
        name: "Spring Sale",
        value: 15,
        type: "fixed",
        applicableTo: [3],
        validFrom: new Date("2023-03-01"),
        validUntil: new Date("2023-03-31"),
      },
    ],
    createdAt: new Date("2023-03-01T10:00:00Z"),
    updatedAt: new Date("2023-03-05T10:00:00Z"),
    price: 120.0,
    isHideen: false,
    additionalDescription:
      "Swarovski Remix blends modern aesthetics with the sparkle of genuine Swarovski crystals.",
    quantitySize: [
      { size: 7, quantity: 12 },
      { size: 8, quantity: 10 },
    ],
  },
  {
    id: 4,
    name: "Inter-Belly Bracelet",
    description:
      "A modern style bracelet for those who appreciate current trends.",
    slug: "inter-belly-bracelet",
    imageUrl: "/images/products/inter-belly-bracelet/main.jpg",
    categoryId: 1,
    variants: [
      {
        id: 401,
        price: 110.0,
        materialColor: "platinum",
        insert: "pearl",
        insertColor: "white",
        weight: 11,
        quantity: 20,
      },
    ],
    createdAt: new Date("2023-04-01T11:00:00Z"),
    updatedAt: new Date("2023-04-02T11:00:00Z"),
    price: 110.0,
    isHideen: false,
    additionalDescription:
      "Inter-Belly Bracelet stands out with its unique design and contemporary flair.",
    quantitySize: [
      { size: 6, quantity: 7 },
      { size: 7, quantity: 10 },
    ],
  },
  {
    id: 5,
    name: "Men's Vinto Ring",
    description:
      "Classic ring for the modern man, focusing on style and quality.",
    slug: "mens-vinto-ring",
    imageUrl: "/images/products/mens-vinto-ring/main.jpg",
    categoryId: 2,
    variants: [
      {
        id: 501,
        price: 150.0,
        materialColor: "black",
        insert: "diamond",
        insertColor: "clear",
        weight: 15,
        quantity: 10,
      },
      {
        id: 502,
        price: 145.0,
        materialColor: "black",
        insert: "diamond",
        insertColor: "grey",
        weight: 14,
        quantity: 15,
      },
    ],
    discounts: [
      {
        id: 3,
        name: "Valentine's Special",
        value: 20,
        type: "percentage",
        applicableTo: [5],
        validFrom: new Date("2023-02-10"),
        validUntil: new Date("2023-02-20"),
      },
    ],
    createdAt: new Date("2023-01-20T14:00:00Z"),
    updatedAt: new Date("2023-01-25T14:00:00Z"),
    price: 150.0,
    isHideen: false,
    additionalDescription:
      "Men's Vinto Ring offers a refined blend of modern design and timeless elegance.",
    quantitySize: [
      { size: 10, quantity: 5 },
      { size: 11, quantity: 3 },
    ],
  },
];

async function uploadProducts() {
  const batch = db.batch();
  products.forEach((product) => {
    const productRef = db.collection("products").doc(product.id.toString());
    batch.set(productRef, product);
  });
  await batch.commit();
  console.log("Products uploaded successfully!");
}

uploadProducts().catch((error) => {
  console.error("Error uploading products:", error);
});
