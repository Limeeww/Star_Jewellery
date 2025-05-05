"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "@/firebase/firebaseConfig";
import Navbar from "@/app/components/Navbar/Navbar";
import Footer from "@/app/components/Footer/Footer";
import Loading from "@/app/components/Loading/Loading";
import Notification from "@/app/components/MessageHandling/Notification";
import { useNotification } from "@/hooks/useNotification";
import SelectShippingAddress from "@/app/checkout/components/SelectShippingAddress";
import SelectPaymentMethod from "@/app/checkout/components/SelectPaymentMethod";
import OrderSummary from "@/app/cart/components/OrderSummary";
import { useAddresses } from "@/hooks/useAddresses";
import { usePaymentMethods } from "@/hooks/usePaymentMethods";
import type { PaymentInfo } from "@/types/order";
import type { Address } from "@/types/userTypes";
import {
  calculateOriginalPriceSum,
  getSubtotal,
  getShippingCost,
  getGiftOptionsTotal,
  getTotal,
} from "@/utils";
import { useLocalOrder, useSubmitOrder } from "@/hooks";

// Используем контекст корзины вместо useCartItems
import { useCartContext } from "@/app/contexts/CartContent";

export default function CheckoutPage() {
  const { notification, clearNotification } = useNotification();
  const [user, loadingAuth] = useAuthState(auth);
  const isLoggedIn = !!user && !loadingAuth;

  const {
    addresses,
    loading: loadingAddrs,
    add: addAddress,
    update: updateAddress,
    remove: removeAddress,
    selectedIndex: addrIdx,
    selectAddress,
  } = useAddresses();

  const {
    paymentMethods,
    loading: loadingPM,
    add,
    update,
    remove,
    selectedIndex: pmIdx,
    selectPayment,
  } = usePaymentMethods();

  const order = useLocalOrder();

  // Получаем элементы корзины из контекста
  const { cartItems: products } = useCartContext();

  const [shipAddress, setShipAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentInfo | null>(
    null
  );

  useEffect(() => {
    if (!order) return;
    if (order.shippingAddress) setShipAddress(order.shippingAddress);
    else if (!loadingAddrs && addresses.length)
      setShipAddress(addresses[addrIdx ?? 0]);
    if (order.paymentInfo) setSelectedPayment(order.paymentInfo);
  }, [order, addresses, addrIdx, loadingAddrs]);

  const handleAddressSelect = useCallback(
    (a: Address, i: number) => {
      setShipAddress(a);
      selectAddress(i);
    },
    [selectAddress]
  );

  const handlePaymentSelect = useCallback(
    (pm: PaymentInfo, i: number) => {
      setSelectedPayment(pm);
      selectPayment(i);
    },
    [selectPayment]
  );

  const { submit: handleSubmitOrder, submitting } = useSubmitOrder(
    order,
    shipAddress,
    selectedPayment,
    pmIdx
  );

  if (loadingAuth || !order) return <Loading />;

  const original = calculateOriginalPriceSum(products);
  const subtotal = getSubtotal(products);
  const shipping = getShippingCost(subtotal);
  const giftTotal = getGiftOptionsTotal(order.giftOptions);
  const total = getTotal(subtotal, shipping, giftTotal);

  const buttonText = submitting
    ? "Submitting…"
    : products.length === 0
    ? "No Products in Cart"
    : order.paymentInfo.paid
    ? "Already Paid"
    : !shipAddress
    ? "Select Address First"
    : pmIdx === null
    ? "Select Payment Method First"
    : "Confirm Payment";

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please sign in to access checkout.</p>
      </div>
    );
  }

  return (
    <>
      {notification && (
        <Notification {...notification} onClose={clearNotification} />
      )}
      <Navbar isScrolled isLoggedIn={isLoggedIn} />

      <main
        className="min-h-screen bg-gray-50 p-4 text-gray-800 mt-10 font-poppins"
        style={{ fontFamily: "var(--font-poppins)" }}
      >
        <div className="container mx-auto">
          <h1
            className="text-4xl mb-6 mt-10 text-center"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Review and Confirm Order
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <section className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Payment Method</h3>
                <SelectPaymentMethod
                  paymentMethods={paymentMethods}
                  loading={loadingPM}
                  add={add}
                  update={update}
                  remove={remove}
                  selectedIndex={pmIdx}
                  onSelect={handlePaymentSelect}
                />
              </section>

              <section className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2">Shipping Address</h3>
                {loadingAddrs ? (
                  <p>Loading addresses…</p>
                ) : (
                  <SelectShippingAddress
                    loading={loadingAddrs}
                    addresses={addresses}
                    onSelect={handleAddressSelect}
                    onAdd={addAddress}
                    onUpdate={updateAddress}
                    onRemove={removeAddress}
                    selectedIndex={addrIdx}
                  />
                )}
              </section>
            </div>
            <div className="lg:col-span-1">
              <OrderSummary
                originalPrice={original}
                subtotal={subtotal}
                shipping={shipping}
                giftOptionsTotal={giftTotal}
                total={total}
                onClick={handleSubmitOrder}
                disabled={
                  submitting ||
                  products.length === 0 ||
                  order.paymentInfo.paid ||
                  !shipAddress ||
                  pmIdx === null
                }
                buttonText={buttonText}
              />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </>
  );
}
