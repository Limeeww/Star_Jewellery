"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { db } from "../../../firebase/firebaseConfig"; 
import { collection, query, getDocs } from "firebase/firestore";
import { Product } from "../../types/product"; 


// DO NOT USE THIS COMPONENT IN THE APP, IT IS FOR TESTING PURPOSES ONLY
const ProductItem = ({ product }: { product: Product }) => {
  const [collapsed, setCollapsed] = useState(true);

  return (
    <div className="border border-gray-200 rounded-lg p-6 shadow-sm bg-white mb-6">
      <div className="flex flex-col md:flex-row items-center">
        <div className="w-full md:w-1/3">
          <Image
            src={product.imageUrl}
            alt={product.name}
            width={500}
            height={300}
            className="object-cover rounded-lg w-full h-48 md:h-auto"
          />
        </div>
        <div className="mt-4 md:mt-0 md:ml-6 w-full md:w-2/3">
          <h3 className="text-2xl font-semibold text-gray-800">
            {product.name}
          </h3>
          <p className="mt-2 text-gray-700">{product.description}</p>
          <p className="mt-2 text-lg text-green-600 font-bold">
            {product.price} ₴
          </p>
        </div>
      </div>
      {!collapsed && (
        <div className="mt-4 text-gray-700">
          {product.additionalDescription && (
            <p className="mb-2">{product.additionalDescription}</p>
          )}
          {product.variants && product.variants.length > 0 && (
            <div className="mb-2">
              <h4 className="font-semibold text-gray-800">Variants:</h4>
              <ul className="list-disc ml-5">
                {product.variants.map((variant) => (
                  <li key={variant.id} className="text-sm">
                    Price: {variant.price} ₴, Material:{" "}
                    <span className="text-blue-600">
                      {variant.materialColor}
                    </span>
                    , Insert: {variant.insert} (
                    <span className="text-blue-600">{variant.insertColor}</span>
                    ), Weight: {variant.weight}g, Quantity: {variant.quantity}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {product.quantitySize && product.quantitySize.length > 0 && (
            <div className="mb-2">
              <h4 className="font-semibold text-gray-800">Sizes:</h4>
              <ul className="list-disc ml-5">
                {product.quantitySize.map((q, index) => (
                  <li key={index} className="text-sm">
                    Size {q.size}:{" "}
                    <span className="text-purple-600">{q.quantity}</span>{" "}
                    available
                  </li>
                ))}
              </ul>
            </div>
          )}
          {product.discounts && product.discounts.length > 0 && (
            <div className="mb-2">
              <h4 className="font-semibold text-gray-800">Discounts:</h4>
              <ul className="list-disc ml-5">
                {product.discounts.map((discount) => (
                  <li key={discount.id} className="text-sm">
                    {discount.name}:{" "}
                    <span className="text-red-500">
                      {discount.value}
                      {discount.type === "percentage" ? "%" : "₴"}
                    </span>{" "}
                    off, valid from{" "}
                    {new Date(discount.validFrom).toLocaleDateString()} to{" "}
                    {new Date(discount.validUntil).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="mt-4 text-sm font-medium text-blue-600 hover:text-blue-800 focus:outline-none"
      >
        {collapsed ? "Expand" : "Collapse"}
      </button>
    </div>
  );
};

const ProductsDisplay = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const q = query(collection(db, "products"));
        const querySnapshot = await getDocs(q);
        const fetchedProducts: Product[] = [];
        querySnapshot.forEach((doc) => {
          fetchedProducts.push({ id: doc.id, ...doc.data() } as unknown as Product);
        });
        setProducts(fetchedProducts);
      } catch (error) {
        console.error("Error fetching products: ", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, []);

  if (loading) {
    return <div className="text-center py-8">Loading products...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-4">
      {products.length ? (
        products.map((product) => (
          <ProductItem key={product.id} product={product} />
        ))
      ) : (
        <p className="text-center text-gray-600">No products found.</p>
      )}
    </div>
  );
};

export default ProductsDisplay;
