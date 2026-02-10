// "use client";

// import React from "react";
// import LinkButton from "./LinkButton";
// import {
//   OrderStatusValue,
//   PaymentMethodLabel,
//   PaymentStatusLabel,
//   type Order,
// } from "@/types/order";
// import CartItemComponent from "@/app/components/CartItem/CartItemComponent";

// interface OrderCardProps {
//   order: Order;
//   mode?: "detail";
// }

// const SHIPPING_FLOW = [
//   OrderStatusValue.PENDING,
//   OrderStatusValue.SHIPPED,
//   OrderStatusValue.DELIVERED,
// ] as const;

// const REFUND_FLOW = [
//   OrderStatusValue.REFUND_REQUESTED,
//   OrderStatusValue.REFUNDED,
// ] as const;

// type RefundStatus = (typeof REFUND_FLOW)[number];
// const isRefundStatus = (s: OrderStatusValue): s is RefundStatus =>
//   (REFUND_FLOW as readonly OrderStatusValue[]).includes(s);

// export default function OrderCard({ order, mode }: OrderCardProps) {
//   const { orderId, orderDate, products, shippingAddress, paymentInfo, status } =
//     order;

//   let steps: readonly OrderStatusValue[] = SHIPPING_FLOW;
//   let barClass = "bg-blue-500";

//   if (status === OrderStatusValue.CANCELLED) {
//     steps = [OrderStatusValue.CANCELLED];
//     barClass = "bg-red-500";
//   } else if (isRefundStatus(status)) {
//     steps = REFUND_FLOW;
//     barClass = "bg-amber-500";
//   }

//   const currentIndex = steps.indexOf(status);
//   const progressPercent =
//     steps.length > 1 ? (currentIndex / (steps.length - 1)) * 100 : 100;

//   return (
//     <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
//         <h3 className="text-xl font-semibold text-primary-700">
//           Order #{orderId}
//         </h3>
//         {mode !== "detail" && (
//           <LinkButton
//             href={`/Account/Orders/${orderId}/details`}
//             text="View Details"
//             showArrow
//             className="text-primary-500 hover:text-primary-700 underline"
//           />
//         )}
//       </div>

//       <p className="text-sm text-gray-500 mb-6">
//         Placed on:{" "}
//         <span className="text-gray-700">
//           {new Date(orderDate).toLocaleDateString()}
//         </span>
//       </p>

//       <div className="space-y-4 mb-6">
//         {products.map((item, idx) => (
//           <CartItemComponent mode="order" key={idx} item={item} />
//         ))}
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
//         {/* Shipping address */}
//         <div>
//           <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
//           <p className="text-sm text-gray-600">
//             {shippingAddress.addressLabel}
//           </p>
//           <p className="text-sm text-gray-600">{shippingAddress.street}</p>
//           <p className="text-sm text-gray-600">
//             {shippingAddress.city}, {shippingAddress.zipCode}
//           </p>
//         </div>

//         {/* Payment info */}
//         <div>
//           <h4 className="font-medium text-gray-700 mb-2">Payment</h4>
//           <p className="text-sm text-gray-600 mb-1">
//             Status:{" "}
//             <span
//               className={paymentInfo.paid ? "text-green-600" : "text-red-600"}
//             >
//               {paymentInfo.paid
//                 ? PaymentStatusLabel.completed
//                 : PaymentStatusLabel.pending}
//             </span>
//           </p>
//           <p className="text-sm text-gray-600">
//             Method:{" "}
//             {"method" in paymentInfo
//               ? PaymentMethodLabel[
//                   paymentInfo.method as keyof typeof PaymentMethodLabel
//                 ]
//               : "Unknown"}
//           </p>
//         </div>

//         {/* Order / refund / cancel status */}
//         <div>
//           <h4 className="font-medium text-gray-700 mb-2">
//             {status === OrderStatusValue.CANCELLED
//               ? "Order Cancelled"
//               : isRefundStatus(status)
//               ? "Refund Status"
//               : "Order Status"}
//           </h4>

//           <div className="w-full bg-gray-200 h-2 rounded overflow-hidden mb-2">
//             <div
//               className={`h-2 transition-all ${barClass}`}
//               style={{ width: `${progressPercent}%` }}
//             />
//           </div>

//           <div className="flex justify-between text-xs uppercase">
//             {steps.map((step) => (
//               <span
//                 key={step}
//                 className={
//                   step === status
//                     ? "text-primary-500"
//                     : "text-gray-400 whitespace-nowrap"
//                 }
//               >
//                 {step}
//               </span>
//             ))}
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }

"use client";

import React from "react";
import LinkButton from "./LinkButton";
import {
  OrderStatusValue,
  OrderStatusLabel,
  PaymentMethodLabel,
  PaymentStatusLabel,
  type Order,
} from "@/types/order";
import CartItemComponent from "@/app/components/CartItem/CartItemComponent";

interface OrderCardProps {
  order: Order;
  mode?: "detail";
}

const SHIPPING_FLOW = [
  OrderStatusValue.PENDING,
  OrderStatusValue.SHIPPED,
  OrderStatusValue.DELIVERED,
] as const;

const REFUND_FLOW = [
  OrderStatusValue.REFUND_REQUESTED,
  OrderStatusValue.REFUNDED,
] as const;

type RefundStatus = (typeof REFUND_FLOW)[number];
const isRefundStatus = (s: OrderStatusValue): s is RefundStatus =>
  (REFUND_FLOW as readonly OrderStatusValue[]).includes(s);

export default function OrderCard({ order, mode }: OrderCardProps) {
  const { orderId, orderDate, products, shippingAddress, paymentInfo, status } =
    order;

  let steps: readonly OrderStatusValue[] = SHIPPING_FLOW;
  let barClass = "bg-blue-500";

  if (status === OrderStatusValue.CANCELLED) {
    steps = [OrderStatusValue.CANCELLED];
    barClass = "bg-red-500";
  } else if (isRefundStatus(status)) {
    steps = REFUND_FLOW;
    barClass = "bg-amber-500";
  }

  const currentIndex = Math.max(0, steps.indexOf(status));
  const progressPercent =
    steps.length > 1 ? (currentIndex / (steps.length - 1)) * 100 : 100;

  return (
    <div className="bg-gray-50 border border-gray-200 p-6 rounded-lg shadow-sm hover:shadow-md transition-shadow">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold text-primary-700">
          Order #{orderId}
        </h3>
        {mode !== "detail" && (
          <LinkButton
            href={`/Account/Orders/${orderId}/details`}
            text="View Details"
            showArrow
            className="text-primary-500 hover:text-primary-700 underline"
          />
        )}
      </div>

      <p className="text-sm text-gray-500 mb-6">
        Placed on:{" "}
        <span className="text-gray-700">
          {new Date(orderDate).toLocaleDateString()}
        </span>
      </p>

      <div className="space-y-4 mb-6">
        {products.map((item, idx) => (
          <CartItemComponent mode="order" key={idx} item={item} />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Shipping address */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Shipping Address</h4>
          <p className="text-sm text-gray-600">
            {shippingAddress.addressLabel}
          </p>
          <p className="text-sm text-gray-600">{shippingAddress.street}</p>
          <p className="text-sm text-gray-600">
            {shippingAddress.city}, {shippingAddress.zipCode}
          </p>
        </div>

        {/* Payment info */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">Payment</h4>
          <p className="text-sm text-gray-600 mb-1">
            Status:{" "}
            <span
              className={paymentInfo.paid ? "text-green-600" : "text-red-600"}
            >
              {paymentInfo.paid
                ? PaymentStatusLabel.completed
                : PaymentStatusLabel.pending}
            </span>
          </p>
          <p className="text-sm text-gray-600">
            Method:{" "}
            {"method" in paymentInfo
              ? PaymentMethodLabel[
                  paymentInfo.method as keyof typeof PaymentMethodLabel
                ]
              : "Unknown"}
          </p>
        </div>

        {/* Order / refund / cancel status */}
        <div>
          <h4 className="font-medium text-gray-700 mb-2">
            {status === OrderStatusValue.CANCELLED
              ? "Order Cancelled"
              : isRefundStatus(status)
                ? "Refund Status"
                : "Order Status"}
          </h4>

          <div className="w-full bg-gray-200 h-2 rounded overflow-hidden mb-2">
            <div
              className={`h-2 transition-all ${barClass}`}
              style={{ width: `${progressPercent}%` }}
            />
          </div>

          <div className="flex justify-between text-xs uppercase">
            {steps.map((step) => (
              <span
                key={step}
                className={
                  step === status
                    ? "text-primary-500"
                    : "text-gray-400 whitespace-nowrap"
                }
              >
                {OrderStatusLabel[step]}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
