"use client";

import { useState } from "react";
import { Order, OrderStatusValue } from "@/types/order";
import InputField from "@/app/components/FormComponents/InputField";
import ActionButton from "@/app/components/FormComponents/ActionButton";
import LinkButtonForm from "@/app/components/FormComponents/LinkButtonForm";

interface EditOrderFormProps {
  order: Order;
  onSave: (updatedOrder: Order) => void;
}

export default function EditOrderForm({ order, onSave }: EditOrderFormProps) {
  const [formData, setFormData] = useState<Order>(order);

  const isPaymentPending = !formData.paymentInfo?.paid;

  const handleChange = <T extends keyof Order>(field: T, value: Order[T]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleAddressChange = (
    field: keyof Order["shippingAddress"],
    value: string | boolean,
  ) => {
    setFormData((prev) => ({
      ...prev,
      shippingAddress: {
        ...prev.shippingAddress,
        [field]: value,
      },
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
      style={{ fontFamily: "var(--font-poppins)" }}
    >
      <h2 className="text-lg font-semibold">Edit Order #{formData.orderId}</h2>

      {/* Order Status */}
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Order Status
        </label>
        <select
          value={formData.status}
          onChange={(e) =>
            handleChange("status", e.target.value as OrderStatusValue)
          }
          className="w-full border mt-2 p-2 focus:outline-none focus:ring-1 focus:ring-black rounded-none"
        >
          {Object.values(OrderStatusValue).map((status) => (
            <option key={status} value={status}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Shipping Address */}
      <fieldset
        disabled={!isPaymentPending}
        className={!isPaymentPending ? "opacity-60 cursor-not-allowed" : ""}
      >
        <legend className="text-sm font-medium text-gray-700 mb-2">
          Shipping Address
        </legend>

        {/* Label & Names */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Address Label"
            value={formData.shippingAddress.addressLabel || ""}
            onChange={(val) => handleAddressChange("addressLabel", val)}
          />
          <InputField
            label="Title (Mr / Mrs)"
            value={formData.shippingAddress.title || ""}
            onChange={(val) => handleAddressChange("title", val)}
          />
          <InputField
            label="First Name"
            value={formData.shippingAddress.firstName || ""}
            onChange={(val) => handleAddressChange("firstName", val)}
            required={isPaymentPending}
          />
          <InputField
            label="Last Name"
            value={formData.shippingAddress.lastName || ""}
            onChange={(val) => handleAddressChange("lastName", val)}
            required={isPaymentPending}
          />
        </div>

        {/* Street / House */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <InputField
            label="Street"
            value={formData.shippingAddress.street || ""}
            onChange={(val) => handleAddressChange("street", val)}
            required={isPaymentPending}
          />
          <InputField
            label="House Number"
            value={formData.shippingAddress.houseNumber || ""}
            onChange={(val) => handleAddressChange("houseNumber", val)}
          />
        </div>

        {/* Additional info */}
        <InputField
          label="Additional Info"
          value={formData.shippingAddress.additionalInfo || ""}
          onChange={(val) => handleAddressChange("additionalInfo", val)}
          className="mt-4"
        />

        {/* City / State / ZIP / Country */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
          <InputField
            label="City"
            value={formData.shippingAddress.city || ""}
            onChange={(val) => handleAddressChange("city", val)}
            required={isPaymentPending}
          />
          <InputField
            label="State"
            value={formData.shippingAddress.state || ""}
            onChange={(val) => handleAddressChange("state", val)}
          />
          <InputField
            label="ZIP Code"
            value={formData.shippingAddress.zipCode || ""}
            onChange={(val) => handleAddressChange("zipCode", val)}
            required={isPaymentPending}
          />
          <InputField
            label="Country"
            value={formData.shippingAddress.country || ""}
            onChange={(val) => handleAddressChange("country", val)}
            required={isPaymentPending}
          />
        </div>

        {/* Mobile */}
        <InputField
          label="Mobile Phone"
          value={formData.shippingAddress.mobile || ""}
          onChange={(val) => handleAddressChange("mobile", val)}
          className="mt-4"
        />
      </fieldset>

      {/* Save / Back buttons */}
      <div className="space-y-2">
        <ActionButton
          type="submit"
          text="Save Changes"
          className="bg-black hover:bg-gray-800 text-white font-semibold py-2 px-4 w-full"
        />
        <LinkButtonForm
          label="← Back to Orders"
          href="/admin/Orders"
          className="bg-gray-600 hover:bg-gray-700"
        />
      </div>
    </form>
  );
}
