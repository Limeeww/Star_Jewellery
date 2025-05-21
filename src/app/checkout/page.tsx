"use client";

import React, { useState, useEffect, useCallback } from "react";

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
import { useLocalOrder, useSubmitOrder } from "@/hooks";
import { useCartContext } from "@/app/contexts/CartContent";
import { useBonuses } from "@/hooks/useBonuses";

import {
  calculateDiscountPercentFromBonuses,
  calculateDiscountAmount,
} from "@/services/bonusesService";

import {
  calculateOriginalPriceSum,
  getSubtotal,
  getShippingCost,
  getGiftOptionsTotal,
} from "@/utils";

import type { PaymentInfo } from "@/types/order";
import type { Address } from "@/types/userTypes";
import type { GiftOptionsForm } from "@/types/order";
import { LuCreditCard, LuMapPin } from "react-icons/lu";
import { useAuthStatus } from "@/hooks/useAuthStatus";

export default function CheckoutPage() {
  const { notification, clearNotification } = useNotification();

  const { user, isLoggedIn } = useAuthStatus();

  const { cartItems: products } = useCartContext();
  const order = useLocalOrder();

  const {
    addresses,
    loading: loadingAddrs,
    selectedIndex: addrIdx,
    selectAddress,
    add: addAddress,
    update: updateAddress,
    remove: removeAddress,
  } = useAddresses();

  const {
    paymentMethods,
    loading: loadingPM,
    selectedIndex: pmIdx,
    selectPayment,
    add: addPM,
    update: updatePM,
    remove: removePM,
  } = usePaymentMethods();

  const { bonuses, loading: loadingBonuses } = useBonuses(user?.uid ?? null);
  const [usePoints, setUsePoints] = useState(false);

  const [shipAddress, setShipAddress] = useState<Address | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<PaymentInfo | null>(
    null
  );

  const original = calculateOriginalPriceSum(products);
  const subtotal = getSubtotal(products);
  const shipping = getShippingCost(subtotal);

  const giftOptsArray: GiftOptionsForm[] = Array.isArray(order?.giftOptions)
    ? order.giftOptions
    : order?.giftOptions
    ? [order.giftOptions]
    : [];

  const giftTotal = getGiftOptionsTotal(giftOptsArray);

  const discountPercent =
    usePoints && bonuses >= 100
      ? calculateDiscountPercentFromBonuses(bonuses)
      : 0;
  const discountAmount =
    discountPercent > 0 ? calculateDiscountAmount(subtotal, bonuses) : 0;

  const finalTotal = +(
    subtotal +
    shipping +
    giftTotal -
    discountAmount
  ).toFixed(2);
  const usedBonuses = usePoints && bonuses >= 100 ? bonuses : 0;

  const { submit: handleSubmitOrder, submitting } = useSubmitOrder({
    order,
    shipAddress,
    selectedPayment,
    pmIdx,
    usedBonuses,
    finalTotal,
  });

  useEffect(() => {
    if (!order) return;
    if (order.shippingAddress) {
      setShipAddress(order.shippingAddress);
    } else if (!loadingAddrs && addresses.length > 0) {
      setShipAddress(addresses[addrIdx ?? 0]);
    }
    if (order.paymentInfo) {
      setSelectedPayment(order.paymentInfo);
    }
  }, [order, addresses, addrIdx, loadingAddrs]);

  const handleAddressSelect = useCallback(
    (addr: Address, idx: number) => {
      setShipAddress(addr);
      selectAddress(idx);
    },
    [selectAddress]
  );

  const handlePaymentSelect = useCallback(
    (pm: PaymentInfo, idx: number) => {
      setSelectedPayment(pm);
      selectPayment(idx);
    },
    [selectPayment]
  );

  if (!order) {
    return <Loading />;
  }

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600">Please sign in to access checkout.</p>
      </div>
    );
  }

  const buttonText = submitting
    ? "Submitting…"
    : products.length === 0
    ? "No Products in Cart"
    : order.paymentInfo?.paid
    ? "Already Paid"
    : !shipAddress
    ? "Select Address First"
    : pmIdx === null
    ? "Select Payment Method First"
    : "Confirm Payment";

  return (
    <>
      {notification && (
        <Notification {...notification} onClose={clearNotification} />
      )}
      <Navbar isScrolled isLoggedIn={isLoggedIn} />

      <main
        className="min-h-screen bg-gray-50 p-4 text-gray-800 mt-10"
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
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <LuCreditCard size={18} /> Payment Method
                </h3>
                <SelectPaymentMethod
                  paymentMethods={paymentMethods}
                  loading={loadingPM}
                  add={addPM}
                  update={updatePM}
                  remove={removePM}
                  selectedIndex={pmIdx}
                  onSelect={handlePaymentSelect}
                />
              </section>

              <section className="bg-white p-4 rounded shadow">
                <h3 className="text-lg font-semibold mb-2 flex items-center gap-2">
                  <LuMapPin size={18} /> Shipping Address
                </h3>
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
                total={finalTotal}
                mode="checkout"
                bonuses={bonuses}
                usePoints={usePoints}
                loadingBonuses={loadingBonuses}
                onToggleUsePoints={() => setUsePoints((p) => !p)}
                onClick={handleSubmitOrder}
                disabled={
                  submitting ||
                  products.length === 0 ||
                  order.paymentInfo?.paid ||
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
