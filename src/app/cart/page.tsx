"use client";

import React, { useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import Image from "next/image";
import Link from "next/link";
import { useForm } from "react-hook-form";
import CheckboxField from "@/app/components/FormComponents/CheckboxField";
import Item from "../components/Item/Item"; // Предположим, ваш компонент для "Recently Viewed"
import { Product } from "@/app/types/product"; // Если нужен тип Product

// Пример типа для CartItem
interface CartItem {
  id: number;
  name: string;
  image: string;
  description?: string;
  price: number;
  quantity: number;
  notDiscountable?: boolean; // пример флага
}

// Пример формы подарочных опций
interface GiftOptionsForm {
  giftPackaging: boolean;
  giftMessage: boolean;
  giftReceipt: boolean;
}

// Пример данных для Recently Viewed
const recentlyViewed: Product[] = [
  {
    id: 101,
    name: "Crystal Bracelet",
    description: "Sparkling piece with adjustable chain",
    image: "/images/bracelet.jpg",
    price: 120,
    slug: "crystal-bracelet",
    variantID: "variant-1",
  },
  {
    id: 102,
    name: "Silver Earrings",
    description: "Minimalistic style, perfect for everyday",
    image: "/images/earrings.jpg",
    price: 45,
    slug: "silver-earrings",
    variantID: "variant-2",
  },
];

export default function CartPage() {
  const [user, loading] = useAuthState(auth);
  const isLoggedIn = !loading && !!user;

  // Моковые данные корзины
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: 1,
      name: "Ariana Grande x Swarovski Tennis Necklace",
      image: "/images/necklace.jpg",
      description: "Various cuts, Heart, White, Rhodium plated",
      price: 280,
      quantity: 1,
      notDiscountable: true,
    },
    {
      id: 2,
      name: "Classic Ring",
      image: "/images/ring.jpg",
      description: "Sterling Silver, Size 7",
      price: 60,
      quantity: 2,
    },
  ]);

  // Подсчитываем общее количество товаров и subtotal
  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);

  // Считаем стоимость доставки (простой пример)
  const shipping = subtotal > 100 ? 0 : 10;

  // Форма подарочных опций
  const {
    register,
    watch,
    formState: { errors },
  } = useForm<GiftOptionsForm>({
    defaultValues: {
      giftPackaging: false,
      giftMessage: false,
      giftReceipt: false,
    },
  });

  // Следим за выбранными gift-опциями
  const watchGiftPackaging = watch("giftPackaging", false);
  const watchGiftMessage = watch("giftMessage", false);
  const watchGiftReceipt = watch("giftReceipt", false);

  // Стоимость опций
  const giftPackagingCost = watchGiftPackaging ? 3.5 : 0;
  const giftMessageCost = watchGiftMessage ? 0 : 0;
  const giftReceiptCost = watchGiftReceipt ? 0 : 0;

  const giftOptionsTotal = giftPackagingCost + giftMessageCost + giftReceiptCost;

  // Общая сумма
  const total = subtotal + shipping + giftOptionsTotal;

  // Увеличение/уменьшение количества товара
  const incrementQuantity = (id: number) => {
    const updated = cartItems.map((item) =>
      item.id === id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updated);
  };

  const decrementQuantity = (id: number) => {
    const updated = cartItems.map((item) =>
      item.id === id && item.quantity > 1
        ? { ...item, quantity: item.quantity - 1 }
        : item
    );
    setCartItems(updated);
  };

  // Удаление товара
  const removeItem = (id: number) => {
    const updated = cartItems.filter((item) => item.id !== id);
    setCartItems(updated);
  };

  return (
    <>
      <Navbar isScrolled={true} isLoggedIn={isLoggedIn} />

      <main className="min-h-screen bg-gray-50 p-4 text-gray-800 mt-10">
        <div className="container mx-auto">
          {/* Заголовок корзины с количеством товаров */}
          <h1
            className="text-4xl font-semibold mb-6 mt-10 text-center"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Cart ({totalCount})
          </h1>

          {/* Если корзина пуста */}
          {cartItems.length === 0 ? (
            <div className="bg-white p-4 rounded shadow">
              <p className="text-gray-600">Your cart is currently empty.</p>
              <Link
                href="/"
                className="inline-block mt-2 text-sm underline text-gray-700 hover:text-black transition-colors"
              >
                Return to shop
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Левая часть (товары, Gift Options, Recently Viewed) */}
              <div className="col-span-2 space-y-6">
                {/* Список товаров */}
                <div className="space-y-4">
                  {cartItems.map((item) => (
                    <div
                      key={item.id}
                      className="
                        bg-white 
                        p-4 
                        rounded 
                        shadow 
                        flex 
                        items-center 
                        gap-4
                      "
                    >
                      {/* Изображение */}
                      <div className="relative w-16 h-16 flex-shrink-0">
                        <Image
                          src={item.image}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>

                      {/* Информация о товаре */}
                      <div className="flex flex-col flex-grow">
                        {/* Флаг неучастия в скидках (пример) */}
                        {item.notDiscountable && (
                          <p className="text-xs text-gray-400 mb-1">
                            Not discounted
                          </p>
                        )}
                        <p className="font-semibold text-sm md:text-base">
                          {item.name}
                        </p>
                        {item.description && (
                          <p className="text-xs md:text-sm text-gray-500">
                            {item.description}
                          </p>
                        )}
                      </div>

                      {/* Количество */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => decrementQuantity(item.id)}
                          className="
                            px-2 
                            py-1 
                            border 
                            text-sm 
                            hover:bg-gray-100 
                            transition
                          "
                        >
                          -
                        </button>
                        <span className="w-6 text-center">{item.quantity}</span>
                        <button
                          onClick={() => incrementQuantity(item.id)}
                          className="
                            px-2 
                            py-1 
                            border 
                            text-sm 
                            hover:bg-gray-100 
                            transition
                          "
                        >
                          +
                        </button>
                      </div>

                      {/* Удалить товар */}
                      <button
                        onClick={() => removeItem(item.id)}
                        className="
                          text-sm 
                          underline 
                          text-gray-700 
                          hover:text-black 
                          transition-colors
                        "
                      >
                        Remove
                      </button>

                      {/* Цена */}
                      <p
                        className="font-semibold text-sm md:text-base"
                        style={{ fontFamily: "var(--font-poppins)" }}
                      >
                        {item.price * item.quantity} EUR
                      </p>
                    </div>
                  ))}
                </div>

                {/* Gift Options */}
                <div className="bg-white p-4 rounded shadow">
                  <h2 className="font-semibold text-lg mb-4">Gift Options</h2>
                  <div className="flex flex-col gap-3">
                    {/* Gift Packaging */}
                    <div className="flex items-center justify-between">
                      <CheckboxField
                        label="Add gift packaging"
                        id="giftPackaging"
                        register={register("giftPackaging")}
                      />
                      <p
                        className="text-sm font-semibold"
                        style={{ fontFamily: "var(--font-poppins)" }}
                      >
                        €3.50
                      </p>
                    </div>

                    {/* Gift Message */}
                    <div className="flex items-center justify-between">
                      <CheckboxField
                        label="Add gift message"
                        id="giftMessage"
                        register={register("giftMessage")}
                      />
                      <p
                        className="text-sm font-semibold"
                        style={{ fontFamily: "var(--font-poppins)" }}
                      >
                        Free
                      </p>
                    </div>

                    {/* Gift Receipt */}
                    <div className="flex items-center justify-between">
                      <CheckboxField
                        label="Add free gift receipt"
                        id="giftReceipt"
                        register={register("giftReceipt")}
                      />
                      <p
                        className="text-sm font-semibold"
                        style={{ fontFamily: "var(--font-poppins)" }}
                      >
                        Free
                      </p>
                    </div>
                  </div>
                </div>

                {/* Recently Viewed */}
                <div>
                  <h2 className="font-semibold text-lg mb-2">Recently Viewed</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                    {recentlyViewed.map((product) => (
                      <Item key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              </div>

              {/* Правая часть (Order Summary) */}
              <div className="col-span-1">
                <div className="bg-white p-4 rounded shadow space-y-4">
                  <h2 className="text-lg font-semibold mb-2">Order Summary</h2>

                  <div className="flex justify-between">
                    <p className="text-gray-600">Subtotal</p>
                    <p
                      className="font-semibold"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      €{subtotal.toLocaleString()}
                    </p>
                  </div>

                  <div className="flex justify-between">
                    <p className="text-gray-600">Shipping</p>
                    <p
                      className="font-semibold"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      {shipping === 0 ? "Free" : `€${shipping.toLocaleString()}`}
                    </p>
                  </div>

                  {/* Дополнительные опции (gift options) */}
                  {giftOptionsTotal > 0 && (
                    <div className="flex justify-between">
                      <p className="text-gray-600">Gift Options</p>
                      <p
                        className="font-semibold"
                        style={{ fontFamily: "var(--font-poppins)" }}
                      >
                        €{giftOptionsTotal.toFixed(2)}
                      </p>
                    </div>
                  )}

                  <hr />

                  <div className="flex justify-between">
                    <p className="font-semibold">Total</p>
                    <p
                      className="font-semibold"
                      style={{ fontFamily: "var(--font-poppins)" }}
                    >
                      €{total.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                    </p>
                  </div>

                  <button
                    className="
                      w-full
                      mt-4
                      bg-gray-800
                      text-white
                      py-2
                      hover:bg-black
                      transition-colors
                      rounded
                    "
                  >
                    Proceed to Checkout
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </>
  );
}
